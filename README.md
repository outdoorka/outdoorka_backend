# OUTDOORKA 揪好咖 Backend API Project

## API

```http
https://outdoorka-backend.onrender.com/api-docs
```

### 參考 `example.env` 建立 `config.env` 檔

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

### 使用的工具套件

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

### File Structure

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
