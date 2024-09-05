#!/bin/bash
# Copyright 2020 Google Inc. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# Add repository for the Google monitoring agent.
#
# This script adds the required apt or yum repository and installs or uninstalls
# the agent based on the corresponding flags.
#
# Available flags:
# *  `--verbose`:
#     Turns on verbose logging during the script execution, which is helpful for
#     debugging purposes.
#
# *  `--also-install`:
#     Installs the agent after adding the agent package repository. If this flag
#     is absent, the script only adds the agent package repository. This flag
#     can not be run with the `--uninstall` flag.
#
# *  `--version <VERSION>`:
#     Sets the agent version for the script to install. Allowed formats:
#    *  `latest`:
#        Adds an agent package repository that contains all agent versions, and
#        installs the latest version of the agent.
#    *  `MAJOR_VERSION.*.*`:
#        Adds an agent package repository that contains all agent versions up to
#        this major version (e.g. `1.*.*`), and installs the latest version of
#        the agent within the range of that major version.
#    *  `MAJOR_VERSION.MINOR_VERSION.PATCH_VERSION`:
#        Adds an agent package repository that contains all agent versions, and
#        installs the specified version of the agent (e.g. `3.2.1`).
#
# *  `--uninstall`:
#     Uninstalls the agent. This flag can not be run with the `--also-install`
#     flag.
#
# *  `--remove-repo`:
#     Removes the corresponding agent package repository after installing or
#     uninstalling the agent.
#
# *  `--dry-run`:
#     Triggers only a dry run of the script execution and prints out the
#     commands that it is supposed to execute. This is helpful to know what
#     actions the script will take.
#
# Sample usage:
# *  To add the repo that contains all agent versions, run:
#    $ bash add-monitoring-agent-repo.sh
#
# *  To add the repo and also install the agent, run:
#    $ bash add-monitoring-agent-repo.sh --also-install --version=<AGENT_VERSION>
#
# *  To uninstall the agent run:
#    $ bash add-monitoring-agent-repo.sh --uninstall
#
# *  To uninstall the agent and remove the repo, run:
#    $ bash add-monitoring-agent-repo.sh --uninstall --remove-repo
#
# *  To run the script with verbose logging, run:
#    $ bash add-monitoring-agent-repo.sh --also-install --verbose
#
# *  To run the script in dry-run mode, run:
#    $ bash add-monitoring-agent-repo.sh --also-install --dry-run
#
# Internal usage only:
# The environment variable `REPO_SUFFIX` can be set to alter which repository is
# used. A dash (-) will be inserted prior to the supplied suffix. `REPO_SUFFIX`
# defaults to `all` which contains all agent versions across different major
# versions. The full repository name is:
# "google-cloud-monitoring-<DISTRO>[-<ARCH>]-<REPO_SUFFIX>".
#
# Internal usage only:
# The environment variable ARTIFACT_REGISTRY_REGION can be set to refer to an
# Artifact Registry repository ($ARTIFACT_REGISTRY_REGION-<apt/yum>.pkg.dev)
# instead of the usual repository location at packages.cloud.google.com.

# Ignore the return code of command substitution in variables.
# shellcheck disable=SC2155
#
# Initialize var used to notify config management tools of when a change is made.
CHANGED=0

fail() {
  echo >&2 "[$(date +'%Y-%m-%dT%H:%M:%S%z')] $*"
  exit 1
}

# TODO: b/202526819 - use this helper in a few other places, imitating cl/522132798.
run_with_retry() {
  local RETRY_LIMIT=3
  local EXIT_CODE=0
  for count in $(seq 1 "${RETRY_LIMIT}"); do
    "$@" && return 0 || EXIT_CODE=$?
    echo >&2 "Attempt ${count} of ${RETRY_LIMIT} failed. Command:" "$@"
  done
  return ${EXIT_CODE}
}

# Parsing flag value.
declare -a ACTIONS=()
DRY_RUN=''
VERBOSE='false'
while getopts -- '-:' OPTCHAR; do
  case "${OPTCHAR}" in
    -)
      case "${OPTARG}" in
        # Note: Do not remove entries from this list when deprecating flags.
        # That would break user scripts that specify those flags. Instead,
        # leave the flag in place but make it a noop.
        also-install) ACTIONS+=('also-install') ;;
        version=*) AGENT_VERSION="${OPTARG#*=}" ;;
        uninstall) ACTIONS+=('uninstall') ;;
        remove-repo) ACTIONS+=('remove-repo') ;;
        dry-run) echo 'Starting dry run'; DRY_RUN='dryrun' ;;
        verbose) VERBOSE='true' ;;
        *) fail "Unknown option '${OPTARG}'." ;;
      esac
  esac
done
[[ "${ACTIONS[*]}" == *uninstall* || ( "${ACTIONS[*]}" == *remove-repo* && "${ACTIONS[*]}" != *also-install* )]] || \
  ACTIONS+=('add-repo')
# Sort the actions array for easier parsing.
readarray -t ACTIONS < <(printf '%s\n' "${ACTIONS[@]}" | sort)
readonly ACTIONS DRY_RUN VERBOSE

if [[ "${ACTIONS[*]}" == *also-install*uninstall* ]]; then
    fail "Received conflicting flags 'also-install' and 'uninstall'."
fi

if [[ "${VERBOSE}" == 'true' ]]; then
  echo 'Enable verbose logging.'
  set -x
fi

# Host that serves the repositories.
REPO_HOST='packages.cloud.google.com'

# Project used to host testing Artifact Registry repositories.
REPO_PROJECT='cloud-ops-agents-artifacts-dev'

# URL for the monitoring agent documentation.
AGENT_DOCS_URL='https://cloud.google.com/monitoring/agent'

# URL documentation which lists supported platforms for running the monitoring agent.
AGENT_SUPPORTED_URL="${AGENT_DOCS_URL}/#supported_operating_systems"

# Packages to install.
AGENT_PACKAGE='stackdriver-agent'
declare -a ADDITIONAL_PACKAGES=()

if [[ -f /etc/os-release ]]; then
  . /etc/os-release
fi

# If dry-run mode is enabled, echo VM state-changing commands instead of executing them.
dryrun() {
  # Needed for commands that use pipes.
  if [[ ! -t 0 ]]; then
    cat
  fi
  printf -v cmd_str '%q ' "$@"
  echo "DRY_RUN: Not executing '$cmd_str'"
}

refresh_failed() {
  local REPO_TYPE="$1"
  local OS_FAMILY="$2"
  fail "Could not refresh the google-cloud-monitoring ${REPO_TYPE} repositories.
Please check your network connectivity and make sure you are running a supported
${OS_FAMILY} distribution. See ${AGENT_SUPPORTED_URL}
for a list of supported platforms."
}

resolve_version() {
 if [[ "${AGENT_VERSION:-latest}" == 'latest' ]]; then
   AGENT_VERSION=''
 # `MAJOR_VERSION.*.*`.
 elif grep -qE '^[0-9]+\.\*\.\*$' <<<"${AGENT_VERSION}"; then
   REPO_SUFFIX="${REPO_SUFFIX:-"${AGENT_VERSION%%.*}"}"
 elif ! grep -qE '^[0-9]+\.[0-9]+\.[0-9]+$' <<<"${AGENT_VERSION}" && ! grep -qE '^5.5.2-100.*$' <<<"${AGENT_VERSION}"; then
   fail "The agent version [${AGENT_VERSION}] is not allowed. Expected values: [latest],
or anything in the format of [MAJOR_VERSION.MINOR_VERSION.PATCH_VERSION] or [MAJOR_VERSION.*.*] or [5.5.2-100.*]."

 fi
}

handle_debian() {
  declare -a EXTRA_OPTS=()
  [[ "${VERBOSE}" == 'true' ]] && EXTRA_OPTS+=(-oDebug::pkgAcquire::Worker=1)

  # Note that this function is a bit racy: another background task could
  # immediately pick up the lock in between the two apt-get calls, so it's
  # recommended to call this function in a retry loop.
  apt_get_update() {
    # Block until apt-get is ready to install packages, but don't actually
    # install anything. This gives us a better shot at avoiding conflict with
    # other currently-running apt-get invocations.
    apt-get -o DPkg::Lock::Timeout=-1 install || return 1

    # Note that "apt-get update" does not respect setting a lock timeout or we
    # would simply do that.
    apt-get update
  }

  add_repo() {
    [[ -n "${REPO_CODENAME:-}" ]] || lsb_release -v >/dev/null 2>&1 || { \
      run_with_retry apt_get_update || fail "Failed to run apt-get update"
      apt-get -y install lsb-release
      CHANGED=1
    }
    [[ "$(dpkg -l apt-transport-https 2>&1 | grep -o '^[a-z][a-z]')" == 'ii' ]] || { \
      ${DRY_RUN} run_with_retry apt_get_update || fail "Failed to run apt-get update"
      ${DRY_RUN} apt-get -y install apt-transport-https
      CHANGED=1
    }
    [[ "$(dpkg -l ca-certificates 2>&1 | grep -o '^[a-z][a-z]')" == 'ii' ]] || { \
      ${DRY_RUN} run_with_retry apt_get_update || fail "Failed to run apt-get update"
      ${DRY_RUN} apt-get -y install ca-certificates
      CHANGED=1
    }
    local CODENAME="${REPO_CODENAME:-"$(lsb_release -sc)"}"
    local REPO_NAME="google-cloud-monitoring-${CODENAME}-${REPO_SUFFIX:-all}"
    local REPO_URL
    if [[ -n "${ARTIFACT_REGISTRY_REGION}" ]]; then
      REPO_NAME="${REPO_NAME//_/-}"  # Replace underscores with hyphens.
      REPO_URL="https://${ARTIFACT_REGISTRY_REGION}-apt.pkg.dev/projects/${REPO_PROJECT}"
    else
      REPO_URL="https://${REPO_HOST}/apt"
    fi
    local REPO_DATA="deb ${REPO_URL} ${REPO_NAME} main"

    if ! cmp -s <<<"${REPO_DATA}" - /etc/apt/sources.list.d/google-cloud-monitoring.list; then
      echo "Adding agent repository for ${ID}."
      ${DRY_RUN} tee <<<"${REPO_DATA}" /etc/apt/sources.list.d/google-cloud-monitoring.list
      CHANGED=1

      add_apt_key() {
        # TODO(b/201801933): Discontinue use of apt-key.
        ${DRY_RUN} curl --connect-timeout 5 --silent --fail "$1" \
          | ${DRY_RUN} apt-key add -
        CHANGED=1
      }
      add_apt_key "https://${REPO_HOST}/apt/doc/apt-key.gpg"
      # Additional setup is needed for Artifact Registry on Ubuntu:
      # https://cloud.google.com/artifact-registry/docs/os-packages/debian/configure#ubuntu-vm
      if [[ "${ID}" == ubuntu && -n "${ARTIFACT_REGISTRY_REGION}" ]]; then
        add_apt_key "https://${ARTIFACT_REGISTRY_REGION}-apt.pkg.dev/doc/repo-signing-key.gpg"
      fi
    fi
  }

  remove_repo() {
    if [[ -f /etc/apt/sources.list.d/google-cloud-monitoring.list ]]; then
      echo "Removing agent repository for ${ID}."
      ${DRY_RUN} rm /etc/apt/sources.list.d/google-cloud-monitoring.list
      CHANGED=1
    fi
  }

  expected_version_installed() {
    [[ "$(dpkg -l "${AGENT_PACKAGE}" "${ADDITIONAL_PACKAGES[@]}" 2>&1 | grep -o '^[a-z][a-z]' | sort -u)" == 'ii' ]] || \
      return
    if [[ -z "${AGENT_VERSION:-}" ]]; then
      apt-get --dry-run install "${AGENT_PACKAGE}" "${ADDITIONAL_PACKAGES[@]}" \
        | grep -qo '^0 upgraded, 0 newly installed'
    elif grep -qE '^[0-9]+\.\*\.\*$' <<<"${AGENT_VERSION}"; then
      dpkg -l "${AGENT_PACKAGE}" | grep -qE "$AGENT_PACKAGE $AGENT_VERSION" && \
        apt-get --dry-run install "${AGENT_PACKAGE}" "${ADDITIONAL_PACKAGES[@]}" \
        | grep -qo '^0 upgraded, 0 newly installed'
    else
      dpkg -l "${AGENT_PACKAGE}" | grep -qE "$AGENT_PACKAGE $AGENT_VERSION"
    fi
  }

  install_agent() {
    ${DRY_RUN} run_with_retry apt_get_update || refresh_failed 'apt' "${ID}"
    expected_version_installed || { \
      if [[ -n "${AGENT_VERSION:-}" ]]; then
        # apt package version format: e.g. 1.8.0-1.
        # `MAJOR_VERSION.MINOR_VERSION.PATCH_VERSION`.
        if grep -qE '^[0-9]+\.[0-9]+\.[0-9]+$' <<<"${AGENT_VERSION}"; then
          AGENT_VERSION="=${AGENT_VERSION}-*"
        # 5.5.2-100.*
        elif grep -qE '^5.5.2-100.*$' <<<"${AGENT_VERSION}"; then
          AGENT_VERSION="=${AGENT_VERSION}*"
        # `MAJOR_VERSION.*.*`.
        else
          AGENT_VERSION="=${AGENT_VERSION%.\*}"
        fi
      fi
      ${DRY_RUN} apt-get -y --allow-downgrades "${EXTRA_OPTS[@]}" install "${AGENT_PACKAGE}${AGENT_VERSION}" \
        "${ADDITIONAL_PACKAGES[@]}" || fail "${AGENT_PACKAGE} ${ADDITIONAL_PACKAGES[*]} \
installation failed."
      echo "${AGENT_PACKAGE} ${ADDITIONAL_PACKAGES[*]} installation succeeded."
      CHANGED=1
    }
  }

  uninstall_agent() {
     # Return early unless at least one package is installed.
     dpkg -l "${AGENT_PACKAGE}" "${ADDITIONAL_PACKAGES[@]}" 2>&1 | grep -qo '^ii' || return
     ${DRY_RUN} apt-get -y "${EXTRA_OPTS[@]}" remove "${AGENT_PACKAGE}" "${ADDITIONAL_PACKAGES[@]}" || \
       fail "${AGENT_PACKAGE} ${ADDITIONAL_PACKAGES[*]} uninstallation failed."
     echo "${AGENT_PACKAGE} ${ADDITIONAL_PACKAGES[*]} uninstallation succeeded."
     CHANGED=1
  }
}

handle_rpm() {
  declare -a EXTRA_OPTS=()
  [[ "${VERBOSE}" == 'true' ]] && EXTRA_OPTS+=(-v)

  add_repo() {
    local REPO_NAME="google-cloud-monitoring-${CODENAME}-\$basearch-${REPO_SUFFIX:-all}"
    local REPO_URL
    if [[ -n "${ARTIFACT_REGISTRY_REGION}" ]]; then
      # Replace $basearch with the value of uname --hardware-platform (which
      # should be the same thing in the end). We do this because $basearch, AKA
      # x86_64, has an underscore, which Artifact Registry does not support. We
      # have to effectively resolve $basearch now so that we can substitute out
      # the underscore.
      # TODO(b/229159012): Clean this up if Artifact Registry ever supports
      # underscores.
      local BASEARCH="$(uname --hardware-platform)"
      REPO_NAME="${REPO_NAME//\$basearch/${BASEARCH}}"
      REPO_NAME="${REPO_NAME//_/-}"  # Replace underscores with hyphens.
      REPO_URL="https://${ARTIFACT_REGISTRY_REGION}-yum.pkg.dev/projects/${REPO_PROJECT}/${REPO_NAME}"
    else
      REPO_URL="https://${REPO_HOST}/yum/repos/${REPO_NAME}"
    fi
    local REPO_DATA="\
[google-cloud-monitoring]
name=Google Cloud Monitoring Agent Repository
baseurl=${REPO_URL}
autorefresh=0
enabled=1
type=rpm-md
gpgcheck=1
repo_gpgcheck=0
gpgkey=https://${REPO_HOST}/yum/doc/yum-key.gpg
       https://${REPO_HOST}/yum/doc/rpm-package-key.gpg"
    if ! cmp -s <<<"${REPO_DATA}" - /etc/yum.repos.d/google-cloud-monitoring.repo; then
      echo "Adding agent repository for ${ID}."
      ${DRY_RUN} tee <<<"${REPO_DATA}" /etc/yum.repos.d/google-cloud-monitoring.repo
      # After repo upgrades, CentOS7/RHEL7 won't pick up newly available packages
      # until the cache is cleared.
      ${DRY_RUN} rm -rf /var/cache/yum/*/*/google-cloud-monitoring/
      CHANGED=1
    fi
  }

  remove_repo() {
    if [[ -f /etc/yum.repos.d/google-cloud-monitoring.repo ]]; then
      echo "Removing agent repository for ${ID}."
      ${DRY_RUN} rm /etc/yum.repos.d/google-cloud-monitoring.repo
      CHANGED=1
    fi
  }

  expected_version_installed() {
    rpm -q "${AGENT_PACKAGE}" "${ADDITIONAL_PACKAGES[@]}" >/dev/null 2>&1 || return
    if [[ -z "${AGENT_VERSION:-}" ]]; then
      yum -y check-update "${AGENT_PACKAGE}" "${ADDITIONAL_PACKAGES[@]}" >/dev/null 2>&1
    elif grep -qE '^[0-9]+\.\*\.\*$' <<<"${AGENT_VERSION}"; then
      CURRENT_VERSION="$(rpm -q --queryformat '%{VERSION}' "${AGENT_PACKAGE}")"
      grep -qE "${AGENT_VERSION}" <<<"${CURRENT_VERSION}" && \
      yum -y check-update "${AGENT_PACKAGE}" "${ADDITIONAL_PACKAGES[@]}" >/dev/null 2>&1
    else
      CURRENT_VERSION="$(rpm -q --queryformat '%{VERSION}' "${AGENT_PACKAGE}")"
      [[ "${AGENT_VERSION}" == "${CURRENT_VERSION}" ]]
    fi
  }

  install_agent() {
    expected_version_installed || { \
      ${DRY_RUN} yum -y list updates || refresh_failed 'yum' "${ID}"
      local COMMAND='install'
      if [[ -n "${AGENT_VERSION:-}" ]]; then
        [[ -z "${CURRENT_VERSION:-}" ]] || \
        [[ "${AGENT_VERSION}" == "$(sort -rV <<<"${AGENT_VERSION}"$'\n'"${CURRENT_VERSION}" | head -1)" ]] || \
          COMMAND='downgrade'
        # yum package version format: e.g. 1.0.1-1.el8.
        # `MAJOR_VERSION.MINOR_VERSION.PATCH_VERSION`.
        if grep -qE '^[0-9]+\.[0-9]+\.[0-9]+$' <<<"${AGENT_VERSION}"; then
          AGENT_VERSION="-${AGENT_VERSION}-1*"
        # 5.5.2-100.*
        elif grep -qE '^5.5.2-100.*$' <<<"${AGENT_VERSION}"; then
          AGENT_VERSION="-${AGENT_VERSION}*"
        # `MAJOR_VERSION.*.*`.
        else
          AGENT_VERSION="-${AGENT_VERSION}"
        fi
      fi
      ${DRY_RUN} yum -y "${EXTRA_OPTS[@]}" "${COMMAND}" "${AGENT_PACKAGE}${AGENT_VERSION}" \
        "${ADDITIONAL_PACKAGES[@]}" || fail "${AGENT_PACKAGE} ${ADDITIONAL_PACKAGES[*]} \
installation failed."
      echo "${AGENT_PACKAGE} ${ADDITIONAL_PACKAGES[*]} installation succeeded."
      CHANGED=1
    }
  }

  uninstall_agent() {
     # Return early if none of the packages are installed.
     rpm -q "${AGENT_PACKAGE}" "${ADDITIONAL_PACKAGES[@]}" | grep -qvE 'is not installed$' || return
     ${DRY_RUN} yum -y "${EXTRA_OPTS[@]}" remove "${AGENT_PACKAGE}" "${ADDITIONAL_PACKAGES[@]}" || \
       fail "${AGENT_PACKAGE} ${ADDITIONAL_PACKAGES[*]} uninstallation failed."
     echo "${AGENT_PACKAGE} ${ADDITIONAL_PACKAGES[*]} uninstallation succeeded."
     CHANGED=1
  }
}

handle_redhat() {
  local MAJOR_VERSION="$(rpm --eval %{?rhel})"
  CODENAME="${REPO_CODENAME:-"el${MAJOR_VERSION}"}"
  handle_rpm
}

handle_amazon_linux() {
  CODENAME="${REPO_CODENAME:-amzn}"
  handle_rpm
}

handle_suse() {
  declare -a EXTRA_OPTS=()
  [[ "${VERBOSE}" == 'true' ]] && EXTRA_OPTS+=(-vv)

  add_repo() {
    local SUSE_VERSION=${VERSION_ID%%.*}
    local CODENAME="${REPO_CODENAME:-"sles${SUSE_VERSION}"}"
    local REPO_NAME="google-cloud-monitoring-${CODENAME}-\$basearch-${REPO_SUFFIX:-all}"
    local REPO_URL
    if [[ -n "${ARTIFACT_REGISTRY_REGION}" ]]; then
      # Replace $basearch with the value of uname --hardware-platform (which
      # should be the same thing in the end). We do this because $basearch, AKA
      # x86_64, has an underscore, which Artifact Registry does not support. We
      # have to effectively resolve $basearch now so that we can substitute out
      # the underscore.
      # TODO(b/229159012): Clean this up if Artifact Registry ever supports
      # underscores.
      local BASEARCH="$(uname --hardware-platform)"
      REPO_NAME="${REPO_NAME//\$basearch/${BASEARCH}}"
      REPO_NAME="${REPO_NAME//_/-}"  # Replace underscores with hyphens.
      REPO_URL="https://${ARTIFACT_REGISTRY_REGION}-yum.pkg.dev/projects/${REPO_PROJECT}/${REPO_NAME}"
    else
      REPO_URL="https://${REPO_HOST}/yum/repos/${REPO_NAME}"
    fi
    {
      exec 3>&1
      {
        ${DRY_RUN} zypper --non-interactive refresh || { \
          echo >&2 'Could not refresh zypper repositories.'; \
          echo >&2 'This is not necessarily a fatal error; proceeding...'; \
        }
      } \
      | tee >&3 \
      | grep -qF 'Retrieving repository' || [[ -n "${DRY_RUN:-}" ]] && CHANGED=1
    }
    local REPO_DATA="\
[google-cloud-monitoring]
name=Google Cloud Monitoring Agent Repository
baseurl=${REPO_URL}
autorefresh=0
enabled=1
type=rpm-md
gpgkey=https://${REPO_HOST}/yum/doc/yum-key.gpg
       https://${REPO_HOST}/yum/doc/rpm-package-key.gpg"
    if ! cmp -s <<<"${REPO_DATA}" - /etc/zypp/repos.d/google-cloud-monitoring.repo; then
      echo "Adding agent repository for ${ID}."
      ${DRY_RUN} tee <<<"${REPO_DATA}" /etc/zypp/repos.d/google-cloud-monitoring.repo
      CHANGED=1
    fi
    local RPM_KEYS="$(rpm --query gpg-pubkey)"  # Save the installed keys.
    ${DRY_RUN} rpm --import "https://${REPO_HOST}/yum/doc/yum-key.gpg" "https://${REPO_HOST}/yum/doc/rpm-package-key.gpg"
    if [[ -n "${DRY_RUN:-}" ]] || ! cmp --silent <<<"${RPM_KEYS}" - <(rpm --query gpg-pubkey); then
      CHANGED=1
    fi
    {
      exec 3>&1
      {
        ${DRY_RUN} zypper --non-interactive --gpg-auto-import-keys refresh google-cloud-monitoring || \
          refresh_failed 'zypper' "${ID}"; \
      } \
      | tee >&3 \
      | grep -qF 'Retrieving repository' || [[ -n "${DRY_RUN:-}" ]] && CHANGED=1
    }
  }

  remove_repo() {
    if [[ -f /etc/zypp/repos.d/google-cloud-monitoring.repo ]]; then
      echo "Removing agent repository for ${ID}."
      ${DRY_RUN} rm /etc/zypp/repos.d/google-cloud-monitoring.repo
      CHANGED=1
    fi
  }

  expected_version_installed() {
    rpm -q "${AGENT_PACKAGE}" "${ADDITIONAL_PACKAGES[@]}" >/dev/null 2>&1 || return
    if [[ -z "${AGENT_VERSION:-}" ]]; then
      zypper --non-interactive update --dry-run "${AGENT_PACKAGE}" "${ADDITIONAL_PACKAGES[@]}" \
        | grep -qE '^Nothing to do.'
    elif grep -qE '^[0-9]+\.\*\.\*$' <<<"${AGENT_VERSION}"; then
      rpm -q --queryformat '%{VERSION}' "${AGENT_PACKAGE}" | grep -qE "${AGENT_VERSION}" && \
      zypper --non-interactive update --dry-run "${AGENT_PACKAGE}" "${ADDITIONAL_PACKAGES[@]}" \
        | grep -qE '^Nothing to do.'
    else
      [[ "${AGENT_VERSION}" == "$(rpm -q --queryformat '%{VERSION}' "${AGENT_PACKAGE}")" ]]
    fi
  }

  install_agent() {
    expected_version_installed || { \
      if [[ -n "${AGENT_VERSION:-}" ]]; then
        # zypper package version format: e.g. 1.0.6-1.sles15.
        # `MAJOR_VERSION.*.*`.
        if grep -qE '^[0-9]+\.\*\.\*$' <<<"${AGENT_VERSION}"; then
          AGENT_VERSION="<$(( ${AGENT_VERSION%%.*} + 1 ))"
        # 5.5.2-100.*
        elif grep -qE '^5.5.2-100.*$' <<<"${AGENT_VERSION}"; then
          SUSE_VERSION=${VERSION%%-*}
          AGENT_VERSION="=${AGENT_VERSION}.${ID}${SUSE_VERSION}"
        # `MAJOR_VERSION.MINOR_VERSION.PATCH_VERSION`
        else
          AGENT_VERSION="=${AGENT_VERSION}"
        fi
      fi
      ${DRY_RUN} zypper --non-interactive "${EXTRA_OPTS[@]}" install --oldpackage "${AGENT_PACKAGE}${AGENT_VERSION}" \
        "${ADDITIONAL_PACKAGES[@]}" || fail "${AGENT_PACKAGE} ${ADDITIONAL_PACKAGES[*]} \
installation failed."
      if grep -qE '.*5.5.2-100.*' <<<"${AGENT_VERSION}"; then
        systemctl daemon-reload
      fi
      echo "${AGENT_PACKAGE} ${ADDITIONAL_PACKAGES[*]} installation succeeded."
      CHANGED=1
    }
  }

  uninstall_agent() {
     # Return early if none of the packages are installed.
     rpm -q "${AGENT_PACKAGE}" "${ADDITIONAL_PACKAGES[@]}" | grep -qvE 'is not installed$' || return
     ${DRY_RUN} zypper --non-interactive "${EXTRA_OPTS[@]}" remove "${AGENT_PACKAGE}" "${ADDITIONAL_PACKAGES[@]}" || \
       fail "${AGENT_PACKAGE} ${ADDITIONAL_PACKAGES[*]} uninstallation failed."
     echo "${AGENT_PACKAGE} ${ADDITIONAL_PACKAGES[*]} uninstallation succeeded."
     CHANGED=1
  }
}

main() {
  case "${ID:-}" in
    amzn) handle_amazon_linux ;;
    debian|ubuntu) handle_debian ;;
    rhel|centos) handle_redhat ;;
    sles|opensuse-leap) handle_suse ;;
    *)
      # Fallback for systems lacking /etc/os-release.
      if [[ -f /etc/debian_version ]]; then
        ID='debian'
        handle_debian
      elif [[ -f /etc/redhat-release ]]; then
        ID='rhel'
        handle_redhat
      elif [[ -f /etc/SuSE-release ]]; then
        ID='sles'
        handle_suse
      else
        fail "Unidentifiable or unsupported platform. See
${AGENT_SUPPORTED_URL} for a list of supported platforms."
      fi
  esac

  if [[ "${ACTIONS[*]}" == *add-repo* ]]; then
    resolve_version
    add_repo
  fi
  if [[ "${ACTIONS[*]}" == *also-install* ]]; then
    install_agent
  elif [[ "${ACTIONS[*]}" == *uninstall* ]]; then
    uninstall_agent
  fi
  if [[ "${ACTIONS[*]}" == *remove-repo* ]]; then
    remove_repo
  fi

  if [[ "${CHANGED}" == 0 ]]; then
    echo 'No changes made.'
  fi

  if [[ -n "${DRY_RUN:-}" ]]; then
    echo 'Finished dry run. This was only a simulation, remove the --dry-run flag
to perform an actual execution of the script.'
  fi
}

main "$@"
