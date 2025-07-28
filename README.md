# QuickHire AI

A modern AI-powered technical interview platform for companies and students. Companies can create and manage interviews, upload candidates, and view detailed AI-evaluated reports. Students can take company-driven or mock interviews with real-time feedback and AI-generated questions.

---

## Features
- Company and student login/registration
- Company-driven and mock interview flows
- AI-generated questions and answer evaluation (Google Gemini)
- Real-time webcam and speech analysis
- Detailed candidate reports for companies
- Secure JWT authentication
- Modern React frontend and Express backend

---

## Folder Structure

```
QuickHire_AI/
  ├── Frontend/      # React app (Vite)
  ├── Backend/       # Node.js/Express API
  ├── README.md      # Project documentation
  └── ...
```

---

## 🛠️ Prerequisites
- Node.js (v16+ recommended)
- npm (v8+ recommended)
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

---

##  Quick Start

### 1. Clone the Repository
```sh
git clone https://github.com/AtharvaKhot17/QuickHireAI.git
cd QuickHire_AI
```

### 2. Setup Backend
```sh
cd Backend
cp .env.example .env   # Create your .env file (see below)
npm install
```

#### Environment Variables (`Backend/.env`)
```
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
PORT=5001
NODE_ENV=development
```

### 3. Setup Frontend
```sh
cd ../Frontend
npm install
```

### 4. Run Locally
#### Start Backend
```sh
cd Backend
npm start
```
#### Start Frontend (in a new terminal)
```sh
cd Frontend
npm run dev
```
- Frontend: http://localhost:5173 (or next available port)
- Backend:  http://localhost:5001 (or next available port)

---

##  Usage

### For Companies
1. Register/login as a company
2. Create interviews (define skills, duration)
3. Upload candidate list (CSV)
4. Share interview/candidate codes
5. Monitor progress and view reports

### For Students
1. Register/login as a student
2. Join company interview (with code) or start a mock interview
3. Complete questions (webcam/speech optional)
4. View feedback (mock) or completion message (company)

---

##  Project Architecture (Summary)
- **Frontend**: React 18, Vite, React Router, Axios, CSS modules
- **Backend**: Express, MongoDB (Mongoose), JWT, bcrypt, Multer
- **AI**: Google Gemini API for question generation and answer evaluation
- **Authentication**: JWT-based, role-based access
- **Session Management**: In-memory for active interviews, persistent in MongoDB

---

##  Contributing
1. Fork this repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

##  More Documentation
- See the main README sections below for full technical/architecture details
- See `Backend/API_DOCUMENTATION.md` for API details
- See `Backend/VALIDATION_CHECKLIST.md` for validation rules

---


