"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";

interface Staff {
  uuid: string;
  staff_id?: string; // システム内部での識別子
  user_id: string; // Firebaseで使用するユーザーID（メールアドレス）
  firebase_uid?: string; // Firebase UID
  password: string;
  confirmPassword: string;
  facility: string;
  staff_name: string;
  staff_name_kana: string;
  is_admin: boolean;
}

// type NewStaff = Omit<Staff, 'uuid'> & {
//   password: string;
//   confirmPassword: string;
// };

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // 環境変数を使用
});

// CSRFトークンを取得する関数
const getCsrfToken = (): string | null => {
  const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
  return csrfTokenMeta ? csrfTokenMeta.getAttribute("content") : null;
};

// 必須項目ラベルの表示関数
const renderRequiredLabel = () => <span style={{ color: "red" }}>*</span>;

const StaffsManagement: React.FC = () => {
  const [userFacilityId, setUserFacilityId] = useState<string>(""); // ログインしているスタッフの施設IDを保持する状態
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [filteredStaffs, setFilteredStaffs] = useState<Staff[]>([]);
  const [newStaff, setNewStaff] = useState<Staff>({
    uuid: "",
    user_id: "",
    password: "",
    confirmPassword: "",
    facility: "",
    staff_name: "",
    staff_name_kana: "",
    is_admin: false,
  });

  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Firebaseから現在のユーザーのUIDを取得し、それに基づいてスタッフ情報を取得
  const fetchStaffFacilityId = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        // Firebase UIDを使ってスタッフ情報を取得
        const response = await apiClient.get<Staff>(
          `/api/staffs/firebase/${user.uid}/`
        );

        setUserFacilityId(response.data.facility); // 取得した施設IDを状態に設定

        // 施設IDを取得した後にすべてのスタッフ情報を取得
        fetchStaffs();
      } catch (error) {
        console.error("スタッフ情報の取得中にエラーが発生しました:");
      }
    }
  };

  useEffect(() => {
    fetchStaffFacilityId();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredStaffs(staffs);
    } else {
      setFilteredStaffs(
        staffs.filter((staff) =>
          staff.staff_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, staffs]);

  // すべての職員データをサーバーから取得
  const fetchStaffs = async () => {
    try {
      const response = await apiClient.get<Staff[]>("/api/staffs/");
      setStaffs(response.data);
      setFilteredStaffs(response.data);
    } catch (error) {
      console.error("職員の取得中にエラーが発生しました");
    }
  };
  // 職員を追加する処理
  const handleAddStaff = async () => {
    const validationErrors = validateForm(newStaff);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const csrfToken = getCsrfToken();

      // Firebaseにスタッフを作成
      const firebaseResponse = await apiClient.post(
        "/firebaseManagement/create_staff_user/",
        {
          display_name: newStaff.staff_name,
          email: newStaff.user_id,
          password: newStaff.password,
          staff_name_kana: newStaff.staff_name_kana,
          facility: userFacilityId,
          is_admin: newStaff.is_admin,
        },
        {
          headers: {
            "X-CSRFToken": csrfToken || "",
          },
        }
      );

      if (firebaseResponse.status === 200) {
        // Firebaseでの作成が成功したら、DjangoでPostgreSQLに保存
        const dbResponse = await apiClient.post(
          "/api/staffs/create/",
          {
            firebase_uid: firebaseResponse.data.user_id, // Firebaseで生成されたUIDを保存
            facility: userFacilityId,
            staff_name: newStaff.staff_name,
            staff_name_kana: newStaff.staff_name_kana,
            is_admin: newStaff.is_admin,
          },
          {
            headers: {
              "X-CSRFToken": csrfToken || "",
            },
          }
        );

        if (dbResponse.status === 201) {
          setStaffs([...staffs, dbResponse.data]);
          setFilteredStaffs([...staffs, dbResponse.data]);
          setNewStaff({
            uuid: "",
            user_id: "",
            password: "",
            confirmPassword: "",
            facility: userFacilityId ?? "",
            staff_name: "",
            staff_name_kana: "",
            is_admin: false,
          });
          setConfirmPassword("");
          setShowAddForm(false);
          setErrors({});
        } else {
          console.error("DBにスタッフを保存する際にエラーが発生しました");
        }
      } else {
        console.error("サーバーでの職員作成に失敗しました");
      }
    } catch (error) {
      console.error("サーバーでの職員作成に失敗しました");
      setErrors({ api: "職員の作成に失敗しました。" });
    }
  };

  // 職員を編集する処理
  const handleEditStaffClick = (staff: Staff) => {
    if (!staff.uuid) {
      console.error("The staff object does not contain a uuid.");
      return;
    }
    setEditStaff(staff); // 選択された職員を編集用に設定
  };

  const handleEditStaff = (id: number) => {
    const staffToEdit = staffs.find((staff) => staff.uuid === editStaff!.uuid);
    if (staffToEdit) {
      setEditStaff(staffToEdit);
    }
  };

  // 職員情報を更新する処理
  const handleUpdateStaff = async () => {
    if (!editStaff || !editStaff.uuid) {
      console.error("エラーが発生しました");
      setErrors({ uuid: "UUIDが存在しません。" });
      return;
    }

    try {
      const csrfToken = getCsrfToken();
      const response = await apiClient.put(
        `/api/staffs/${editStaff.uuid}/update/`,
        {
          staff_name: editStaff.staff_name,
          staff_name_kana: editStaff.staff_name_kana,
          is_admin: editStaff.is_admin,
          facility: editStaff.facility,
        },
        {
          headers: {
            "X-CSRFToken": csrfToken || "",
          },
        }
      );

      if (response.status === 200) {
        setStaffs(
          staffs.map((staff) =>
            staff.uuid === editStaff.uuid ? response.data : staff
          )
        );
        setFilteredStaffs(
          filteredStaffs.map((staff) =>
            staff.uuid === editStaff.uuid ? response.data : staff
          )
        );
        setEditStaff(null);
        setErrors({});
      } else {
        console.error("Failed to update staff, status code:");
        setErrors({
          api: "更新に失敗しました。サーバーのエラーを確認してください。",
        });
      }
    } catch (error) {
      console.error("職員の更新中にエラーが発生しました");
      setErrors({ api: "サーバーとの通信でエラーが発生しました。" });
    }
  };

  // 職員を削除する処理
  const handleDeleteStaff = async (uuid: string | undefined) => {
    try {
      if (!uuid) {
        console.error("エラーが発生しました");
        return;
      }

      const staffToDelete = staffs.find((staff) => staff.uuid === uuid);
      if (!staffToDelete) {
        console.error("エラーが発生しました");
        return;
      }

      const csrfToken = getCsrfToken();

      // まずDjangoのデータベースから削除
      await apiClient.delete(`/api/staffs/${uuid}/delete/`, {
        headers: {
          "X-CSRFToken": csrfToken || "",
        },
      });

      // 次にFirebaseから削除
      if (staffToDelete.firebase_uid) {
        await apiClient.delete(`/firebaseManagement/delete_staff_user/`, {
          data: {
            firebase_uid: staffToDelete.firebase_uid,
          },
          headers: {
            "X-CSRFToken": csrfToken || "",
          },
        });
      } else {
        console.warn("エラーが発生しました");
      }

      setStaffs((prevStaffs) =>
        prevStaffs.filter((staff) => staff.uuid !== uuid)
      );
      setFilteredStaffs((prevFilteredStaffs) =>
        prevFilteredStaffs.filter((staff) => staff.uuid !== uuid)
      );
    } catch (error) {
      console.error("職員の削除中にエラーが発生しました");
    }
  };

  // パスワードの表示/非表示を切り替える処理
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // フォームのバリデーションを行う処理
  const validateForm = (staff: Staff) => {
    const newErrors: { [key: string]: string } = {};
    if (!staff.staff_name) newErrors.staff_name = "入力必須項目です";
    if (!staff.staff_name_kana) newErrors.staff_name_kana = "入力必須項目です";
    if (!staff.user_id) newErrors.user_id = "入力必須項目です";

    // 新規作成時またはパスワードが必要な時のみパスワードのバリデーションを行う
    if (!editStaff) {
      if (!staff.password) newErrors.password = "入力必須項目です";
      if (staff.password.length < 6)
        newErrors.password = "パスワードは6文字以上である必要があります";
      if (staff.password !== confirmPassword)
        newErrors.confirmPassword = "パスワードが一致しません";
    }

    return newErrors;
  };

  // エラーメッセージを表示する処理
  const renderErrorMessage = (fieldName: string) => {
    if (errors[fieldName]) {
      return <span style={{ color: "red" }}>{errors[fieldName]}</span>;
    }
    return null;
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">職員管理</h1>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <input
            type="text"
            placeholder="名前で検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded mr-2"
          />
          <button
            onClick={() => setSearchTerm("")}
            className="bg-secondary text-white px-4 py-2 rounded"
          >
            クリア
          </button>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setErrors({});
          }}
          className="bg-secondary text-white px-4 py-2 rounded"
        >
          + 新規職員追加
        </button>
      </div>
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-center">職員ID</th>
            <th className="py-2 px-4 border-b text-center">職員名</th>
            <th className="py-2 px-4 border-b text-center">管理者権限</th>
            <th className="py-2 px-4 border-b text-center">アクション</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaffs.map((staff) => (
            <tr key={staff.staff_id}>
              <td className="py-2 px-4 border-b text-center">
                {staff.staff_id}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {staff.staff_name}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <input
                  type="checkbox"
                  checked={staff.is_admin}
                  readOnly
                  className="h-4 w-4"
                />
              </td>
              <td className="py-2 px-4 border-b flex justify-center space-x-2">
                <button
                  onClick={() => handleEditStaffClick(staff)}
                  className="bg-accent2 text-white px-4 py-2 rounded"
                >
                  編集
                </button>
                <button
                  onClick={() => {
                    handleDeleteStaff(staff.uuid);
                  }}
                  className="bg-accent text-white px-4 py-2 rounded"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editStaff && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
            <h2 className="text-2xl mb-4">職員情報を編集</h2>
            <label className="block mb-2">
              名前{renderRequiredLabel()}:
              <input
                type="text"
                value={editStaff.staff_name}
                onChange={(e) =>
                  setEditStaff({ ...editStaff, staff_name: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
              {renderErrorMessage("staff_name")}
            </label>
            <label className="block mb-2">
              名前（かな）{renderRequiredLabel()}:
              <input
                type="text"
                value={editStaff.staff_name_kana}
                onChange={(e) =>
                  setEditStaff({
                    ...editStaff,
                    staff_name_kana: e.target.value,
                  })
                } // 追加
                className="border p-2 rounded w-full"
              />
              {renderErrorMessage("staff_name_kana")}
            </label>
            <label className="block mb-2">
              管理者権限:
              <input
                type="checkbox"
                checked={editStaff.is_admin}
                onChange={(e) =>
                  setEditStaff({ ...editStaff, is_admin: e.target.checked })
                }
                className="h-4 w-4"
              />
            </label>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleUpdateStaff}
                className="bg-accent2 text-white px-4 py-2 rounded"
              >
                更新
              </button>
              <button
                onClick={() => setEditStaff(null)}
                className="bg-accent text-white px-4 py-2 rounded"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
            <h2 className="text-2xl mb-4">追加</h2>
            <label className="block mb-2">
              名前{renderRequiredLabel()}:
              <input
                type="text"
                value={newStaff.staff_name}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, staff_name: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
              {renderErrorMessage("staff_name")}
            </label>
            <label className="block mb-2">
              名前（かな）{renderRequiredLabel()}:
              <input
                type="text"
                value={newStaff.staff_name_kana}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, staff_name_kana: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
              {renderErrorMessage("staff_name_kana")}
            </label>
            <label className="block mb-2">
              メールアドレス{renderRequiredLabel()}:
              <input
                type="email"
                value={newStaff.user_id}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, user_id: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
              {renderErrorMessage("user_id")}
            </label>
            <label className="block mb-2">
              パスワード(数字6桁以上){renderRequiredLabel()}:
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={newStaff.password}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, password: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-2"
                >
                  {passwordVisible ? "隠す" : "表示"}
                </button>
              </div>
              {renderErrorMessage("password")}
              <small className="text-gray-500">
                6文字以上のパスワードを入力してください
              </small>
            </label>
            <label className="block mb-2">
              パスワードの確認(数字6桁以上){renderRequiredLabel()}:
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border p-2 rounded w-full"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-2"
                >
                  {passwordVisible ? "隠す" : "表示"}
                </button>
              </div>
              {renderErrorMessage("confirmPassword")}
            </label>
            <label className="block mb-2">
              管理者権限:
              <input
                type="checkbox"
                checked={newStaff.is_admin}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, is_admin: e.target.checked })
                }
                className="h-4 w-4"
              />
            </label>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleAddStaff}
                className="bg-accent2 text-white px-4 py-2 rounded"
              >
                追加
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-accent text-white px-4 py-2 rounded"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffsManagement;
