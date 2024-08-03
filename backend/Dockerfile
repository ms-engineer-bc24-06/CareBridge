
# 基本イメージとして公式の Python 3.9 イメージを使用
FROM python:3.9

# 作業ディレクトリを設定
WORKDIR /app

# requirements.txt をコピー
COPY requirements.txt .

# 依存関係をインストール
RUN pip install --no-cache-dir -r requirements.txt

# 残りのアプリケーションコードをコピー
COPY . .

# アプリケーションが使用するポートを公開
EXPOSE 8000

# アプリケーションを起動
CMD ["python", "carebridge/manage.py", "runserver", "0.0.0.0:8000"]