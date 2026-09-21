# VIVA_QUESTIONS.md
### Likely questions and simple answers for the college viva

**Q1. What problem does FloraCare solve?**
It helps nursery workers systematically track and maintain flowering plants —
irrigation, health, and maintenance — instead of relying on memory or informal
notes. It's based on real problems observed during our CSP field visit to nurseries
in Ramanayyapeta/Sarpavaram, Kakinada.

**Q2. Why isn't this an e-commerce site for buying flowers?**
Because that wasn't the problem we identified in the field. Growers needed help
*maintaining* plants, not another sales channel — so we scoped the project around
care and management instead.

**Q3. How does the irrigation recommendation work?**
It's a simple rule-based function, not a machine-learning model. If soil moisture
is below 30%, it recommends irrigation immediately. Between 30–45%, it recommends
"Monitor" unless the plant hasn't been watered in over 24 hours, in which case it
also recommends irrigation. It also considers temperature and expected rainfall.
The logic lives in `backend/app/services/irrigation.py` and is fully readable.

**Q4. Why rule-based instead of a real ML model for irrigation?**
Because a reliable irrigation ML model needs real sensor data and calibration we
don't have for a student project. A transparent rule-based system is honest about
what it can and can't do, and it's something we can fully explain and defend.

**Q5. Is the "AI Analysis Demo" a real AI model?**
No — it's clearly labelled as a demo. It returns a plausible, simulated result
rather than analyzing an actual uploaded image. We built it this way deliberately,
so we're not misrepresenting a mock result as a real diagnosis. The backend
endpoint (`/api/health/ai-demo/{plant_id}`) is structured so a real model could be
substituted in later without changing the frontend.

**Q6. What database do you use, and why SQLite?**
SQLite — a single local file database. We chose it because it needs no separate
server or installation, which keeps the project simple to run and demonstrate on
any Windows laptop.

**Q7. How is data structured?**
Five main tables: `flowers`, `plants`, `maintenance_tasks`, `health_observations`,
and `alerts`. A `Flower` has many `Plants`; a `Plant` has many tasks, observations,
and alerts. See PROJECT_OVERVIEW.md for the full schema.

**Q8. How does a Plant ID like ROSE-A1-001 get generated?**
It's built automatically from the flower name's first letters, the bed/location,
and a running count of plants for that flower — see `_generate_plant_code()` in
`backend/app/routers/plants.py`.

**Q9. What happens if the backend isn't running?**
The frontend shows a clear message ("Could not reach the FloraCare backend...")
instead of crashing or showing a blank page, with instructions on how to start it.

**Q10. How does the QR code work?**
Each plant/batch has a unique `plant_code`. We generate a QR code encoding that
code using the `qrcode.react` library. Scanning it currently is a generate-and-
simulate flow — a full scan-to-open feature is listed under Future Scope.

**Q11. Why React + FastAPI instead of a single framework?**
Separating frontend and backend lets each be developed, tested, and understood
independently, and mirrors how real production systems are structured — which is
good practice to learn even for a student project.

**Q12. How would you extend this to a real product?**
Add real sensor-based moisture input (or a manual/photo-based method more common
in small nurseries), user accounts, a genuine ML model for pest/disease detection,
and notifications via SMS for CRITICAL alerts — all outlined under Future Scope in
PROJECT_OVERVIEW.md.

**Q13. What are the main limitations of the current system?**
It's single-user, has no authentication, the irrigation logic is intentionally
simple, and the AI health analysis is a labelled demo rather than a working model.
We were explicit about these to avoid overstating what the system currently does.

**Q14. What did the field study contribute to the design?**
It grounded every module in an actual observed problem: irrigation difficulty,
pest/disease pressure, and inconsistent record-keeping directly map to the
Irrigation, Plant Health, and Nursery/Maintenance modules respectively.
