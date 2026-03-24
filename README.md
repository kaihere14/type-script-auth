# TypeScript Auth Backend  
**A lightweight, TypeScript‑first Express API for user registration, login, JWT‑based authentication and logout.**  

![Node.js](https://img.shields.io/badge/Node.js-20.x-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Express](https://img.shields.io/badge/Express-5.x-lightgrey) ![License](https://img.shields.io/badge/License-ISC-brightgreen)  

[![Build Status](https://img.shields.io/github/actions/workflow/status/kaihere14/type-script-auth/nodejs.yml?branch=main)](https://github.com/kaihere14/type-script-auth/actions)  
[![Coverage](https://img.shields.io/codecov/c/github/kaihere14/type-script-auth)](https://codecov.io/gh/kaihere14/type-script-auth)  

---  

## Table of Contents  

- [Overview](#overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Architecture](#architecture)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Configuration](#configuration)  
  - [Running the Server](#running-the-server)  
- [Usage](#usage)  
  - [API Endpoints](#api-endpoints)  
  - [cURL Examples](#curl-examples)  
- [Development](#development)  
  - [Running Tests](#running-tests)  
  - [Code Style & Linting](#code-style--linting)  
- [Deployment](#deployment)  
- [Contributing](#contributing)  
- [Roadmap](#roadmap)  
- [Troubleshooting & FAQ](#troubleshooting--faq)  
- [License & Credits](#license--credits)  

---  

## Overview  

`ts_backend` is a **TypeScript‑only** Express server that demonstrates a clean, production‑ready authentication flow:

1. **Register** a new user (username, email, password).  
2. **Login** to receive an **access token** (15 min) and a **refresh token** (7 days).  
3. **Logout** invalidates the stored refresh token.  

All passwords are hashed with **bcrypt**, JWTs are signed with secret keys, and user data is persisted in **MongoDB** via **Mongoose**. The codebase follows a modular MVC‑style layout that is easy to extend (e.g., adding role‑based access, password reset, social login).

---  

## Features  

| Feature | Description | Status |
|---------|-------------|--------|
| **User Registration** | Stores username, email, and a bcrypt‑hashed password. | ✅ Stable |
| **Login with JWT** | Issues short‑lived access token + long‑lived refresh token. | ✅ Stable |
| **Logout** | Revokes refresh token stored in the user document. | ✅ Stable |
| **Password Hashing** | `bcrypt` with 12 salt rounds (configurable). | ✅ Stable |
| **Environment‑Based Config** | `.env` driven configuration (Mongo URI, JWT secrets). | ✅ Stable |
| **Request Logging** | `morgan` middleware in dev mode. | ✅ Stable |
| **CORS Support** | Allows front‑end on `http://localhost:5500`. | ✅ Stable |
| **Type‑Safety** | Full TypeScript typings for request/response objects. | ✅ Stable |
| **Scalable Architecture** | MVC folder structure, ready for additional resources. | ✅ Stable |
| **Docker Ready** *(future)* | Dockerfile and compose files are planned. | 🚧 Planned |

---  

## Tech Stack  

| Layer | Technology | Reason |
|-------|------------|--------|
| **Runtime** | Node.js (v20+) | Modern, async‑first JavaScript runtime |
| **Language** | TypeScript (5.x) | Static typing, better IDE support |
| **Web Framework** | Express (5.x) | Minimalist, widely adopted |
| **Database** | MongoDB (via Mongoose 8.x) | Flexible document store, easy schema definition |
| **Auth** | jsonwebtoken, bcrypt | Industry‑standard JWT & password hashing |
| **Env Management** | dotenv | Simple `.env` handling |
| **Logging** | morgan | HTTP request logger |
| **CORS** | cors | Cross‑origin resource sharing |
| **Development** | nodemon, ts-node | Hot‑reloading & on‑the‑fly TypeScript execution |
| **Testing** | (none yet – planned) | Jest / supertest will be added |

---  

## Architecture  

```
src/
├─ config/          # DB connection & future config helpers
├─ controller/      # Business logic (user.controller.ts)
├─ middleware/      # Auth guard (verifyJWT.ts)
├─ models/          # Mongoose schemas (userSchema.ts)
├─ routes/          # Express routers (user.routes.ts)
└─ index.ts         # App bootstrap (express, middlewares, routes)
```

* **Entry point (`src/index.ts`)** – creates the Express app, registers global middlewares, connects to MongoDB, and mounts the `/api/users` router.  
* **Router (`src/routes/user.routes.ts`)** – defines `/register`, `/login`, and `/logout` endpoints.  
* **Controller (`src/controller/user.controller.ts`)** – contains the core logic for each endpoint, including JWT generation (`genAccessRefresh`).  
* **Model (`src/models/userSchema.ts`)** – defines the `User` schema with password hashing (`pre('save')`) and a `checkPass` method (not shown but used).  
* **Middleware (`src/middleware/verifyJWT.ts`)** – validates the access token and attaches the user id to `req.user`.  

All async operations are wrapped in `try/catch` blocks and return consistent JSON structures (`statusCode`, `success`, `message`, `data`).  

---  

## Getting Started  

### Prerequisites  

| Tool | Minimum Version |
|------|-----------------|
| Node.js | 20.x |
| npm | 10.x (bundled with Node) |
| MongoDB | 6.x (local or Atlas) |
| Git | any recent version |

### Installation  

```bash
# Clone the repository
git clone https://github.com/kaihere14/type-script-auth.git
cd type-script-auth

# Install dependencies
npm install
```

### Configuration  

Create a `.env` file in the project root (copy from `sample.env` if present) and fill in the required values:

```dotenv
# MongoDB connection string
MONGO_URI=mongodb://127.0.0.1:27017/ts_backend

# JWT secret keys – use strong, random strings
ACCESS_SECRET_KEY=your_access_secret_here
REFRESH_SECRET_KEY=your_refresh_secret_here

# Optional: change the server port (default 5500)
PORT=5500
```

> **Security tip:** Never commit real secrets. Add `.env` to `.gitignore` (already done).

### Running the Server  

```bash
# Development mode – watches for changes
npm run dev

# Build TypeScript → JavaScript
npm run build

# Start the compiled version
npm start
```

The API will be reachable at `http://localhost:5500/api/users`.

---  

## Usage  

### API Endpoints  

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/api/users/register` | Register a new user | ❌ |
| `POST` | `/api/users/login`    | Authenticate & receive JWTs | ❌ |
| `GET`  | `/api/users/logout`   | Invalidate refresh token | ✅ (access token) |
| `GET`  | `/`                    | Simple health check | ❌ |

All request bodies are **JSON**. Responses follow the shape:

```json
{
  "statusCode": 201,
  "success": true,
  "message": "User registered successfully",
  "data": { /* resource specific */ }
}
```

### cURL Examples  

```bash
# 1️⃣ Register
curl -X POST http://localhost:5500/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"Secret123"}'

# 2️⃣ Login
curl -X POST http://localhost:5500/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"Secret123"}'

# The response contains `accessToken` and `refreshToken`.

# 3️⃣ Logout (requires the access token)
curl -X GET http://localhost:5500/api/users/logout \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Using the API from JavaScript (fetch)

```js
const base = "http://localhost:5500/api/users";

async function register() {
  const res = await fetch(`${base}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "john",
      email: "john@example.com",
      password: "Secret123"
    })
  });
  console.log(await res.json());
}
```

---  

## Development  

### Running Tests  

> No test suite is currently bundled. To add tests, install Jest and SuperTest:

```bash
npm install -D jest ts-jest @types/jest supertest @types/supertest
```

Create a `jest.config.js` and write unit/integration tests under `__tests__/`.  

### Code Style & Linting  

The project relies on TypeScript’s strict mode (`tsconfig.json`). For consistent formatting, we recommend:

```bash
npm install -D prettier eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npx eslint . --ext .ts
npx prettier --write .
```

Add scripts to `package.json` if desired.

---  

## Deployment  

The app can be deployed to any Node‑compatible environment (Heroku, Render, Railway, AWS Elastic Beanstalk, Docker, etc.).  

**Docker (future)** – a `Dockerfile` will be added. For now, the manual steps are:

```bash
# Build
npm run build

# Run the compiled code
node dist/index.js
```

**Environment variables** must be provided in the host environment (or via a secret manager).  

**Production considerations**

- Enable HTTPS termination at the load balancer or reverse proxy.  
- Set `origin` in the CORS config to your front‑end domain.  
- Rotate JWT secret keys periodically.  
- Use a managed MongoDB service with proper backups.  

---  

## Contributing  

Contributions are welcome! Please follow these steps:

1. **Fork** the repository.  
2. **Create a feature branch**: `git checkout -b feat/your-feature`.  
3. **Install dependencies** (`npm install`).  
4. **Make your changes** – keep TypeScript compilation clean (`npm run build`).  
5. **Add tests** (if applicable) and ensure they pass.  
6. **Commit** with a clear message.  
7. **Push** to your fork and open a **Pull Request** against `main`.  

### Pull Request Checklist  

- [ ] Code compiles (`npm run build`).  
- [ ] Linting passes (`eslint`).  
- [ ] New/updated functionality is documented in the README.  
- [ ] Tests added for new logic (if a test suite exists).  

---  

## Roadmap  

- **Docker support** – Dockerfile + Docker Compose.  
- **Refresh token endpoint** – rotate access tokens without re‑login.  
- **Password reset flow** (email + token).  
- **Role‑based access control (RBAC)**.  
- **Unit & integration test suite** (Jest + SuperTest).  
- **API documentation** – Swagger/OpenAPI UI.  

---  

## Troubleshooting & FAQ  

| Issue | Solution |
|-------|----------|
| **MongoDB connection error** | Verify `MONGO_URI` in `.env` points to a running MongoDB instance. Use `mongosh` to test connectivity. |
| **`ACCESS_SECRET_KEY` or `REFRESH_SECRET_KEY` undefined** | Ensure the variables exist in `.env` and that the file is loaded (`dotenv/config` is imported in `src/index.ts`). |
| **`npm run dev` exits immediately** | Check Node version (`node -v`). The project requires Node 20+. |
| **Password not hashing** | The `pre('save')` hook in `userSchema.ts` (not shown) handles hashing. Ensure you are creating users via the `/register` endpoint, not directly via Mongoose. |
| **CORS error from front‑end** | Update the `origin` option in `src/index.ts` to match your client URL or set it to `*` for testing only. |

For further help, open an issue or contact the author.

---  

## License & Credits  

**License:** ISC – see the [LICENSE](LICENSE) file.  

**Author:** Arman Thakur  

**Acknowledgments**  

- **Express** – fast, unopinionated web framework.  
- **Mongoose** – elegant MongoDB object modeling.  
- **jsonwebtoken** – JWT creation & verification.  
- **bcrypt** – secure password hashing.  

Special thanks to the open‑source community for the excellent TypeScript typings that make this project type‑safe.  

---  