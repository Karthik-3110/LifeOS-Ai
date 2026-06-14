# 🚀 LifeOS AI

> **Visualize Your Future. Execute Your Goals.**

LifeOS AI is an AI-powered Visual Second Brain designed for students, developers, and professionals who struggle to manage goals, learning roadmaps, projects, placements, deadlines, and personal growth across multiple platforms.

Instead of using scattered notes, to-do lists, spreadsheets, and calendars, LifeOS AI provides a single visual workspace where users can map their goals, break them into actionable tasks, track progress, and receive AI-powered guidance.

---

## 🌐 Live Demo

**Website:** https://lifeosai.onrender.com

**Backend API:** https://lifeos-ai-5352.onrender.com/

---

# 📖 Problem Statement

Students and professionals often manage their lives across multiple disconnected tools:

* Notes apps
* To-do lists
* Calendars
* YouTube playlists
* Roadmaps
* Project trackers
* Learning platforms

This creates several problems:

* Lack of clarity on priorities
* Missed deadlines
* Poor long-term planning
* Scattered information
* Difficulty visualizing progress

Traditional productivity tools focus on tasks, but they fail to show the bigger picture.

LifeOS AI solves this problem by creating an AI-powered visual planning system where users can organize their entire journey in one place.

---

# 💡 Our Solution

LifeOS AI acts as a **Visual Second Brain**.

Users can:

* Create goals
* Break goals into tasks
* Build visual roadmaps
* Generate plans using AI
* Track progress
* Detect deadline conflicts
* Extract learning plans from YouTube videos
* Plan their week automatically

Everything is displayed on an interactive infinite canvas where goals, tasks, deadlines, and resources are visually connected.

The result is a productivity system that feels more like a personal operating system than a traditional task manager.

---

# ✨ Key Features

## 🎯 Goal Management

Create and manage long-term goals such as:

* Crack Placement Interviews
* Learn MERN Stack
* Build Side Projects
* Prepare for Exams
* Launch a Startup

Track progress in real time.

---

## 🧠 AI Brain Dump

Users can enter thoughts in natural language.

Example:

"I want to become a MERN developer in 6 months and build 3 projects."

LifeOS AI automatically:

* Understands the goal
* Breaks it into tasks
* Generates a roadmap
* Creates visual nodes on the canvas

---

## 🗺 Infinite Visual Canvas

Built using React Flow.

Features:

* Drag and Drop Nodes
* Connect Goals and Tasks
* Visual Learning Roadmaps
* Goal Hierarchies
* Infinite Workspace
* Auto Save

---

## 📺 YouTube Roadmap Extractor

Paste any YouTube learning video.

The system:

1. Extracts the transcript
2. Sends it to AI
3. Creates a structured learning roadmap
4. Converts the roadmap into visual nodes

---

## 📅 Smart Weekly Planner

Generate weekly plans automatically.

The planner analyzes:

* Goals
* Tasks
* Deadlines
* Priorities

And creates a weekly action plan.

---

## ⚠ Deadline Conflict Detection

Detects overlapping deadlines.

Example:

* Exam → June 20
* Assignment → June 20
* Hackathon → June 21

LifeOS AI alerts the user and suggests better scheduling options.

---

## 📊 Analytics Dashboard

Track:

* Goal Completion
* Productivity Trends
* Task Completion Rate
* Weekly Progress
* Readiness Score

Gain insights into personal growth and performance.

---

## 🔐 Secure Authentication

Features:

* User Registration
* Login
* Logout
* Protected Routes
* JWT Authentication
* Secure Cookie Sessions

Password Requirements:

* Minimum 6 Characters
* At Least 1 Special Character

---

# 🏗 System Architecture

Frontend

```text
React
│
├── React Flow
├── Tailwind CSS
├── Framer Motion
├── React Router
├── React Query
└── Axios
```

Backend

```text
Node.js
│
├── Express.js
├── JWT Authentication
├── Groq AI
├── MongoDB
└── REST APIs
```

Database

```text
MongoDB Atlas
```

Deployment

```text
Frontend → Vercel

Backend → Render

Database → MongoDB Atlas
```

---

# 🛠 Tech Stack

## Frontend

* React.js
* JavaScript
* Tailwind CSS
* React Flow
* Framer Motion
* React Router DOM
* Axios
* React Query
* Lucide React

## Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt
* Cookie Parser
* Node Cache

## Database

* MongoDB Atlas
* Mongoose

## AI

* Groq API

## Deployment

* Render

---

# 📂 Project Structure

```text
LifeOS-AI/

├── frontend/
│
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│
│
├── backend/
│
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── cache/
│   │   └── server.js
│
└── README.md
```

---

# ⚙ Environment Variables

## Frontend

```env
VITE_API_URL=
```

## Backend

```env
PORT=5000

MONGODB_URI=

JWT_SECRET=

GROQ_API_KEY=

CLIENT_URL=
```

---

# 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/lifeos-ai.git
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

### Backend Setup

```bash
cd backend

npm install

npm run dev
```

---

# 📈 Future Improvements

* Voice-Based Brain Dump
* Calendar Integration
* Mobile Application
* Team Collaboration
* AI Study Coach
* AI Interview Preparation
* Smart Habit Tracking
* Resume Analyzer
* Placement Predictor
* Offline Support

---

# 🎥 Demo Flow

1. Register/Login
2. Create Goal
3. Open Canvas
4. Use Brain Dump AI
5. Generate Roadmap
6. Add Deadlines
7. Generate Weekly Plan
8. View Analytics
9. Track Progress
10. Logout

##
