# TypeScript Auth System

A robust, production-ready authentication backend built with **TypeScript**, **Node.js**, **Express**, and **MongoDB**. This project implements a secure JWT-based authentication flow featuring both Access and Refresh tokens, password hashing, and type-safe middleware.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## 🚀 Overview

This repository provides a comprehensive boilerplate for user authentication. It handles user registration, secure login with credential verification, and authenticated logout. The system uses industry-standard security practices, including `bcrypt` for password salting/hashing and `jsonwebtoken` for stateless session management.

**Key Value Proposition:**
- **Security First**: Implements the dual-token pattern (Access + Refresh) to minimize session hijacking risks.
- **Type Safety**: Full TypeScript implementation ensuring data integrity across controllers, models, and middleware.
- **Scalable Architecture**: Clean separation of concerns using an MVC-inspired directory structure.

---

## ✨ Features

- **User Registration**: Secure account creation with email uniqueness validation.
- **JWT Authentication**: 
    - **Access Tokens**: Short-lived (15m) tokens for API authorization.
    - **Refresh Tokens**: Long-lived (7d) tokens stored in the database for session persistence.
- **Password Security**: Automatic hashing using `bcrypt` before saving to MongoDB.
- **Protected Routes**: Custom `verifyJWT` middleware to guard sensitive endpoints.
- **Request Logging**: Integrated `morgan` for development-time HTTP request logging.
- **CORS Enabled**: Pre-configured CORS settings for frontend integration.

---

## 🛠 Tech Stack

- **Language:** TypeScript
- **Framework:** Express.js (v5.x)
- **Database:** MongoDB via Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Security:** Bcrypt
- **Development Tools:** Nodemon, TS-Node

---

## 🏗 Architecture

The project follows a modular structure for high maintainability:

```text
src/
├── config/             # Database connection logic
├── controller/         # Request handlers (Business logic)
├── middleware/         # JWT verification and route guards
├── models/             # Mongoose schemas and types
├── routes/             # API endpoint definitions
└── index.ts            # Application entry point
```

---

## 🚦 Getting Started

### Prerequisites

- **Node.js**: v20.x or higher
- **MongoDB**: Local instance or MongoDB Atlas URI
- **npm**: v10.x or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kaihere14/type-script-auth.git
   cd type-script-auth
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root directory based on `sample.env`:
   ```env
   PORT=5500
   MONGO_URI=mongodb://127.0.0.1:27017/ts_backend
   ACCESS_SECRET_KEY=your_access_token_secret
   REFRESH_SECRET_KEY=your_refresh_token_secret
   ```

### Running the Application

**Development Mode (with Hot Reload):**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
npm start
```

---

## 📡 API Documentation

### User Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register` | Register a new user | No |
| `POST` | `/api/users/login` | Login and receive tokens | No |
| `GET` | `/api/users/logout` | Invalidate session | Yes (JWT) |

#### 1. Register User
- **URL**: `/api/users/register`
- **Body**:
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```

#### 2. Login User
- **URL**: `/api/users/login`
- **Body**:
  ```json
  {
    "username": "johndoe",
    "password": "securepassword123"
  }
  ```
- **Response**: Returns `accessToken` and `refreshToken`.

#### 3. Logout
- **URL**: `/api/users/logout`
- **Header**: `Authorization: Bearer <access_token>`
- **Action**: Clears the refresh token from the database.

---

## 🛠 Development Guidelines

### Code Style
- Use functional components for controllers.
- Ensure all interfaces are exported from their respective models or dedicated type files.
- Always use the `UserRequest` interface when accessing `req.user`.

### Running Tests
```bash
npm test
```

---

## 🔒 Security Implementation Details

1. **Password Hashing**: Uses a pre-save hook in `userSchema.ts` to hash passwords with a salt factor of 10.
2. **Token Verification**: The `verifyJWT` middleware extracts the Bearer token, verifies the signature using the `ACCESS_SECRET_KEY`, and attaches the user ID to the request object.
3. **Database Validation**: Mongoose schema enforces unique emails and trimmed strings to prevent common injection/formatting issues.

---

## 🗺 Roadmap

- [ ] Implement Token Refresh endpoint to rotate access tokens.
- [ ] Add Password Reset functionality via email.
- [ ] Integrate Swagger/OpenAPI documentation.
- [ ] Add unit tests for controllers using Jest.

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👥 Credits

- **Author**: Arman Thakur
- **Contributor**: [kaihere14](https://github.com/kaihere14)