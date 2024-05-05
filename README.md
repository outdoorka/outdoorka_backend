# OUTDOORKA 揪好咖 Backend API Project

## API

```http
https://
```

### 參考 `example.env` 建立 `config.env` 檔

```text
PORT=
DATABASE_URL=
DATABASE_PASSWORD=
JWT_EXPIRES_DAY=
JWT_SECRET=
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
```
