# PROJECT_OVERVIEW.md

## Title
FloraCare — Smart Floriculture Nursery Management & Plant Care Assistant

## Problem Statement
Nursery workers growing flowering plants such as Rose, Jasmine, Marigold and
ornamental shrubs face recurring, practical challenges in day-to-day cultivation:
irrigation timing, pest and disease pressure, nutrient/soil issues, and inconsistent
record-keeping across multiple plants and beds. Most of this knowledge is currently
tracked informally or from memory, which makes it hard to spot problems early or
review history later.

## Existing Problem
During a field study of nurseries in the Ramanayyapeta/Sarpavaram area of Kakinada
(including Shri Surya Nursery), the following gaps were observed:
- No systematic record of which plants/batches need watering, pruning, or inspection
- Pest and disease issues are often noticed late, after visible damage
- Irrigation decisions are made on instinct rather than any consistent check
- No simple way to look up flower-specific care guidance on-site
- No easy way to identify a specific plant/batch quickly among many

## Proposed Solution
FloraCare is a web application that gives a nursery team one place to:
- Log and track every plant/batch with its flower type, location, and health
- Get a transparent, rule-based irrigation recommendation from soil moisture readings
- Record health observations over time, with a clearly-labelled AI-analysis demo
- Schedule and track recurring maintenance tasks
- See system-generated alerts for irrigation, pest, disease, and overdue maintenance
- Look up general flower care guidance for the flowers they grow
- Generate a QR code per plant/batch for quick on-site identification
- Export reports/statistics for review

## Objectives
1. Provide a single dashboard view of nursery health and priorities
2. Make irrigation guidance transparent and explainable, not a black box
3. Support systematic maintenance scheduling instead of memory-based tracking
4. Lay architecture groundwork for a future real ML-based disease detection model
5. Keep the system entirely free to run — no paid APIs, cloud services, or IoT hardware

## Target Users
Nursery workers and small nursery teams growing flowering plants for local sale,
decoration, or garland use — the kind of grower observed during the CSP field visit.

## Main Features
1. Professional Dashboard
2. Flower Care Encyclopedia
3. Nursery Plant/Batch Management (CRUD)
4. Smart Irrigation Recommendation
5. Plant Health Monitoring
6. Maintenance Scheduler
7. Alerts & Notifications
8. Plant Details / History
9. QR-based Plant/Batch Identification
10. Reports / Statistics
11. Settings
12. AI Analysis Demo interface (labelled, not a real diagnostic model)

## System Architecture
```
Browser (React SPA, Vite build)
        │  REST calls over HTTP (fetch)
        ▼
FastAPI backend (Uvicorn ASGI server)
        │  SQLAlchemy ORM
        ▼
SQLite database (single local file)
```
The frontend and backend are decoupled: the frontend only talks to the backend
through documented REST endpoints, so either layer can be modified independently.

## Modules
See "Main Features" above — each is implemented as a distinct page/router pair
(e.g. Irrigation page ↔ `/api/irrigation/check`, Maintenance page ↔ `/api/maintenance`).

## Technology Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Recharts, qrcode.react
- **Backend:** FastAPI, SQLAlchemy ORM, Pydantic
- **Database:** SQLite
- **API style:** REST / JSON

## Database Design
- **flowers** — id, name, emoji, category, description, sunlight, watering, soil,
  maintenance, common_issues, care_tips, image_color
- **plants** — id, plant_code, flower_id (FK), variety, quantity, location,
  planting_date, last_watered, soil_moisture, temperature, health_status, notes
- **maintenance_tasks** — id, plant_id (FK), task_name, due_date, priority, status,
  notes, completed_at
- **health_observations** — id, plant_id (FK), status, symptoms, observation_notes,
  is_ai_demo, created_at
- **alerts** — id, plant_id (FK, nullable), category, severity, message, is_read,
  created_at

Relationships: one Flower has many Plants; one Plant has many MaintenanceTasks,
HealthObservations, and Alerts.

## Future Scope
- Real camera-based QR scanning instead of a simulated scan flow
- A genuine ML model behind the AI Analysis Demo endpoint for pest/disease detection
- Multi-user accounts and multi-nursery support
- Weather-API integration for rainfall-aware irrigation
- SMS/push notifications for CRITICAL alerts

## Limitations
- The irrigation engine is a simple rule-based decision-support tool, not a
  scientific agricultural model, and does not replace expert judgement
- The AI Analysis Demo returns a labelled, simulated result rather than a real
  image-based diagnosis
- Care guidance in the Flower Library is general and can vary by variety, climate,
  soil, and season
- Currently single-user/single-nursery; no authentication layer

## Expected Benefits
- More consistent, earlier detection of irrigation and health issues
- Reduced reliance on memory for maintenance scheduling
- A simple, explainable irrigation aid usable without any special training
- A foundation that can be extended with real sensors or ML models later
