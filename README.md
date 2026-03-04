# Progressive Overload Tracker

A web app for tracking progressive overload in weight training.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Python FastAPI
- **Database:** SQLite with SQLAlchemy

## Setup

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API runs at http://localhost:8000.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at http://localhost:5173.

## Project Structure

```
progressive-overload-tracker/
├── backend/
│   ├── main.py          # FastAPI app with health check route
│   ├── database.py      # SQLite + SQLAlchemy connection setup
│   ├── models.py        # Workout model
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx      # Landing page with backend status check
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```
