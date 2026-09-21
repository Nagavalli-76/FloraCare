# 🌿 FloraCare — Smart Floriculture Nursery Management & Plant Care Assistant

FloraCare is a college Community Service Project (CSP) mini-project that helps nursery
workers monitor and maintain flowering plants — irrigation, plant health, maintenance
scheduling, and alerts — from one simple, professional dashboard.

It is built from real field observations of flower growers and nursery owners in the
Ramanayyapeta/Sarpavaram area of Kakinada, and focuses on **decision support**, not
automated diagnosis: every recommendation is transparent and explainable, which also
makes it easy to walk through during a college viva.

> **This is not a marketplace.** FloraCare does not sell flowers — it helps a nursery
> team track and care for the plants they already grow.

---

## Features

1. **Professional Dashboard** — live stats, charts, today's priorities
2. **Flower Care Encyclopedia** — Rose, Jasmine, Marigold, Ornamental Plants
3. **Nursery Plant/Batch Management** — full CRUD, search, filter, sort
4. **Smart Irrigation Recommendation** — transparent rule-based engine
5. **Plant Health Monitoring** — observations, history, labelled "AI Analysis Demo"
6. **Maintenance Scheduler** — Today / Upcoming / Overdue / Completed
7. **Alerts & Notifications** — INFO / WARNING / CRITICAL severities
8. **Plant Details & History** — full record per plant/batch
9. **QR-based Plant/Batch Identification** — generated QR per plant code
10. **Reports & Statistics** — charts + CSV export, filterable
11. **Settings**
12. **AI Analysis Demo interface** — clearly labelled, ready for a future ML model

---

## Technology Stack

**Frontend:** React 18 + Vite, Tailwind CSS, Lucide React icons, Recharts, qrcode.react
**Backend:** FastAPI, SQLAlchemy ORM
**Database:** SQLite (zero-setup local file database)
**API style:** REST, JSON

No paid APIs, no cloud services, and no IoT hardware are required — the whole app runs
locally on Windows, macOS, or Linux.

---

## Architecture

```
Browser (React SPA)
       │  fetch() — REST/JSON
       ▼
FastAPI backend (Uvicorn)
       │  SQLAlchemy ORM
       ▼
SQLite database (floracare.db)
```

The frontend and backend are independent processes that talk over HTTP, so either can
be restarted, redeployed, or replaced without touching the other.

---

## Folder Structure

```
floracare/
├── README.md
├── PROJECT_OVERVIEW.md
├── DEMO_SCRIPT.md
├── VIVA_QUESTIONS.md
├── .gitignore
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env.example
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/      (Sidebar, Topbar, StatCard, Badge, Modal, ...)
│       ├── layouts/          (DashboardLayout)
│       ├── pages/            (Landing, Dashboard, Nursery, PlantDetail, ...)
│       ├── services/         (api.js — all backend calls)
│       └── utils/            (format.js — dates, colors, labels)
│
└── backend/
    ├── requirements.txt
    ├── .env.example
    └── app/
        ├── main.py            (FastAPI app + router registration)
        ├── database.py        (SQLite engine/session)
        ├── seed.py            (demo data — run once)
        ├── models/models.py   (SQLAlchemy tables)
        ├── schemas/schemas.py (Pydantic request/response models)
        ├── services/irrigation.py  (rule-based recommendation engine)
        └── routers/           (flowers, plants, maintenance, irrigation,
                                 health, alerts, dashboard)
```

---

## Installation & Setup (Windows 11 / PowerShell)

### 1. Backend

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m app.seed
uvicorn app.main:app --reload
```

The API is now running at **http://localhost:8000** (interactive docs at
`http://localhost:8000/docs`). `app.seed` only needs to be run once — it skips
re-seeding if the database already has data. Delete `backend/floracare.db` and re-run
it if you want to reset to fresh demo data.

### 2. Frontend

Open a **second** PowerShell window (leave the backend running in the first):

```powershell
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

> macOS/Linux: the commands are identical except activating the virtual environment,
> which is `source venv/bin/activate` instead of `venv\Scripts\activate`.

### 3. (Optional) Configure the API URL

If your backend runs somewhere other than `http://localhost:8000`, copy
`frontend/.env.example` to `frontend/.env` and edit `VITE_API_URL`.

---

## How to Add a New Flower

1. Open `backend/app/seed.py` (or use the interactive docs at `/docs` → `POST` isn't
   exposed for flowers by default — add a row directly, or extend `routers/flowers.py`
   with a `POST` endpoint following the same pattern as `routers/plants.py`).
2. Add an entry to the `FLOWERS` list in `seed.py` with `name`, `emoji`, `category`,
   `description`, `sunlight`, `watering`, `soil`, `maintenance`, `common_issues`
   (newline-separated), and `care_tips` (newline-separated).
3. Delete `backend/floracare.db` and re-run `python -m app.seed`.

## How to Add a New Plant/Batch

Use the **"Add Plant/Batch"** button on the **My Nursery** page — no code changes
needed. The Plant ID (e.g. `ROSE-A1-001`) is generated automatically from the flower
name, bed location, and a running count.

---

## API Overview

| Method | Endpoint                     | Purpose                              |
|--------|-------------------------------|---------------------------------------|
| GET    | `/api/flowers`                | List flower care guides               |
| GET    | `/api/flowers/{id}`           | Single flower care guide              |
| GET    | `/api/plants`                 | List plants (search/filter/sort)      |
| POST   | `/api/plants`                 | Create a plant/batch                  |
| GET    | `/api/plants/{id}`            | Plant detail                          |
| PUT    | `/api/plants/{id}`            | Update a plant/batch                  |
| DELETE | `/api/plants/{id}`            | Delete a plant/batch                  |
| GET    | `/api/maintenance`            | List maintenance tasks                |
| POST   | `/api/maintenance`            | Create a task                         |
| PUT    | `/api/maintenance/{id}`       | Update/complete a task                |
| DELETE | `/api/maintenance/{id}`       | Delete a task                         |
| POST   | `/api/irrigation/check`       | Run the irrigation recommendation     |
| GET    | `/api/health/plant/{id}`      | Health observation history            |
| POST   | `/api/health`                 | Log a health observation              |
| POST   | `/api/health/ai-demo/{id}`    | Simulated "AI Analysis Demo"          |
| GET    | `/api/alerts`                 | List alerts                           |
| PUT    | `/api/alerts/{id}/read`       | Mark an alert as read                 |
| GET    | `/api/dashboard`              | Aggregated dashboard statistics       |

Full interactive documentation (auto-generated by FastAPI) is available at
**http://localhost:8000/docs** whenever the backend is running.

## Render Deployment

The repository includes `render.yaml` for a single Render Web Service. Its build
command installs frontend dependencies, builds `frontend/dist`, and installs the
backend dependencies. FastAPI then serves both the React application and `/api/*`
from the same public URL; Swagger remains available at `/docs`.

Connect the repository to Render and deploy the Blueprint using the `main` branch.
No application secrets are required for the demo. The optional `CORS_ORIGINS`
environment variable accepts a comma-separated list of origins for local or
cross-origin development; same-origin production requests do not need it.

SQLite is retained for this initial demonstration deployment. Render's default
filesystem is ephemeral, so persistent production data should later move to a
Render persistent disk or a managed PostgreSQL database. Run `python -m app.seed`
manually from `backend` when demo data needs to be added; it is not part of the
normal server startup and skips an already populated database.

---

## Future Improvements

- Real QR **scanning** (camera-based) instead of the simulated scan flow
- A real ML model behind the "AI Analysis Demo" endpoint for pest/disease detection
- User accounts and multi-nursery support
- Weather-API integration for rainfall-aware irrigation suggestions
- Push/SMS notifications for CRITICAL alerts

---

## Troubleshooting

**Frontend shows "Could not reach the FloraCare backend."**
Make sure `uvicorn app.main:app --reload` is running in a separate terminal, and that
`frontend/.env` (if present) points at the correct URL.

**`ModuleNotFoundError` when starting the backend**
Make sure the virtual environment is activated (`venv\Scripts\activate`) before
running `pip install -r requirements.txt`.

**Port already in use**
Run `uvicorn app.main:app --reload --port 8001` and update `VITE_API_URL` to match.

**Database looks empty**
Run `python -m app.seed` from the `backend/` folder (with the virtual environment
active). It only seeds once — delete `backend/floracare.db` first to reseed.

---

## College Project Explanation

FloraCare was developed as the mini-project component of a Community Service Project
on floriculture, based on a field study of nurseries in the Ramanayyapeta/Sarpavaram
area of Kakinada. The field visit identified real, recurring problems for nursery
workers — irrigation timing, pest/disease pressure, and inconsistent record-keeping —
and FloraCare's modules map directly onto those problems rather than adding
unrelated e-commerce or social features. See `PROJECT_OVERVIEW.md` for the full
problem statement, objectives, and system design writeup, `DEMO_SCRIPT.md` for a
ready-to-read walkthrough, and `VIVA_QUESTIONS.md` for likely questions and answers.
