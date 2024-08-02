# 基本イメージとして公式の Node.js イメージを使用
FROM node:lts

# 作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# 残りのアプリケーションコードをコピー
COPY . .

# アプリケーションが使用するポートを公開
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "run", "dev"]