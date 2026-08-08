<div align="center">

  <br />

  <img src="https://img.shields.io/badge/🔐-GraphLock-00D4FF?style=for-the-badge&labelColor=0a0a1a&color=00D4FF" alt="GraphLock" height="42" />

  <br />

  # GraphLock

  ### Graphical Password Authentication System

  <br />

  **Ditch text passwords.** Authenticate by clicking secret spots on images.
  <br />
  Your muscle memory is your password — impossible to keylog, hard to replicate.

  <br />

  [![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

  <br />

  [Quick Start](#-quick-start) •
  [How It Works](#-how-it-works) •
  [Features](#-features) •
  [Project Structure](#-project-structure) •
  [API Reference](#-api-reference) •
  [FAQ](#-faq)

  <br />

</div>

---

<br />

## 💡 What is GraphLock?

> **GraphLock** is a full-stack web application where users log in by **clicking 5 secret points on an image** instead of typing a text password.

Think of it like this:

| Traditional Login | GraphLock Login |
| :--- | :--- |
| Type `P@ssw0rd123!` | Upload or pick any image |
| Vulnerable to keyloggers | Click 5 secret spots on that image |
| Easy to forget complex passwords | Your **muscle memory** remembers the spots |
| Can be shoulder-surfed easily | Observers can't replicate exact pixel positions |

<br />

### 🧠 Why Graphical Passwords?

- **🛡️ Keylogger-Proof** — No keyboard input during authentication
- **🎯 High Security** — 5 clicks on a canvas create over **10³⁰ possible combinations**
- **🧩 Easy to Remember** — Visual + spatial memory is stronger than text recall
- **🎭 Built-in Decoy System** — A fake dashboard protects your real data under duress

<br />

---

## 🚀 Quick Start

Get GraphLock running on your machine in **under 3 minutes**.

### Prerequisites

Before you begin, make sure you have:

| Tool | Version | Download |
| :--- | :--- | :--- |
| **Node.js** | v18 or higher | [nodejs.org](https://nodejs.org/) |
| **MongoDB** | Any recent version | [mongodb.com](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud) |
| **Git** | Any version | [git-scm.com](https://git-scm.com/) |

> [!TIP]
> **New to MongoDB?** The easiest option is [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) — it's free for small projects and runs in the cloud, so you don't need to install anything locally.

### Step 1 — Clone the Repository

```bash
git clone https://github.com/c0pperfi3ld/graphlock-authentication-system.git
cd graphlock-authentication-system
```

### Step 2 — Configure Environment Variables

Open the file `server/.env` and update it if needed:

```env
MONGODB_URI=mongodb://localhost:27017/graphical-password-auth
JWT_SECRET=cse327-graphical-password-secret-key-change-me
PORT=5000
```

> [!NOTE]
> If you're using **MongoDB Atlas**, replace `MONGODB_URI` with your Atlas connection string.
> It looks like: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/graphical-password-auth`

### Step 3 — Start the Backend Server

```bash
cd server
npm install
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

### Step 4 — Start the Frontend Client

Open a **new terminal window** (keep the backend running!) and run:

```bash
cd client
npm install
npm run dev
```

You should see:
```
  ➜  Local: http://localhost:5173/
```

### Step 5 — Open in Browser 🎉

Navigate to **[http://localhost:5173](http://localhost:5173)** and create your first account!

> [!IMPORTANT]
> **Both terminals must stay running** — one for the backend API (port 5000) and one for the frontend UI (port 5173).

<br />

---

## 🔍 How It Works

### Registration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    📝 REGISTRATION (4 Steps)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: Account Info          Step 2: Choose Image             │
│  ┌──────────────────────┐      ┌──────────────────────┐        │
│  │ Username: _________  │      │ ┌────┐ ┌────┐ ┌────┐ │        │
│  │ Email:    _________  │  ──► │ │ 🏔️ │ │ 🌆 │ │ 🎨 │ │        │
│  │ Password: _________  │      │ └────┘ └────┘ └────┘ │        │
│  └──────────────────────┘      │   or 📤 Upload yours │        │
│                                └──────────────────────┘        │
│                                                                 │
│  Step 3: Set Click Points      Step 4: Confirm Points           │
│  ┌──────────────────────┐      ┌──────────────────────┐        │
│  │ 🖼️ Click 5 spots on  │      │ 🖼️ Re-click same 5   │        │
│  │    your image:       │  ──► │    spots to confirm: │        │
│  │    ①  ②  ③  ④  ⑤    │      │    ✓  ✓  ✓  ✓  ✓    │        │
│  └──────────────────────┘      └──────────────────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Login Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      🔐 LOGIN (2 Steps)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: Enter Username        Step 2: Authenticate             │
│  ┌──────────────────────┐      ┌──────────────────────┐        │
│  │                      │      │ 🖼️ Select/Upload your │        │
│  │ Username: _________  │  ──► │    image & click your │        │
│  │                      │      │    5 secret spots     │        │
│  │  [Continue →]        │      │    • • • • •          │        │
│  └──────────────────────┘      └──────────────────────┘        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  ✅ Points Match?                                     │      │
│  │     Real points  ──► 🔓 Secret Vault Dashboard       │      │
│  │     Decoy points ──► 🎭 Decoy To-Do List App         │      │
│  │     Wrong points ──► ❌ Access Denied                 │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Behind the Scenes

1. **During Registration:** Your 5 click coordinates are stored as percentage positions (x%, y%) relative to the image dimensions
2. **During Login:** Your new clicks are compared against stored coordinates using **Euclidean distance** matching:

$$d = \sqrt{(\Delta x)^2 + (\Delta y)^2}$$

3. **Adaptive Tolerance:** The system learns your clicking precision over time and adjusts the matching threshold — more accurate users get tighter security automatically

<br />

---

## ✨ Features

### 🔐 Security & Authentication

| Feature | Description |
| :--- | :--- |
| **Graphical Password** | 5-point spatial click authentication on any image |
| **Adaptive Tolerance** | System learns your precision and adjusts matching dynamically |
| **Hotspot Detection** | Warns during registration if your points are too clustered or predictable |
| **Password Strength Meter** | Real-time entropy & distribution analysis during point selection |
| **Account Lockout** | Auto-locks after 5 failed attempts for 15-minute cooldown |
| **Text Password Fallback** | Traditional password login available as backup |
| **On-Demand Image Upload** | Upload your image fresh every login — nothing is stored publicly |
| **MD5 Content Hashing** | Uploaded images are matched by content hash, not filename |

### 🎭 Decoy System (Plausible Deniability)

> Someone forcing you to log in? Use your **decoy password** — they see a harmless To-Do List app. Your real data stays hidden.

| What the attacker sees | What's actually happening |
| :--- | :--- |
| 📝 A simple To-Do List planner | Your **Secret Vault** remains completely hidden |
| Normal-looking productivity app | No visual indication that a vault even exists |
| Tasks, categories, checkboxes | The attacker thinks this IS your dashboard |

**How to set it up:**
1. Register your account with your **real** 5 click points
2. Navigate to **Settings → Setup Decoy Password**
3. Set a **different** set of 5 click points as your decoy
4. Done! Using decoy points at login opens the To-Do List instead

### 🔒 Secret Vault Dashboard (Real Login)

When you log in with your **real** click points, you get access to:

- **📝 Secret Notes** — Color-coded, pinnable notes for sensitive information (seed phrases, PINs, personal entries)
- **🔑 Password Locker** — Store website credentials with show/hide toggles and one-click copy
- **📊 Session Manager** — View all active login sessions (IP, browser, device) and revoke any session instantly

### 👑 Admin Panel

Administrators get additional capabilities:

- **📈 System Statistics** — Total users, login attempts, success rates
- **🗺️ Click Heatmaps** — Visual canvas overlay showing where users click most frequently across images
- **👥 User Management** — View, modify, and manage all user accounts with granular controls
- **🕵️ Shoulder Surfing Demo** — Interactive comparison: 4-digit PIN vs. Graphical Password under observation

<br />

---

## 📁 Project Structure

```
graphlock-authentication-system/
│
├── 📂 client/                    # Frontend (React + Vite)
│   ├── 📂 public/
│   │   ├── 📂 default-images/    # Pre-loaded password images
│   │   └── 📂 uploads/           # User-uploaded images
│   └── 📂 src/
│       ├── 📂 components/        # Reusable UI components
│       │   ├── ClickPointCapture.jsx    # Click-point grid overlay
│       │   ├── ClickPointReplay.jsx     # Point replay visualization
│       │   ├── Heatmap.jsx              # Admin heatmap canvas
│       │   ├── ImageSelector.jsx        # Image picker + uploader
│       │   ├── Navbar.jsx               # Top navigation bar
│       │   ├── PasswordStrength.jsx     # Entropy strength meter
│       │   ├── SecurityDashboard.jsx    # Security overview widget
│       │   └── SessionAuditLog.jsx      # Active sessions table
│       ├── 📂 context/
│       │   └── AuthContext.jsx          # Global auth state (React Context)
│       ├── 📂 pages/
│       │   ├── LoginPage.jsx            # Login flow (username → image → clicks)
│       │   ├── RegisterPage.jsx         # 4-step registration wizard
│       │   ├── DashboardPage.jsx        # Vault OR Decoy (based on login type)
│       │   ├── AdminPage.jsx            # Admin panel (stats + heatmap)
│       │   ├── DecoySetupPage.jsx       # Decoy password configuration
│       │   ├── ResetPasswordPage.jsx    # Password reset flow
│       │   ├── SecurityCompare.jsx      # PIN vs GraphPass comparison
│       │   └── ShoulderSurfingDemo.jsx  # Interactive demo
│       ├── 📂 utils/
│       │   ├── auth.js                  # Axios API client + interceptors
│       │   └── coordinates.js           # Click coordinate math utilities
│       ├── App.jsx                      # Router + layout
│       └── App.css                      # Global design system (dark glassmorphism)
│
├── 📂 server/                    # Backend (Node.js + Express)
│   ├── 📂 controllers/
│   │   ├── authController.js            # Register, login, check-availability
│   │   ├── adminController.js           # Stats, heatmap, user management
│   │   ├── sessionController.js         # Session listing + revocation
│   │   └── vaultController.js           # Notes + credentials CRUD
│   ├── 📂 middleware/
│   │   └── authMiddleware.js            # JWT verification + role checks
│   ├── 📂 models/
│   │   ├── User.js                      # User schema (credentials + click points)
│   │   ├── LoginAttempt.js              # Login audit log schema
│   │   ├── Session.js                   # Active session schema
│   │   └── Vault.js                     # Notes + credentials schema
│   ├── 📂 routes/
│   │   ├── authRoutes.js                # /api/auth/* endpoints
│   │   ├── adminRoutes.js               # /api/admin/* endpoints
│   │   ├── sessionRoutes.js             # /api/sessions/* endpoints
│   │   └── vaultRoutes.js               # /api/vault/* endpoints
│   ├── 📂 utils/
│   │   ├── toleranceCheck.js            # Euclidean distance matching
│   │   └── passwordStrength.js          # Entropy + hotspot analysis
│   ├── server.js                        # Express app entry point
│   ├── make-admin.js                    # CLI script to promote users
│   ├── .env                             # Environment configuration
│   └── package.json
│
└── README.md                     # ← You are here!
```

<br />

---

## 📡 API Reference

### Authentication — `/api/auth`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/check-availability` | Check if username/email is taken | ❌ |
| `POST` | `/register` | Create new account with click points | ❌ |
| `GET` | `/user-image/:username` | Validate username exists (pre-login) | ❌ |
| `POST` | `/login` | Authenticate with graphical password | ❌ |
| `POST` | `/login-text` | Authenticate with text password fallback | ❌ |
| `GET` | `/me` | Get current user profile | ✅ |
| `POST` | `/setup-decoy` | Configure decoy click points | ✅ |
| `POST` | `/reset-graphical-password` | Reset graphical password | ✅ |

### Vault — `/api/vault`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/notes` | Fetch all secret notes | ✅ |
| `POST` | `/notes` | Create a new note | ✅ |
| `PUT` | `/notes/:id` | Update a note | ✅ |
| `DELETE` | `/notes/:id` | Delete a note | ✅ |
| `GET` | `/credentials` | Fetch all stored credentials | ✅ |
| `POST` | `/credentials` | Store new site credentials | ✅ |
| `PUT` | `/credentials/:id` | Update credentials | ✅ |
| `DELETE` | `/credentials/:id` | Delete credentials | ✅ |

### Sessions — `/api/sessions`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/` | List all active login sessions | ✅ |
| `DELETE` | `/:sessionId` | Revoke a specific session | ✅ |

### Admin — `/api/admin`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/stats` | System-wide metrics & analytics | ✅ (Admin) |
| `GET` | `/users` | List all users with details | ✅ (Admin) |
| `PUT` | `/users/:id` | Modify user account | ✅ (Admin) |
| `DELETE` | `/users/:id` | Delete user account | ✅ (Admin) |
| `GET` | `/heatmap/:imageId` | Click heatmap data for an image | ✅ (Admin) |
| `GET` | `/login-attempts` | All login attempt audit logs | ✅ (Admin) |

### Images — `/api/images`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/defaults` | List available default images | ❌ |
| `POST` | `/upload` | Upload a custom image (MD5 hashed) | ❌ |

<br />

---

## 👑 Admin Setup

Want to access the Admin Panel? Here's how:

**Step 1:** Register a normal account through the web UI

**Step 2:** Open a terminal in the `server/` directory and run:

```bash
node make-admin.js YOUR_USERNAME
```

**Step 3:** Log out and log back in — you'll see the **Admin** link in the navigation bar!

> [!NOTE]
> Replace `YOUR_USERNAME` with the username you registered with (e.g., `node make-admin.js john`).

<br />

---

## ❓ FAQ

<details>
<summary><strong>What if I forget my click points?</strong></summary>
<br />
You can always log in using your <strong>text password fallback</strong> — click "Use Text Password" on the login page. Once logged in, you can reset your graphical password from the settings.
</details>

<details>
<summary><strong>Can I use any image?</strong></summary>
<br />
Yes! You can either pick from the built-in default images or <strong>upload your own</strong> image (JPG, PNG, or WebP up to 5MB). When you upload a custom image, you'll need to upload it again each time you log in — the system matches it by content hash (MD5), not by filename.
</details>

<details>
<summary><strong>How accurate do my clicks need to be?</strong></summary>
<br />
The system uses a <strong>6% tolerance radius</strong> by default, which means you can be slightly off and still match. The tolerance adapts over time — if you consistently click very precisely, the system tightens security automatically. If you're less precise, it stays forgiving.
</details>

<details>
<summary><strong>What is the Decoy system?</strong></summary>
<br />
The Decoy system provides <strong>plausible deniability</strong>. You set up a second set of click points. If someone forces you to log in, you use the decoy points — they see a harmless To-Do List app. Your real Secret Vault remains completely hidden with no indication it exists.
</details>

<details>
<summary><strong>Is my uploaded image stored on the server?</strong></summary>
<br />
Uploaded images are saved in the <code>client/public/uploads/</code> directory with a content-based hash filename. The system does <strong>not</strong> auto-load or expose your image publicly during login — you must upload it fresh each time.
</details>

<details>
<summary><strong>What happens after 5 failed login attempts?</strong></summary>
<br />
Your account gets <strong>locked for 15 minutes</strong>. After the cooldown, it automatically unlocks. This prevents brute-force attacks on your click points.
</details>

<details>
<summary><strong>Can I run this with MongoDB Atlas (cloud)?</strong></summary>
<br />
Absolutely! Just update the <code>MONGODB_URI</code> in <code>server/.env</code> with your Atlas connection string. Everything else works the same.
</details>

<br />

---

## 🏗️ Tech Stack

<table>
<tr>
<td align="center" width="100">
<br />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="36" />
<br /><sub><b>React 18</b></sub>
<br /><br />
</td>
<td align="center" width="100">
<br />
<img src="https://vitejs.dev/logo.svg" width="36" />
<br /><sub><b>Vite 6</b></sub>
<br /><br />
</td>
<td align="center" width="100">
<br />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="36" />
<br /><sub><b>Node.js</b></sub>
<br /><br />
</td>
<td align="center" width="100">
<br />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" width="36" />
<br /><sub><b>Express.js</b></sub>
<br /><br />
</td>
<td align="center" width="100">
<br />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" width="36" />
<br /><sub><b>MongoDB</b></sub>
<br /><br />
</td>
</tr>
<tr>
<td align="center" width="100">
<br />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="36" />
<br /><sub><b>CSS3</b></sub>
<br /><br />
</td>
<td align="center" width="100">
<br />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="36" />
<br /><sub><b>JavaScript</b></sub>
<br /><br />
</td>
<td colspan="3" align="center">
<br />
<sub><b>JWT</b> • <b>bcryptjs</b> • <b>Multer</b> • <b>Mongoose</b></sub>
<br /><br />
</td>
</tr>
</table>

<br />

---

<div align="center">

  **Built with ❤️ for CSE327 Software Engineering**
  <br />
  North South University

  <br />

  <sub>If you found this project useful, consider giving it a ⭐</sub>

</div>
