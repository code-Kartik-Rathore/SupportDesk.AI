# ⚡ SupportDesk AI

An advanced, high-performance, and visually spectacular AI-Powered Ticket Management & Routing System designed to automate and streamline IT and customer support operations.

SupportDesk AI leverages **Llama 3.3 (via Groq Cloud)**, **Inngest event-driven workflows**, and real-time **Gmail SMTP** to triage, categorize, prioritize, assign, and resolve tickets instantly.

---

## 🎨 Visual Showcase & User Interface

SupportDesk AI features a state-of-the-art modern dark/light mode interface built with **React**, **Tailwind CSS**, and **DaisyUI**, packed with dynamic background animations, elegant glassmorphism cards, and interactive hover states.

### 🌟 Landing Page
Beautiful custom animated mesh backgrounds with desynchronized floating gradient blobs, dynamic sparkles, and floating stars.
<img width="2940" height="1662" alt="image" src="https://github.com/user-attachments/assets/4776698e-a917-41a1-8205-7cceff0ed6f6" />



### 🔒 Login & Authorization
Clean secure authentication layout featuring dual quick-access demo log-in options.
<img width="2940" height="1670" alt="image" src="https://github.com/user-attachments/assets/654c7cea-e053-46f2-9520-a152bee0adac" />


### 🎫 AI Ticket Insights & Resolution Form
Detailed ticket page showcasing required skills identified by the AI, helpful notes generated automatically, and an interactive resolution interface for assigned moderators.
<img width="2936" height="1658" alt="image" src="https://github.com/user-attachments/assets/473d91cb-7a6f-4080-8f8b-2e190031526b" />



### 🛠️ Admin Control Panel
A unified control center for administrators to manage users, update skills, assign roles (Admin/Moderator/User), or permanently delete members with secure browser prompts.
<img width="1470" height="828" alt="image" src="https://github.com/user-attachments/assets/6cad3369-6626-48b9-899a-e29864f39078" />


---

## 🚀 Key Features

*   🤖 **AI-Powered Triaging**: Instantly analyzes ticket descriptions using Llama 3 via Groq SDK to extract required technical skills, assign priority levels, and generate helpful debugging tips.
*   🎯 **Smart Substring Skill Routing**: An intelligent, case-insensitive, two-way Javascript skill matching algorithm that assigns tickets to the most qualified moderator.
*   ⏳ **Event-Driven Workflows**: Orchestrated using **Inngest** to process background tasks (triage, assignment, and status updates) safely without blocking main threads.
*   📧 **Automated Gmail Notifications**: Sends real-time, beautifully designed HTML emails to:
    *   **Users** on ticket creation & assignment.
    *   **Moderators** on ticket assignment.
    *   **Both parties** upon successful resolution.
*   👤 **Role-Based Access Control**: Strict multi-tiered authentication (Admin, Moderator, and Standard User).
*   👥 **User & Team Management**: Complete control for Admins to dynamically update user skills, change roles, or delete users with DB cascade-safety.

---

## 🛠️ Technology Stack

| Component | Technology Used |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, DaisyUI, Lucide Icons, React Router DOM |
| **Backend** | Node.js, Express, MongoDB (Mongoose) |
| **Workflow Engine** | Inngest (Dev Server & Background Events) |
| **AI Integration** | Groq Cloud SDK (`llama-3.3-70b-versatile` JSON mode) |
| **Email Service** | NodeMailer (Gmail SMTP Transport with App Passwords) |

---

## ⚙️ Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Running locally or via Atlas)
*   A Groq Cloud API Key
*   A Gmail Account & 16-character App Password

### 1. Clone & Set Up the Backend
```bash
cd ai-ticket-assistant
npm install
```

Create a `.env` file inside `ai-ticket-assistant/`:
```env
MONGO_URI=mongodb://localhost:27017/ai-ticket-database
JWT_SECRET=your_jwt_secret_key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_16_digit_app_password

GROQ_API_KEY=your_groq_api_key
APP_URL=http://localhost:3000
```

### 2. Set Up the Frontend
```bash
cd ../ai-ticket-frontend
npm install
```

Create a `.env` file inside `ai-ticket-frontend/`:
```env
VITE_SERVER_URL=http://localhost:3000
```

---

## 🚦 How to Run Locally

We use a concurrent running structure to power the entire system. Open three separate terminal windows:

### Terminal 1: Run the Backend Express Server
```bash
cd ai-ticket-assistant
npm run dev
```

### Terminal 2: Run the Inngest Dev Server
```bash
cd ai-ticket-assistant
npm run inngest-dev
```

### Terminal 3: Run the React Frontend Application
```bash
cd ai-ticket-frontend
npm run dev
```

Visit the app in your browser at `http://localhost:5173`.

---

## 🧪 Seeding Test Data (Optional)
To quickly pre-populate your local database with high-quality sample users, moderators, and tickets:
```bash
cd ai-ticket-assistant
node seed.js
```
This sets up:
*   **Admin**: `admin@ticketai.com` (Password: `password123`)
*   **Moderators**: Various specialized engineering moderators with specific skill sets.
