<div align="center">

  # 🔐 GraphLock
  ### *Advanced Graphical Password Authentication System*

  A full-stack, enterprise-grade authentication platform that replaces traditional text passwords with **spatial muscle memory click-points** on custom images.

  [![React](https://img.shields.io/badge/React-18.2-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![License](https://img.shields.io/badge/License-Academic-lightgrey.svg?style=for-the-badge)](#)

  ---

  [Overview](#-overview) •
  [Key Features](#-key-features) •
  [Decoy & Vault System](#-decoy--vault-system) •
  [Getting Started](#-getting-started) •
  [API Architecture](#-api-architecture) •
  [Admin Guide](#-admin-panel)

</div>

<br />

---

## 🌟 Overview

**GraphLock** reimplements user authentication from first principles. Instead of typing text passwords that can be keylogged, guessed, or intercepted, users authenticate by selecting 5 secret click-point coordinates on an image.

Key benefits of spatial graphical authentication:
- **Zero Keylogging Risk:** No keyboard input required during authentication.
- **High Entropy:** Spatial coordinates on a 1000×1000 canvas yield over $10^{30}$ possible click combinations.
- **Shoulder Surfing Resistance:** Observers watching a user login cannot easily replicate exact pixel-offset distances.
- **Plausible Deniability:** Entering a secondary "Decoy" click sequence opens a fully functioning, harmless **To-Do List Planner** while leaving the user's real **Secret Vault** undisclosed.

---

## 🚀 Key Features

### 🛡️ Security Engine
- **Adaptive Precision Tolerance:** Calculates Euclidean distance ($\sqrt{\Delta x^2 + \Delta y^2}$) dynamically, tuning precision tolerance per user based on historical click accuracy.
- **Hotspot Detection & Entropy Scoring:** Evaluates point distribution during registration, warning users against tight clusters or predictable edge coordinates.
- **Inline Availability Validation:** Real-time checking of username and email availability directly on Step 1 of registration with instant inline feedback.
- **Rate-Limiting & Lockout Guard:** Automatically locks accounts after 5 failed authentication attempts for a 15-minute cooldown.

### 💼 Application Portals
- **🔒 Real Vault Dashboard:** Unlocks a multi-tab personal manager containing:
  - **Secret Notes:** Color-coded, pinned notes for confidential information (seed phrases, PINs, diaries).
  - **Password Locker:** Store site credentials with one-click password visibility toggles (`👁️`) and copy-to-clipboard (`📋`).
  - **Session Audit Logs:** View live active device sessions, IP addresses, browsers, and revoke active JWT tokens.
- **🎭 Plausible Deniability (Decoy Mode):** Authenticating via the secondary decoy sequence opens an authentic **Personal To-Do List** app complete with task categories, completion checkboxes, and progress tracking.
- **📊 Interactive Admin Panel:** Heatmap canvas visualization rendering aggregate click-point density across all users to identify common image hotspots.
- **🕵️ Shoulder Surfing Sandbox:** Interactive demonstration tab comparing the vulnerability of 4-digit PINs vs. Graphical Passwords under direct observation.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Component-driven UI built with Hooks and Context API |
| **Styling** | Vanilla CSS (Dark Glassmorphism) | Zero external UI frameworks; custom design system with hardware-accelerated animations |
| **Backend** | Node.js, Express.js | Modular RESTful API architecture |
| **Database** | MongoDB, Mongoose | Schema validation, spatial data index, and user relationship mapping |
| **Auth & Security** | JWT, bcryptjs, Crypto | Stateless bearer token authentication and SHA-256 session tracking |
| **Uploads** | Multer | Server-side image validation (type, size, aspect ratio) |

---

## ⚡ Getting Started

### Prerequisites
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB** (Local instance on `mongodb://localhost:27017` OR [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection URI)

### 1. Clone & Setup Environment
```bash
git clone git@github.com:c0pperfi3ld/graphlock-authentication-system.git
cd graphlock-authentication-system
```

Verify or update `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/graphical-password-auth
JWT_SECRET=cse327-graphical-password-secret-key-change-me
PORT=5000
```

### 2. Start Backend API Server
```bash
cd server
npm install
npm run dev
```
*Output should display:* `✅ Connected to MongoDB` & `🚀 Server running on http://localhost:5000`

### 3. Start Frontend Client
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
*Client will launch on:* `http://localhost:5173`

---

## 📡 API Architecture Overview

```
/api
 ├── /auth
 │    ├── POST /check-availability      # Real-time username/email inline validation
 │    ├── POST /register                # Account creation with click-point payload
 │    ├── POST /login                   # Graphical password authentication & JWT generation
 │    ├── POST /login-text              # Fallback text password login
 │    └── GET  /me                      # Profile & password expiry validation
 ├── /vault
 │    ├── GET/POST/PUT/DELETE /notes     # Secret notes CRUD operations
 │    └── GET/POST/PUT/DELETE /credentials # Password manager CRUD operations
 ├── /sessions
 │    ├── GET  /                        # Active user sessions audit
 │    └── DELETE /:sessionId            # Revoke specific login session
 └── /admin
      ├── GET  /stats                   # System-wide metrics
      └── GET  /heatmap/:imageId        # Canvas heatmap data points
```

---

## 👑 Admin Panel Access

To grant Admin permissions to an existing user:

1. Register an account via the web UI.
2. Open your terminal inside the `server/` directory.
3. Run the helper script with your username:
```bash
node make-admin.js YOUR_USERNAME
```
4. Re-login to access the **Admin** dashboard link in the navigation header.

---

<div align="center">
  <sub>Developed for <b>CSE327 Software Engineering</b> • North South University</sub>
</div>
