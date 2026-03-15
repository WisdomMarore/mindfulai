# MindfulAI 🧘

> Computer Vision AI System for Personalised Mindfulness Interventions Based on Emotional State Recognition

---

## 🚀 Features

- ✅ User registration and JWT authentication
- ✅ Real-time emotion detection (face-api.js deep learning)
- ✅ Personalised ML activity recommendations (Scikit-learn)
- ✅ 7 guided mindfulness activities with voice guidance
- ✅ Activity timer with completion sound
- ✅ Session saving to PostgreSQL database
- ✅ Progress dashboard with charts
- ✅ Session history with emotion filtering
- ✅ 4-tier escalation system for mental health monitoring
- ✅ Community peer support with posts and replies
- ✅ Admin dashboard (privacy-first architecture)
- ✅ Landing page with SEO optimisation
- ✅ Privacy features — data download and account deletion
- ✅ Mobile responsive design with hamburger navigation

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + Tailwind CSS |
| Backend | Django 5.2 + Django REST Framework |
| Database | PostgreSQL 16 |
| Emotion Detection | face-api.js (Client-side Deep Learning) |
| ML Recommendations | Scikit-learn (RandomForest Classifier) |
| Authentication | JSON Web Tokens via SimpleJWT |
| Task Queue | Celery + Redis |
| Version Control | Git — distributed source control for tracking changes and managing code history across the entire development lifecycle |
| Code Repository | GitHub — remote repository hosting platform used for version management, code backup and project documentation |

---

## 🏗 System Architecture
```
┌─────────────────────────────────────────────────────┐
│                    React Frontend                    │
│         (Emotion Detection runs here only)          │
│    face-api.js → emotion label → Django API         │
└──────────────────────┬──────────────────────────────┘
                       │ REST API (JWT)
┌──────────────────────▼──────────────────────────────┐
│                  Django Backend                      │
│   Users │ Sessions │ Escalation │ Community         │
│         Scikit-learn ML Engine                      │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              PostgreSQL Database                     │
│   Stores only emotion labels — never images         │
└─────────────────────────────────────────────────────┘
```

---

## ⚙️ Running Locally

### Prerequisites
- Python 3.12
- Node.js 18+
- PostgreSQL 16
- Redis

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Celery Worker
```bash
cd backend
venv\Scripts\activate
celery -A mindfulai worker --loglevel=info
```

### Environment Variables
Create a `.env` file in the `backend/` directory:
```
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=mindfulai_db
DB_USER=mindfulai_user
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
REDIS_URL=redis://localhost:6379
```

---

## 📱 Application URLs

| Service | URL |
|---|---|
| React Frontend | http://localhost:5173 |
| Django API | http://127.0.0.1:8000/api |
| Django Admin | http://127.0.0.1:8000/admin |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/token/ | Obtain JWT access token |
| POST | /api/token/refresh/ | Refresh JWT token |
| POST | /api/users/register/ | Register new user |
| GET | /api/users/profile/ | Get user profile |
| POST | /api/sessions/ | Save a session |
| GET | /api/sessions/history/ | Get session history |
| GET | /api/sessions/recommend/ | Get ML recommendation |
| GET | /api/escalation/ | Get escalation status |
| POST | /api/escalation/:id/acknowledge/ | Acknowledge alert |
| GET | /api/community/ | Get community posts |
| POST | /api/community/ | Create a post |
| POST | /api/community/:id/reply/ | Reply to a post |
| DELETE | /api/community/:id/delete/ | Delete a post |
| GET | /api/users/admin/stats/ | Admin system stats |
| GET | /api/users/admin/emotions/ | Admin emotion trends |
| GET | /api/users/admin/escalations/ | Admin escalation alerts |
| GET | /api/users/privacy/download/ | Download user data |
| DELETE | /api/users/privacy/delete/ | Delete user account |

---

## 🤖 ML Recommendation Engine

The system uses a **hybrid recommendation approach**:

- **Less than 5 sessions** → Rule-based mapping (emotion → activity)
- **5 or more sessions** → RandomForest Classifier trained on the user's personal session history

Features used for training:
- Emotion detected (label encoded)
- Confidence score

The model learns which activities work best for each individual user over time, making recommendations increasingly personalised.

---

## 🚨 4-Tier Escalation System

| Tier | Colour | Trigger | Action |
|---|---|---|---|
| 1 | 🟢 Green | Normal usage | No alert |
| 2 | 🟡 Yellow | 3 of last 5 sessions negative | Gentle reminder |
| 3 | 🟠 Orange | 4 of last 5 sessions negative | Recommend professional support |
| 4 | 🔴 Red | 3 of last 5 sessions severe (angry/fearful) | Crisis line provided |

---

## 🔒 Privacy First Architecture

| Data | Stored |
|---|---|
| Facial images or photos | ❌ Never |
| Biometric measurements | ❌ Never |
| Emotion labels (e.g. "happy") | ✅ Yes |
| Activity titles | ✅ Yes |
| Session timestamps | ✅ Yes |
| Confidence scores | ✅ Yes |

- Emotion detection runs **entirely client-side** in the browser
- No images or video frames are ever transmitted to the server
- Users can **download all their data** as JSON at any time
- Users can **permanently delete** their account and all associated data

---

## 📁 Project Structure
```
mindfulai/
├── backend/
│   ├── mindfulai/              ← Django config
│   ├── users/                  ← Auth, profiles, admin views
│   ├── mindfulness_sessions/   ← Sessions, ML engine
│   ├── escalation/             ← 4-tier escalation logic
│   ├── community/              ← Posts and replies
│   ├── requirements.txt
│   └── .env
└── frontend/
    ├── public/
    │   └── models/             ← face-api.js model files
    └── src/
        ├── components/         ← Navbar, Footer, ActivityModal
        ├── pages/              ← All page components
        ├── hooks/              ← useEmotionDetection
        ├── store/              ← Zustand auth store
        └── api/                ← Axios client
