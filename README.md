# 🚀 IT-Project Server (NestJS)

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MySql](https://img.shields.io/badge/MySql-4169E1?style=for-the-badge&logo=mysql&logoColor=white)

Server side of the IT project with full authentication cycle and CRUD operations.

## 🌟 Main features

- **Authentication** (JWT + Refresh tokens)
- **Role Model** (User/Admin)
- **Projects and Tasks** (Full CRUD)
- **Swagger documentation** with sample queries
- **File Handling** (Upload/Download)
- **Logging** (Winston + Daily rotate)
- **Containerization** (Docker + Docker-compose)

## 🛠️ Requirements

- Node.js v18+
- PostgreSQL 15+ / MongoDB 6+
- Docker (optional)

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setting up the environment
cp .env.example .env

# 3. Run in development mode
npm run start:dev
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
