# TypeScript Auth API  

![Node.js](https://img.shields.io/badge/Node.js-20.x-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Express](https://img.shields.io/badge/Express-5.x-lightgrey) ![MongoDB](https://img.shields.io/badge/MongoDB-8.x-success) ![License](https://img.shields.io/badge/License-ISC-lightgrey)  

A minimal **JWT‑based authentication** service built with **TypeScript**, **Express**, and **MongoDB**. It provides secure user registration, login, token refresh, and logout endpoints that can be dropped into any front‑end or micro‑service architecture.

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
  - [Register a User](#register-a-user)  
  - [Login](#login)  
  - [Logout](#logout)  
- [API Reference](#api-reference)  
- [Development](#development)  
- [Testing & Linting](#testing--linting)  
- [Deployment](#deployment)  
- [Contributing](#contributing)  
- [Roadmap](#roadmap)  
- [License & Credits](#license--credits)  

---

## Overview  

`ts_backend` is a **RESTful** authentication server written entirely in TypeScript. It demonstrates:

* Secure password hashing with **bcrypt**.  
* JWT **access** (15 min) and **refresh** (7 days) tokens.  
* Middleware for protecting routes (`verifyJWT`).  
* A clean MVC‑style folder layout (`controllers`, `models`, `routes`, `middleware`).  

The project is intentionally lightweight so you can use it as a learning reference or a starter kit for larger applications.

---

## Features  

| Feature | Description | Status |
|---------|-------------|--------|
| **User Registration** | Stores username, email, and hashed password. | ✅ Stable |
| **User Login** | Validates credentials, returns access & refresh tokens. | ✅ Stable |
| **JWT Middleware** | Verifies access tokens for protected routes. | ✅ Stable |
| **Logout** | Revokes refresh token by clearing it from the DB. | ✅ Stable |
| **Environment‑Based Config** | All secrets and DB URI are loaded from `.env`. | ✅ Stable |
| **Type‑Safe Controllers** | Full TypeScript typings for request/response objects. | ✅ Stable |
| **Docker‑Ready** *(optional)* | `Dockerfile` can be added without code changes. | ⚙️ Planned |

---

## Tech Stack  

| Layer | Technology | Reason |
|-------|------------|--------|
| **Runtime** | Node.js 20.x | Modern V8 engine, async‑first |
| **Language** | TypeScript 5.x | Static typing, better IDE support |
| **Web Framework** | Express 5.x | Minimalist, middleware‑centric |
| **Database** | MongoDB 8.x (via Mongoose) | Schema‑based ODM, easy to prototype |
| **Auth** | jsonwebtoken, bcrypt | Industry‑standard JWT & password hashing |
| **Utilities** | dotenv, morgan, cors | Config, logging, CORS handling |
| **Dev Tools** | nodemon, ts-node, typescript | Hot‑reload, on‑the‑fly compilation |
| **Testing (future)** | Jest, supertest | Planned for v2.0 |

---

## Architecture  

```
src/
├─ config/          # DB connection helper
├─ controller/      # Business logic (register, login, logout)
├─ middleware/      # JWT verification
├─ models/          # Mongoose schema (User)
├─ routes/          # Express routers (user.routes.ts)
└─ index.ts         # App bootstrap (express, middleware, routes)
```

* **`index.ts`** – creates the Express app, applies global middleware, connects to MongoDB, and starts the HTTP server.  
* **`config/index.ts`** – encapsulates the Mongoose connection logic.  
* **`models/userSchema.ts`** – defines the `User` model with password hashing (`pre('save')`) and a `checkPass` method (implementation omitted for brevity).  
* **`controller/user.controller.ts`** – contains the core auth flow: registration, login (generates JWTs), and logout (clears refresh token).  
* **`middleware/verifyJWT.ts`** – validates the access token and attaches the user ID to `req.user`.  
* **`routes/user.routes.ts`** – maps HTTP verbs to controller functions and protects the logout route with `verifyJWT`.

---

## Getting Started  

### Prerequisites  

| Tool | Minimum Version |
|------|-----------------|
| Node.js | 20.x |
| npm (or Yarn) | 9.x |
| MongoDB | 8.x (local or Atlas) |
| Git | any |

### Installation  

```bash
# Clone the repository
git clone https://github.com/kaihere14/type-script-auth.git
cd type-script-auth

# Install dependencies
npm install
```

### Configuration  

Create a `.env` file at the project root (you can copy `sample.env`):

```dotenv
# MongoDB connection string
MONGO_URI=mongodb://127.0.0.1:27017/ts_backend

# JWT secrets – generate strong random strings
ACCESS_SECRET_KEY=your_access_secret_key_here
REFRESH_SECRET_KEY=your_refresh_secret_key_here

# Optional: change the server port (default 5500)
PORT=5500
```

> **Tip:** Use `openssl rand -base64 32` to generate a secure secret.

### Running the Server  

```bash
# Development mode – watches for file changes
npm run dev

# Production build + start
npm run build   # compiles to ./dist
npm start       # runs node ./dist/index.js
```

The API will be available at `http://localhost:5500/api/users`.

---

## Usage  

Below are `curl` examples; you can also use Postman, Insomnia, or any HTTP client.

### Register a User  

```bash
curl -X POST http://localhost:5500/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
        "username": "john_doe",
        "email": "john@example.com",
        "password": "SuperSecret123"
      }'
```

**Success response (201):**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "65f1c2e9a5b3c8d7e9f0a1b2",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Login  

```bash
curl -X POST http://localhost:5500/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
        "username": "john_doe",
        "password": "SuperSecret123"
      }'
```

**Success response (201):**

```json
{
  "status": "201",
  "user": { /* user document (excluding password) */ },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "message": "Logged in successfully"
}
```

Store the `accessToken` for subsequent protected calls.

### Logout  

```bash
curl -X GET http://localhost:5500/api/users/logout \
  -H "Authorization: Bearer <accessToken>"
```

**Success response (200):**

```json
{
  "status": 200,
  "message": "Logged out successfully"
}
```

---

## API Reference  

| Method | Endpoint | Auth | Description | Request Body | Success Status |
|--------|----------|------|-------------|--------------|----------------|
| `POST` | `/api/users/register` | ❌ | Create a new user | `{ username, email, password }` | `201 Created` |
| `POST` | `/api/users/login` | ❌ | Authenticate and receive JWTs | `{ username, password }` | `201 Created` |
| `GET`  | `/api/users/logout` | ✅ (Bearer) | Invalidate refresh token | *none* | `200 OK` |

**Error handling** – All endpoints return a JSON payload with `status`/`statusCode`, `message`, and optionally `data`. Common status codes:

| Code | Meaning |
|------|---------|
| 400 | Bad request – missing fields |
| 401 | Unauthorized – invalid or missing JWT |
| 409 | Conflict – e.g., email already registered |
| 500 | Internal server error |

---

## Development  

```bash
# Install dev dependencies (already done by npm install)
npm install

# Run in watch mode (nodemon + ts-node)
npm run dev
```

### Code Style  

* All files are written in **TypeScript** (`.ts`).  
* ESLint is not configured yet – feel free to add it.  
* Follow the existing folder conventions (`controller`, `models`, `routes`, `middleware`).  

### Debugging  

* Logs are emitted via **morgan** (`dev` format).  
* Errors are printed to the console; you can attach a debugger to `src/index.ts` or any controller.

---

## Testing & Linting  

The repository currently contains a placeholder test script:

```json
"test": "echo \"Error: no test specified\" && exit 1"
```

**Suggested next steps**

1. Add **Jest** and **supertest** for unit/integration tests.  
2. Create a `tests/` directory mirroring the source structure.  
3. Update the `test` script to `jest --coverage`.

---

## Deployment  

### Docker (optional)  

```dockerfile
# Dockerfile (example)
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

EXPOSE 5500
CMD ["node", "dist/index.js"]
```

Build & run:

```bash
docker build -t ts-auth .
docker run -d -p 5500:5500 --env-file .env ts-auth
```

### Cloud Platforms  

* **Render / Railway / Fly.io** – just point to the repo, set the environment variables, and let the platform run `npm run start`.  
* **Heroku** – use the Node.js buildpack; ensure `Procfile` contains `web: npm run start`.

---

## Contributing  

Contributions are welcome! Please follow these steps:

1. **Fork** the repository.  
2. Create a feature branch: `git checkout -b feat/your-feature`.  
3. Make your changes, ensuring the code compiles (`npm run build`).  
4. Add or update tests if applicable.  
5. Run linting / formatting (if you add ESLint/Prettier).  
6. Submit a **Pull Request** with a clear description of the change.  

### Code Review Guidelines  

* Keep TypeScript strictness (`noImplicitAny`, `strictNullChecks`).  
* Validate all inputs; return proper HTTP status codes.  
* Do not commit `.env` or any secret keys.  

---

## Roadmap  

- [ ] Add **refresh token** endpoint (`/refresh`) to issue new access tokens.  
- [ ] Implement **password reset** flow (email + token).  
- [ ] Introduce **role‑based access control** (admin, user).  
- [ ] Add **unit & integration tests** with Jest & Supertest.  
- [ ] Provide **Docker Compose** file for local MongoDB + API.  

---

## License & Credits  

**License:** ISC – see the `LICENSE` file.  

**Author:** Arman Thakur  

**Acknowledgments**

* **Express** – fast, minimalist web framework.  
* **Mongoose** – elegant MongoDB object modeling.  
* **jsonwebtoken** – JWT creation & verification.  
* **bcrypt** – password hashing.  

---  