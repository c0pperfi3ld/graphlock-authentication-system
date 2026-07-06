# 🔐 GraphLock — Graphical Password Authentication System

**CSE327 Software Engineering Project — North South University**

A full-stack web application that implements graphical password authentication using click-point spatial memory. Users click secret points on an image instead of typing a text password.

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ ([download](https://nodejs.org))
- **MongoDB** running locally OR a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free cluster

### 1. Configure MongoDB
Edit `server/.env` and set your MongoDB URI:
```
MONGODB_URI=mongodb://localhost:27017/graphical-password-auth
```
Or use MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/graphical-password-auth
```

### 2. Start the Server
```bash
cd server
npm run dev
```

### 3. Start the Client (in a new terminal)
```bash
cd client
npm run dev
```

### 4. Open the App
Visit **http://localhost:5173** in your browser.

## 🎯 Features Implemented

### Core Features
- ✅ Graphical password registration & login
- ✅ Curated image library + custom upload
- ✅ Click-point capture with percentage-based coordinates
- ✅ Euclidean distance tolerance verification
- ✅ Adaptive tolerance radius
- ✅ Text password fallback
- ✅ Session management & audit log

### Security Features
- ✅ Account lockout after failed attempts
- ✅ Password strength indicator
- ✅ Hotspot detection & warnings
- ✅ Password expiry & rotation (90 days)
- ✅ Click-point visualization (registration)
- ✅ Click sequence replay animation

### Wow-Factor Features
- ✅ Plausible deniability (decoy password)
- ✅ Live heatmap visualization (admin)
- ✅ Security entropy comparison dashboard
- ✅ Shoulder surfing resistance demo

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Styling | Vanilla CSS (Dark Glassmorphism) |

## 📁 Project Structure

```
Project/
├── client/           # React Frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── context/      # Auth state management
│   │   └── utils/        # Helper functions
│   └── public/
│       └── default-images/  # Curated password images
│
└── server/           # Node.js Backend
    ├── models/       # Mongoose schemas
    ├── controllers/  # Route handlers
    ├── middleware/    # Auth, rate limiting
    ├── routes/       # API endpoints
    └── utils/        # Tolerance check, hotspot analysis
```

## 👤 Creating an Admin User

After registering, update a user's role in MongoDB:
```javascript
db.users.updateOne({ username: "yourusername" }, { $set: { role: "admin" } })
```

## 📄 License
CSE327 Software Engineering — NSU Academic Project
