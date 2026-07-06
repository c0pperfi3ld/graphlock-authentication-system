<div align="center">
  
  # 🔐 GraphLock

  **A Next-Generation Graphical Password Authentication System**
  
  *Built for CSE327 Software Engineering Project @ North South University*

  [![React](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg?style=for-the-badge&logo=node.js)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
  [![License](https://img.shields.io/badge/License-Academic-lightgrey.svg?style=for-the-badge)](#)

</div>

<br />

GraphLock completely reimagines how we log in. Instead of typing a vulnerable text password, users authenticate by recalling **spatial muscle memory** — clicking 5 secret points on a custom image. It’s highly resistant to shoulder surfing, mathematically secure, and designed with a premium, glassmorphism UI.

---

## ✨ Features That Stand Out

We didn't just build a login page. We built a security command center.

| 🛡️ Security Architecture | 🎯 User Experience | 🔮 "Wow Factor" Features |
| :--- | :--- | :--- |
| **Adaptive Tolerance:** System learns your clicking habits and tightens security dynamically. | **Curated Library:** Choose from beautiful default backgrounds or upload your own. | **Plausible Deniability:** Setup a "Decoy Password" that logs you into a fake restricted dashboard if under duress. |
| **Hotspot Prevention:** Alerts users if they cluster points too closely together. | **Click Replay:** Watch an animated replay of your click sequence to ensure you memorize it. | **Live Heatmap:** Admins can view a canvas-rendered heatmap of where all users are clicking. |
| **Rate Limiting:** Auto-locks accounts after 5 failed brute-force attempts. | **Glassmorphism UI:** A stunning, modern dark theme built with raw CSS. | **Shoulder Surfing Demo:** A built-in sandbox to prove how hard it is for someone to steal your password by watching you. |

<br />

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Make sure you have installed:
* [Node.js](https://nodejs.org/) (v18 or higher)
* [MongoDB](https://www.mongodb.com/try/download/community) (Local server running on port 27017, OR a free Atlas cluster)

### 1️⃣ Clone & Configure

First, open `server/.env` and ensure your database connection is correct:
```env
# Use this if you are using Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/graphical-password-auth

# OR use this for MongoDB Atlas (Cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

### 2️⃣ Start the Backend Server
Open your terminal and navigate to the server folder:
```bash
cd server
npm install
npm run dev
```
*You should see a success message: `✅ Connected to MongoDB`*

### 3️⃣ Start the Frontend Application
Open a **new, separate terminal tab**, and navigate to the client folder:
```bash
cd client
npm install
npm run dev
```

### 4️⃣ Launch!
Click the link provided by Vite, or navigate to **[http://localhost:5173](http://localhost:5173)** in your browser.

<br />

---

## 🛠️ Tech Stack & Architecture

This project strictly adheres to the MERN stack paradigm, utilizing a stateless JWT architecture for security.

* **Frontend:** React.js, Vite, React Router DOM
* **Backend:** Node.js, Express.js, Multer (Image processing)
* **Database:** MongoDB, Mongoose (Schemas & Middleware)
* **Security:** JSON Web Tokens (JWT), bcryptjs, Crypto hashes
* **Design:** Custom Vanilla CSS with CSS Variables & Animations

<br />

---

## 👑 How to Access the Admin Panel

The system comes with a powerful Admin Panel to view system statistics and the Click Heatmap. To access it, you need to elevate a user account to `admin`.

1. Register an account normally via the UI.
2. Open your terminal inside the `server/` directory.
3. Run this automated script to promote your user (replace `YOUR_USERNAME_HERE`):
```bash
node -e "import mongoose from 'mongoose'; import 'dotenv/config'; await mongoose.connect(process.env.MONGODB_URI); await mongoose.connection.db.collection('users').updateOne({ username: 'YOUR_USERNAME_HERE' }, { \$set: { role: 'admin' } }); console.log('Done!'); process.exit();"
```
4. Log out and log back into the app. The **Admin** tab will appear in your navbar!

<br />

---

<div align="center">
  <p><b>Academic Project developed for CSE327 Software Engineering</b></p>
  <p>North South University</p>
</div>
