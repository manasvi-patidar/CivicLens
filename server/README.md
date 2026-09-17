# 🚀 CivicLens — Backend

The **CivicLens Backend** is a RESTful API built with **Node.js, Express, TypeScript, Prisma, and PostgreSQL**. It powers the core functionality of the CivicLens platform, including authentication, civic issue management, role-based access, comments, issue assignments, activity tracking, and user contributions.

### ✨ Core Responsibilities

- 🔐 **Authentication & Authorization** — JWT-based authentication with role-based access control.
- 🏙️ **Civic Issue Management** — Create, view, update, delete, filter, and manage reported civic issues.
- 👥 **Role Management** — Supports `CITIZEN`, `VOLUNTEER`, `AUTHORITY`, and `ADMIN` roles.
- 📌 **Issue Assignment** — Authorities/Admins can assign issues to available users.
- 💬 **Comments & Activity Tracking** — Supports issue discussions and maintains an activity timeline.
- 🖼️ **Image Evidence** — Handles issue image uploads using Cloudinary.
- 📍 **Location Data** — Stores issue addresses and geographic coordinates.
- 📊 **User Contributions** — Tracks user activity and contribution-related data.
- 🛡️ **Validation & Security** — Uses Zod validation and security middleware for safer API operations.

The backend follows a **modular layered architecture** separating routes, controllers, services, repositories, and database access for maintainability and scalability.

## 🛠️ Tech Stack

| Technology        | Purpose                          |
| ----------------- | -------------------------------- |
| **Node.js**       | Backend runtime environment      |
| **Express 5**     | REST API and server framework    |
| **TypeScript**    | Type-safe backend development    |
| **Prisma 6.16.2** | ORM and database access          |
| **PostgreSQL**    | Relational database              |
| **JWT**           | Authentication and authorization |
| **bcrypt**        | Password hashing                 |
| **Zod**           | Request/data validation          |
| **Cloudinary**    | Image storage and management     |
| **Multer**        | Handling multipart file uploads  |
| **Helmet**        | HTTP security middleware         |
| **Compression**   | Response compression             |
| **Morgan + Pino** | HTTP and application logging     |
| **npm**           | Package management               |

## 📁 Project Structure

```text
server/
├── src/
│   ├── config/                 # ⚙️ Database and application configuration
│   ├── middleware/             # 🛡️ Authentication, validation, error handling & uploads
│   ├── modules/
│   │   ├── auth/               # 🔐 Registration, login & authentication
│   │   ├── users/              # 👥 User profiles, roles & user management
│   │   ├── issue/              # 🏙️ Civic issue creation & management
│   │   ├── comment/             # 💬 Issue comments and discussions
│   │   ├── activity/            # 📝 Issue activity & status timeline
│   │   └── contribution/        # 📊 User contribution tracking
│   ├── routes/                  # 🔌 API route definitions
│   ├── utils/                   # 🔧 Shared utility functions
│   ├── app.ts                   # 🚀 Express application configuration
│   └── server.ts                # ▶️ Server entry point
│
├── prisma/
│   └── schema.prisma            # 🗄️ Database schema & relationships
│
├── uploads/                     # 🖼️ Local upload handling
├── package.json                 # 📦 Dependencies & scripts
├── tsconfig.json                # ⚙️ TypeScript configuration
└── .env                         # 🔑 Environment variables
```

### 🧩 Backend Architecture

```text
API Request
    ↓
Routes
    ↓
Middleware
    ↓
Controllers
    ↓
Services
    ↓
Repositories
    ↓
Prisma ORM
    ↓
PostgreSQL
```

This layered architecture keeps **API handling, business logic, and database operations separated**, making the backend easier to maintain and extend.

## ✨ Features

### 🔐 Authentication & Authorization

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Supports `CITIZEN`, `VOLUNTEER`, `AUTHORITY`, and `ADMIN`

### 🏙️ Civic Issue Management

- Create and report civic issues
- View issue details and issue listings
- Edit and delete issues
- Search and filter issues
- Issue categories and priority levels
- Issue status management: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `REJECTED`

### 📍 Issue Location & Evidence

- Store issue address and geographic coordinates
- Upload images as issue evidence
- Cloudinary-based image storage

### 👥 Issue Assignment

- Assign reported issues to users
- Support authority/admin assignment workflows
- Track assigned users for issues

### 💬 Comments & Activity

- Add comments to reported issues
- Maintain issue activity history
- Track important actions such as issue creation, status changes, and comments

### 📊 User Contributions

- Track user contribution activity
- Provide contribution-related statistics for users

### 🛡️ Security & Validation

- Request validation using Zod
- Protected API routes
- Secure password handling
- HTTP security headers with Helmet
- Response compression
- Application and HTTP request logging

## 🔐 Authentication & Roles

CivicLens uses **JWT-based authentication** with **role-based access control (RBAC)** to protect backend APIs and provide role-specific functionality.

### 🔑 Authentication Flow

```text
Register / Login
       ↓
Credential Validation
       ↓
JWT Token Generated
       ↓
Token Sent with API Requests
       ↓
Authentication Middleware
       ↓
Role-Based Authorization
       ↓
Protected Resource
```

### 👥 User Roles

| Role             | Responsibility                                                           |
| ---------------- | ------------------------------------------------------------------------ |
| **CITIZEN** 🧑‍💻   | Report civic issues, manage own issues, comment, and track contributions |
| **VOLUNTEER** 🤝 | Participate in issue management and handle assigned civic issues         |
| **AUTHORITY** 🏛️ | Manage civic issues, update statuses, and assign issues                  |
| **ADMIN** 👑     | Administrative user management and broader issue-management operations   |

### 🛡️ Protected APIs

Authenticated routes require a valid JWT token. Role-based middleware restricts sensitive operations to authorized users.

## 🔌 API Overview

CivicLens exposes RESTful APIs under the `/api` base path.

| Module           | Method   | Endpoint                     | Access            |
| ---------------- | -------- | ---------------------------- | ----------------- |
| 🔐 Auth          | `POST`   | `/api/auth/register`         | Public            |
|                  | `POST`   | `/api/auth/login`            | Public            |
|                  | `GET`    | `/api/auth/me`               | Authenticated     |
|                  | `PATCH`  | `/api/auth/me`               | Authenticated     |
| 🏙️ Issues        | `GET`    | `/api/issues`                | Public            |
|                  | `POST`   | `/api/issues`                | Authenticated     |
|                  | `GET`    | `/api/issues/:id`            | Public            |
|                  | `PATCH`  | `/api/issues/:id`            | Authenticated     |
|                  | `PATCH`  | `/api/issues/:id/status`     | Admin / Authority |
|                  | `PATCH`  | `/api/issues/:id/assign`     | Admin             |
|                  | `DELETE` | `/api/issues/:id`            | Admin             |
| 💬 Comments      | `POST`   | `/api/issues/:id/comments`   | Authenticated     |
|                  | `GET`    | `/api/issues/:id/comments`   | Public            |
|                  | `PATCH`  | `/api/comments/:id`          | Authenticated     |
|                  | `DELETE` | `/api/comments/:id`          | Authenticated     |
| 📝 Activities    | `GET`    | `/api/issues/:id/activities` | Authenticated     |
| 🤝 Contributions | `GET`    | `/api/contributions/me`      | Authenticated     |
| 👥 Users         | `POST`   | `/api/users`                 | Admin             |
|                  | `GET`    | `/api/users/assignable`      | Admin             |
| ❤️ Health        | `GET`    | `/health`                    | Public            |

### 📡 API Conventions

- RESTful HTTP methods for resource operations
- JSON request/response handling
- JWT-based authentication for protected routes
- Role-based authorization for administrative operations
- Multipart image upload support for issue creation
- Centralized error handling
- Request validation using Zod

## 🗄️ Database & Prisma

CivicLens uses **PostgreSQL** as its relational database with **Prisma ORM** for type-safe database access and schema management.

### 📦 Core Models

| Model           | Purpose                                                                             |
| --------------- | ----------------------------------------------------------------------------------- |
| 👤 **User**     | Stores user accounts, roles, reputation, and verification status                    |
| 🏙️ **Issue**    | Stores reported civic issues, location, status, priority, evidence, and assignments |
| 💬 **Comment**  | Stores comments and discussions associated with issues                              |
| 📝 **Activity** | Stores the activity timeline for issue-related actions                              |

### 🔗 Key Relationships

- A **User** can create multiple issues.
- An **Issue** belongs to one creator and can optionally be assigned to another user.
- An **Issue** can have multiple comments and activities.
- A **Comment** belongs to one issue and one user.
- An **Activity** belongs to one issue and one user.
- Comments and activities are automatically removed when their associated issue is deleted.

### 🏷️ Enums

| Enum              | Values                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| **UserRole**      | `CITIZEN`, `VOLUNTEER`, `AUTHORITY`, `ADMIN`                                                     |
| **IssueCategory** | `ROAD`, `WATER`, `ELECTRICITY`, `GARBAGE`, `STREETLIGHT`, `DRAINAGE`, `PUBLIC_PROPERTY`, `OTHER` |
| **IssueStatus**   | `OPEN`, `IN_PROGRESS`, `RESOLVED`, `REJECTED`                                                    |
| **Priority**      | `LOW`, `MEDIUM`, `HIGH`                                                                          |

### ⚡ Database Optimization

The schema includes indexes on frequently queried fields such as:

- `createdById`
- `assignedToId`
- `status`
- `category`
- `issueId`
- `userId`

Prisma migrations are maintained under `server/prisma/migrations/` to track database schema changes.

## 🔑 Environment Variables

Create a `.env` file inside the `server/` directory and configure the following variables:

| Variable                | Purpose                                  |
| ----------------------- | ---------------------------------------- |
| `PORT`                  | Port on which the backend server runs    |
| `DATABASE_URL`          | PostgreSQL database connection string    |
| `JWT_SECRET`            | Secret key used to sign JWT tokens       |
| `JWT_EXPIRES_IN`        | JWT token expiration duration            |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                    |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                       |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                    |
| `CLIENT_URL`            | Frontend URL used for CORS configuration |

### 📄 Example

```env
PORT=5000

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

CLIENT_URL=http://localhost:5173
```

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone <your-repository-url>
cd CivicLens/server
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment

Create a `.env` file using `.env.example` and add your PostgreSQL, JWT, Cloudinary, and frontend configuration.

### 4️⃣ Setup Prisma

```bash
npx prisma generate
npx prisma migrate deploy
```

### 5️⃣ Run the Development Server

```bash
npm run dev
```

The backend will start using the configured `PORT`.

### 📦 Production

```bash
npm run build
npm start
```

## ▶️ Running the Server

### 🧑‍💻 Development

Runs the server with automatic restart on code changes:

```bash
npm run dev
```

### 🏗️ Build

Compiles the TypeScript backend into `dist/`:

```bash
npm run build
```

### 🚀 Production

Runs the compiled server:

```bash
npm start
```

### 📜 Available Scripts

| Command         | Purpose                            |
| --------------- | ---------------------------------- |
| `npm run dev`   | Development server with hot reload |
| `npm run build` | Compile TypeScript                 |
| `npm start`     | Run production build               |

## 🧪 API Testing

CivicLens APIs can be tested using the available REST endpoints.

### 🔍 Testing Coverage

- 🔐 Authentication and profile APIs
- 🏙️ Issue creation, updates, status, and assignment
- 💬 Comment management
- 📝 Issue activity tracking
- 👥 User and contribution APIs
- ❤️ Health check endpoint

### ✅ Validation

Requests are validated using **Zod** schemas, with invalid inputs returning appropriate validation errors.

Protected endpoints require a valid **JWT token** and authorized user role.

## ⚠️ Error Handling & Validation

CivicLens uses centralized error handling and request validation to provide consistent API responses.

- ✅ **Zod** validates incoming request data.
- 🔐 **AppError** handles expected application errors with appropriate HTTP status codes.
- 🛡️ Centralized error middleware returns consistent JSON error responses.
- 🚨 Unexpected errors return a `500 Internal Server Error` response.
- 📋 Validation errors include details about the invalid fields.

## 🔮 Future Enhancements

Planned enhancements for the CivicLens backend include:

- 📊 **Analytics** — Advanced issue and platform statistics.
- 🗺️ **Map Integration** — Location-based issue visualization and analysis.
- 🔔 **Notifications** — Notifications for issue updates and assignments.
- ✅ **Issue Verification** — Verification workflows for reported civic issues.
- 🤖 **AI/ML Integration** — Intelligent issue classification and prioritization.

## 👨‍💻 Author

**Manasvi**

Built with ❤️ using **Node.js, Express, TypeScript, Prisma, and PostgreSQL**.
