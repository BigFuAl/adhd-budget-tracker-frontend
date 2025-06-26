# 💸 ADHD-Friendly Budget Tracker

A full stack budgeting app designed with simplicity, clarity, and ADHD brains in mind. Track your expenses, visualize your spending, and stay on top of your financial habits — without the overwhelm.

---

## 🚀 Features

- 🔐 User Authentication (JWT)
- 💰 Add, edit, and delete expenses
- 📊 Category breakdown + spending charts
- 🔍 Filter expenses by category
- 📅 Visual feedback for new or updated entries
- 📡 Full stack: React + Express + MongoDB
- 🔒 Secure backend routes with token-based auth
- 🌐 Deployed with Azure Static Web Apps (or your deployment of choice)

---

## 🧠 Tech Stack

| Layer         | Tech                        |
|---------------|-----------------------------|
| Frontend      | React, Recharts             |
| Backend       | Node.js, Express            |
| Database      | MongoDB (Mongoose)          |
| Auth          | JWT (token-based)           |
| Deployment    | Azure Static Web Apps (or Netlify + Render) |

---

## 📸 Screenshots

> _Paste screenshots here once ready — drag them into this file or host them externally._

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or above)
- MongoDB (local or Atlas)
- Git

### Installation

```bash
# Clone the repo
git clone https://github.com/BigFuAl/adhd-budget-tracker.git

# Navigate into backend
cd adhd-budget-tracker/backend

# Install backend dependencies
npm install

# Create a .env file
touch .env

<pre><code>### 🔒 Environment Variables

Inside your `.env` file:

```
MONGO_URI=your_mongodb_connection  
JWT_SECRET=your_jwt_secret  
PORT=3001
```
</code></pre>



# Start backend server
npm run dev

Then in another terminal:
# Navigate into frontend
cd ../frontend

# Install frontend deps
npm install

# Start the React app
npm start


🧠 Why This App?

This was built to help users with ADHD:
	•	Reduce decision fatigue
	•	Focus on essentials
	•	Get visual feedback for motivation
	•	Keep things simple + fast

⸻

🙌 Author

Aliou Cissé
@BigFuAl

⸻

✅ Roadmap
	•	Add monthly budget caps & alerts
	•	Integrate recurring expense logic
	•	Add export to CSV
	•	Turn into a native mobile app via React Native

⸻

📃 License

MIT — free to use, fork, remix.
---
