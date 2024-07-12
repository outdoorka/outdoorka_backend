# OUTDOORKA 揪好咖 Backend API Project

## API

```http
https://outdoorka-backend.onrender.com/api-docs
```

### 環境變數說明，參考 `example.env` 建立 `config.env` 檔

```text
PORT=
DATABASE_URL=
DATABASE_PASSWORD=
LOG_TOKEN=
JWT_EXPIRES_DAY=
JWT_ACCESS_TOKEN=
JWT_REFRESH_TOKEN=
REFRESH_TOKEN_EXPIRES_IN=

# storage
FILE_SIZE_LIMIT=2
FIREBASE_TYPE=
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_AUTH_URI=
FIREBASE_TOKEN_URI=
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=
FIREBASE_CLIENT_X509_CERT_URL=

GOOGLE_EMAIL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_LOGIN_CLIENT_ID=
GOOGLE_LOGIN_CLIENT_SECRET=

ECPAY_URL=
MERCHANTID=
HASHKEY=
HASHIV=
HOST=
```

### Setup

專案套件管理使用 `PNPM`，Node 版本為 `v20.12.0`

```bash
pnpm install
```

### Develop

```bash
pnpm run dev
```

### ESlint Start

```bash
pnpm run lint
```

### Swagger Autogen(Swagger 2.0)

SwaggerUI ： <http://localhost:3006/api-docs>

```bash
pnpm run swagger
```

### 專案技術

- Node.js
- Express
- Typescript
- MongoDB
- Mongoose
- Redis
- ESLint
- prettier
- Husky
- SwaggerUI
- Pino Logging

### 第三方服務

- Cloud Storage for Firebase
- Google SSO
- Better Stack
- EC Pay
- Render

### 資料夾說明

```text
┣ 📂public
┃ ┗ 📂images
┣ 📂src
┃ ┣ 📂connections
┃ ┣ 📂controllers
┃ ┣ 📂middleware
┃ ┣ 📂models
┃ ┣ 📂routes
┃ ┣ 📂services
┃ ┣ 📂types
┃ ┃ ┣ 📂dto
┃ ┃ ┣ 📂enum
┃ ┣ 📂utils
┃ ┣ 📂validate
```

## Contributing

<a href="https://github.com/outdoorka/outdoorka_backend/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=outdoorka/outdoorka_backend" />
</a>

.

<img src="https://i.imgur.com/woq9oCr.png" width="216" height="40">

© 2024 outdoorka
