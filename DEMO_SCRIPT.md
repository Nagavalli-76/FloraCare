# DEMO_SCRIPT.md
### A 5–10 minute walkthrough for demonstrating FloraCare

Before you start: make sure the backend is running (`uvicorn app.main:app --reload`
from `backend/`) and the frontend is running (`npm run dev` from `frontend/`), and
that you've run `python -m app.seed` at least once so there's demo data to show.

---

**1. Open FloraCare (Landing Page)**
> "This is FloraCare — a nursery management and plant care assistant we built for our
> Community Service Project on floriculture. It's based on a field study we did with
> flower growers in the Ramanayyapeta/Sarpavaram area of Kakinada. The goal isn't to
> sell flowers — it's to help a nursery team track and care for the plants they
> already grow."

Click **"Explore Nursery"** or **"Open Dashboard"**.

**2. Show the Dashboard**
> "This dashboard gives an at-a-glance view of the whole nursery — total plants,
> how many are healthy, irrigation alerts, and maintenance that's due. These charts
> update live from the database, not hard-coded numbers."

Point out: stat cards, health distribution pie chart, flower distribution bar chart,
today's priorities list.

**3. Open Flower Library → select Rose**
> "Each flower we identified in our field study — Rose, Jasmine, Marigold, and
> general ornamentals — has a care guide: sunlight, watering, soil, and common
> issues. We were careful to phrase this as general guidance, since exact care
> varies by variety, climate and season."

**4. Add a plant batch**
Go to **My Nursery** → **Add Plant/Batch**. Fill in a flower, variety, bed location,
and soil moisture, then save.
> "Adding a batch automatically generates a Plant ID like ROSE-A1-001, combining the
> flower, the bed, and a running count."

**5. Open the plant's details**
Click the new plant.
> "This is the full record for one plant/batch — its location, quantity, planting
> date, current moisture, and a QR code we can print and stick on the bed for quick
> identification later."

**6. Show irrigation recommendation**
Still on the plant detail page — point to the Irrigation Status card.
> "This is calculated by a simple, transparent rule: if soil moisture is below 30%,
> it recommends irrigation. Between 30–45%, it says 'Monitor' unless the plant
> hasn't been watered in over 24 hours. This is intentionally simple so I can
> explain exactly how it decided that — it's a decision-support tool, not a claim
> of scientific precision."

**7. Create a maintenance task**
Go to **Maintenance** → **New Task**. Pick the plant, task type (e.g. Pest
Inspection), a due date, and priority.
> "Tasks show up under Today, Upcoming, or Overdue, so nothing gets forgotten."

**8. Show an alert**
Go to **Alerts**.
> "The system automatically raises an alert when soil moisture drops too low, or
> when a plant's health status changes — with INFO, WARNING, or CRITICAL severity."

**9. Upload plant image in AI demo**
Back on a plant's detail page, click **"Upload Plant Image → Analyze"**.
> "This feature is clearly labelled as an AI Analysis Demo — it doesn't run a real
> image model yet. It returns a simulated but plausible result, and the backend is
> already structured so a real machine-learning model could be plugged in here
> later without changing the rest of the app."

**10. Show Reports**
Go to **Reports**.
> "This page summarizes maintenance completion and irrigation status across the
> whole nursery, and we can export everything to CSV for further review."

**11. Show QR plant ID again (wrap-up)**
> "And that QR code we saw earlier is how a worker in the field could scan a plant
> and pull up this exact page — right now it's a generate-and-simulate flow, but
> the architecture supports a real scan-to-open flow."

**Closing line:**
> "So FloraCare takes the real problems we saw in the field — irrigation timing,
> pest detection, inconsistent record-keeping — and gives a nursery team one simple
> place to manage all of it, without needing any paid services or special hardware."
