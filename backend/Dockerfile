
# 基本イメージを x86_64 アーキテクチャに変更
FROM --platform=linux/amd64 python:3.9-slim-buster

# 作業ディレクトリを設定
WORKDIR /app

# requirements.txt をコピー
COPY requirements.txt .

# 依存関係をインストール
RUN pip install --no-cache-dir -r requirements.txt

# serviceAccountKey.json をコピー
COPY serviceAccountKey.json /app/serviceAccountKey.json


# 残りのアプリケーションコードをコピー
COPY ./carebridge /app/carebridge

# アプリケーションが使用するポートを公開
EXPOSE 8000

# アプリケーションを起動
CMD ["python", "carebridge/manage.py", "runserver", "0.0.0.0:8000"]