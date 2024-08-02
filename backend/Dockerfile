
# 基本イメージとして公式の Python イメージを使用
FROM python:3.8

# 作業ディレクトリを設定
WORKDIR /app

# requirements.txt をコピー
COPY requirements.txt .

# 依存関係をインストール
RUN pip install --no-cache-dir -r requirements.txt

# Djangoプロジェクトを生成
RUN django-admin startproject carebridge_project .

# アプリケーションが使用するポートを公開
EXPOSE 8000

# アプリケーションを起動
CMD ["python", "carebridge_project/manage.py", "runserver", "0.0.0.0:8000"]