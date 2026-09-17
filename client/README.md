# 🏙️ CivicLens — Frontend

The frontend of **CivicLens**, a full-stack civic issue reporting and management platform that helps citizens report, track, and manage real-world community issues.

Built with **React, TypeScript, Vite, and Tailwind CSS**, it provides role-based experiences for **Citizens, Volunteers, Authorities, and Admins**.

## 📚 Table of Contents

- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Getting Started](#️-getting-started)
- [🔐 Authentication & Role-Based Access](#-authentication--role-based-access)
- [📝 Issue Reporting & Management](#-issue-reporting--management)
- [💬 Comments & Activity Tracking](#-comments--activity-tracking)
- [📊 Role-Based Dashboards](#-role-based-dashboards)
- [👤 Profile & Contributions](#-profile--contributions)
- [🚀 Available Scripts](#-available-scripts)
- [✨ Frontend Highlights](#-frontend-highlights)
- [🔮 Future Enhancements](#-future-enhancements)
- [👨‍💻 Author](#-author)

### ✨ Key Features

- 🔐 User authentication with protected routes and role-based access
- 📝 Report civic issues with category, priority, location, address, and image evidence
- 📍 Use the browser's current location while reporting an issue
- 🔎 Browse, search, filter, and paginate reported issues
- 👥 Role-specific dashboards for Citizens, Volunteers, Authorities, and Admins
- 🔄 Track issue lifecycle — **Open → In Progress → Resolved/Rejected**
- 👮 Assign issues to Volunteers or Authorities
- ✏️ Edit and delete issues based on user permissions
- 💬 Add, edit, and delete issue comments
- 📜 View issue activity timelines and status history
- 👤 Manage profiles and view personal contributions
- 📊 View role-specific issue and contribution statistics
- 📱 Responsive UI with reusable React components

## 🛠️ Tech Stack

- ⚛️ **React 19** — Component-based UI development
- 🔷 **TypeScript** — Type-safe frontend development
- ⚡ **Vite** — Development server and production build tool
- 🎨 **Tailwind CSS 4** — Responsive and utility-first styling
- 🧭 **React Router DOM 7** — Client-side routing and protected routes
- 🌐 **Axios** — REST API communication with the backend
- 🧠 **React Context API** — Authentication and shared user state
- 🧹 **ESLint** — Code quality and linting

## 📁 Project Structure

```text
client/
├── public/
├── src/
│   ├── components/       # 🧩 Reusable UI components
│   │   ├── common/
│   │   ├── issue/
│   │   └── layout/
│   │
│   ├── context/          # 🔐 Authentication & shared state
│   ├── hooks/            # 🪝 Custom React hooks
│   ├── layouts/          # 🖥️ Application layouts
│   │
│   ├── pages/             # 📄 Application pages
│   │   ├── auth/          # Login & registration
│   │   ├── contributions/ # User contributions
│   │   ├── dashboard/     # Role-based dashboards
│   │   ├── issues/        # Issue creation, editing & details
│   │   └── profile/       # User profile
│   │
│   ├── routes/            # 🧭 Routing & protected routes
│   ├── services/          # 🌐 API service modules
│   ├── styles/            # 🎨 Shared styling
│   └── types/             # 🔷 TypeScript type definitions
│
├── .env.example
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## ⚙️ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone <your-repository-url>
cd CivicLens/client
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the `client` directory using `.env.example` as a reference.

```env
VITE_API_URL=<your-backend-api-url>
```

### 4️⃣ Start the Development Server

```bash
npm run dev
```

### 5️⃣ Build for Production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 🔐 Authentication & Role-Based Access

CivicLens uses **JWT-based authentication** with protected routes and role-based access control.

### 👥 User Roles

| Role             | Access                                                                    |
| ---------------- | ------------------------------------------------------------------------- |
| 👤 **Citizen**   | Report issues, track personal issues, comment, and manage contributions   |
| 🤝 **Volunteer** | Access assigned issues and participate in issue management                |
| 🏛️ **Authority** | Manage civic issues, update statuses, and handle assignments              |
| 🛡️ **Admin**     | Administrative access with broader issue and user management capabilities |

### 🔒 Authentication Features

- 🔑 Secure login and registration flow
- 🎫 JWT-based authenticated sessions
- 🛣️ Protected routes for authenticated users
- 👥 Role-based route and UI access
- 🚪 Logout functionality
- 🧠 Authentication state managed through React Context

## 📝 Issue Reporting & Management

CivicLens provides a complete frontend workflow for reporting and managing civic issues.

- 📝 Create issues with **title, description, category, priority, location, and address**
- 📷 Upload **image evidence** with reported issues
- 📍 Capture and display issue location details
- 📋 Browse reported issues with **search, filtering, and pagination**
- 🔎 View detailed information for individual issues
- 🔄 Track issue status through **Open → In Progress → Resolved/Rejected**
- 👮 Assign issues to available users based on role and permissions
- ✏️ Edit or delete issues according to user permissions
- 📊 View issue-related statistics through role-specific dashboards

## 💬 Comments & Activity Tracking

CivicLens supports collaboration and transparency through issue discussions and activity history.

- 💬 Add comments to reported issues
- ✏️ Edit your own comments
- 🗑️ Delete comments according to user permissions
- 📜 View the chronological activity timeline for an issue
- 🔄 Track important issue events such as **creation, status updates, comments, and assignments**
- 👤 Display user information associated with comments and activities

## 📊 Role-Based Dashboards

CivicLens provides dedicated dashboards tailored to each user role.

- 👤 **Citizen Dashboard** — View reported issues, track their status, and monitor personal contributions
- 🤝 **Volunteer Dashboard** — View and manage issues assigned to the volunteer
- 🏛️ **Authority Dashboard** — Monitor civic issues, manage their status, and handle assignments
- 🛡️ **Admin Dashboard** — Manage the broader issue workflow and access administrative functionality
- 📈 Role-specific statistics and issue summaries provide a quick overview of relevant activity

## 👤 Profile & Contributions

Users can manage their account information and keep track of their civic contributions.

- 👤 View personal profile information
- ✏️ Update profile details
- 📋 View personally reported issues and contributions
- 📊 Track contribution-related statistics
- 🕒 Review activity associated with their civic participation

## 🚀 Available Scripts

Run these commands from the `client` directory:

| Command           | Description                             |
| ----------------- | --------------------------------------- |
| `npm run dev`     | ⚡ Start the Vite development server    |
| `npm run build`   | 📦 Build the frontend for production    |
| `npm run lint`    | 🧹 Run ESLint and check code quality    |
| `npm run preview` | 🔍 Preview the production build locally |

## ✨ Frontend Highlights

- 🧩 **Component-based architecture** with reusable layout, issue, dashboard, and common UI components
- 🧭 **Protected routing** with dedicated routes for authentication, dashboards, issues, profiles, and contributions
- 🔐 **Role-aware rendering** that controls issue actions such as status updates and assignments based on user roles
- 📍 **Browser geolocation integration** to capture latitude and longitude while creating an issue, with manual coordinate fallback
- 📷 **Multipart issue submission** supporting image evidence alongside issue details
- 🔎 **Client-side issue controls** with search, status/category filters, pagination, and filter reset
- 🔄 **Interactive issue workflow** for editing, status updates, assignments, and permission-based actions
- 💬 **Interactive comments** with create, edit, delete, loading, error, and confirmation states
- 📜 **Activity timeline** for displaying issue history and user actions
- 📊 **Role-specific dashboard logic** for personal reports, assigned issues, management issues, filters, and statistics
- 🧠 **Centralized API service layer** using Axios with dedicated services for authentication, issues, comments, activities, and contributions
- 📱 **Responsive Tailwind-based UI** with shared layouts, Navbar, Sidebar, cards, forms, and dashboard components

## 🔮 Future Enhancements

- 🗺️ **Interactive Issue Map** — Visualize reported issues using latitude/longitude with map-based filtering
- 🤖 **AI-Powered Issue Classification** — Automatically classify issue categories and estimate priority from submitted descriptions/images
- 🔍 **Duplicate Issue Detection** — Identify potentially duplicate reports based on issue descriptions and locations
- 🔔 **Real-Time Notifications** — Notify users about status changes, assignments, comments, and other issue updates
- ⚡ **Real-Time Issue Updates** — Introduce WebSocket-based updates so dashboards and issue pages update without manual refresh
- 📊 **Advanced Analytics** — Add charts and visual analytics for issue trends, resolution rates, categories, and locations
- 🏘️ **Community Verification** — Allow citizens to confirm, dispute, or support reported issues
- 🔐 **OAuth Authentication** — Support Google or other third-party authentication providers
- 🌐 **Public Issue Explorer** — Provide a public-facing interface for browsing civic issues and their resolution progress
- 📱 **Progressive Web App (PWA)** — Enable installable, app-like access with improved mobile capabilities

## 👨‍💻 Author

**Manasvi**

Built with ❤️ using **React, TypeScript, Vite & Tailwind CSS**.
