# 🎨 DrawSpace — Real-Time Collaborative Whiteboard

DrawSpace is a full-stack collaborative whiteboard built with React, Express, Prisma, and Socket.io.
It allows users to draw, brainstorm, and collaborate in real-time through an intuitive, minimal, and responsive interface — right in the browser.

---

## 🚀 Features

- ⚡ **Real-Time Collaboration** — Draw and edit simultaneously using WebSockets.
- 🧩 **Smart Shape Handling** — AI-assisted logic for shape recognition and alignment.
- 🔐 **Authentication System** — Signup, login, and JWT-based secure authorization.
- 💾 **Drawing Save System** — Save, retrieve, and manage your whiteboard sessions.
- 🖥️ **Modern UI** — Built using React + TailwindCSS for a sleek, creative interface.
- 🗂️ **Personal Dashboard** — Organize and view all your drawings in one place.
- ⏳ **Version History** — Restore previous versions of your work anytime.

## 🏗️ Tech Stack

### Frontend

- React (Vite)
- Context API
- React Router DOM
- TailwindCSS
- Socket.io Client

### Backend

- Node.js + Express
- Prisma ORM
- JSON Web Tokens (JWT)
- PostgreSQL (Render-hosted)
- Socket.io (Real-time Engine)

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

-git clone https://github.com/Mayankaggarwal8055/DrawSpace.git
-cd DrawSpace

2️⃣ **Backend Setup**
-cd backend
-npm install

-Create a .env file inside /backend:

-DATABASE_URL="your_postgres_connection_url"
-JWT_SECRET="your_secret_key"

-Run Prisma migrations:
-npx prisma migrate dev

-Start the backend:
-npm run start

3️⃣ **Frontend Setup**

-cd ../frontend
-npm install
-npm run dev

-The frontend will start at http://localhost:5173
-The backend will run at http://localhost:4444

🌐 **Deployment**

-Frontend: Vercel
-Backend: Render
-Live Demo: excalidraw-eight-mu.vercel.app

🧪 **Testing Locally**

-Start the backend first

-Then start the frontend

-Sign up or log in to your account

-Create a new drawing and collaborate in real time

-📸 Preview
-🛠️ Future Enhancements
-✨ Multi-user drawing rooms
-🧠 AI-powered shape suggestions
-☁️ Cloud-based drawing storage
-📤 Shareable project links
-📱 Mobile-friendly drawing interface

👨‍💻 **Author**

-Mayank Aggarwal
-Full Stack Web Developer
-📍 Haryana, India

🔗 Portfolio Website

📧 aggarwalmayank184@gmail.com
