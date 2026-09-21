"""
Seed script: populates the FloraCare database with realistic demo data so
the app is never empty on first run (flowers, plants, tasks, alerts).

Run with:  python -m app.seed   (from the backend/ folder)
"""
import datetime
from app.database import SessionLocal, engine, Base
from app.models.models import (
    Flower, Plant, MaintenanceTask, Alert,
    HealthStatus, TaskStatus, TaskPriority, AlertSeverity,
)

FLOWERS = [
    dict(
        name="Rose", emoji="🌹", category="Flowering Shrub",
        description="A widely grown flowering shrub valued for its blooms and fragrance. "
                     "Popular in nurseries for cut-flower and ornamental use.",
        sunlight="Generally prefers 6+ hours of direct sunlight daily. Requirements can vary by variety and climate.",
        watering="Typically watered deeply 2-3 times a week; avoid waterlogging. Adjust for season and soil type.",
        soil="Prefers well-drained, slightly acidic to neutral loamy soil enriched with organic matter.",
        maintenance="Regular pruning after flowering, deadheading spent blooms, periodic pest inspection.",
        common_issues="Aphids\nPowdery mildew\nBlack spot\nThrips",
        care_tips="Prune at an angle above outward-facing buds.\nMulch to retain soil moisture.\nInspect undersides of leaves weekly for pests.",
        image_color="#f3d1d8",
    ),
    dict(
        name="Jasmine", emoji="🌼", category="Fragrant Climber/Shrub",
        description="A fragrant flowering plant commonly grown for its scented blooms, used in garlands and rituals.",
        sunlight="Prefers partial to full sun; some shade tolerance depending on variety.",
        watering="Moderate and consistent watering; avoid letting the soil dry out completely. Varies with season.",
        soil="Well-drained loamy soil with good organic content.",
        maintenance="Light pruning to encourage bushy growth; regular harvesting of flowers can promote further blooming.",
        common_issues="Sooty mould\nSpider mites\nBud drop",
        care_tips="Support climbing varieties with a trellis.\nHarvest flowers in early morning.\nAvoid overwatering in cooler months.",
        image_color="#f7f3d9",
    ),
    dict(
        name="Marigold", emoji="🟠", category="Annual Flowering Plant",
        description="A hardy, fast-growing annual flower, widely used for garlands, decoration and pest-deterrent companion planting.",
        sunlight="Full sun; at least 6 hours daily for best flowering. General guidance -- varies by season.",
        watering="Water at soil level 2-3 times a week; drought-tolerant once established.",
        soil="Adapts to most well-drained soils; avoid heavy waterlogged soil.",
        maintenance="Deadhead regularly to prolong blooming; low overall maintenance.",
        common_issues="Spider mites\nRoot rot (from overwatering)\nLeaf spot",
        care_tips="Pinch young plants to encourage bushiness.\nSpace plants to allow airflow.\nRemove faded flowers regularly.",
        image_color="#fbe3b0",
    ),
    dict(
        name="Ornamental Plants", emoji="🪴", category="Mixed Ornamentals/Shrubs",
        description="General category covering decorative shrubs and foliage plants grown for nursery display and landscaping.",
        sunlight="Varies widely by species -- ranges from full sun to shade-tolerant. Check variety-specific guidance.",
        watering="Varies by species; general rule is to water when the top inch of soil feels dry.",
        soil="Typically well-drained soil with moderate organic content; specific needs vary by species.",
        maintenance="Periodic shaping/pruning, occasional repotting, general pest inspection.",
        common_issues="Mealybugs\nRoot-bound growth\nLeaf yellowing (varied causes)",
        care_tips="Group plants with similar water needs together.\nRotate pots periodically for even growth.\nCheck for root-bound conditions each season.",
        image_color="#dbe8d8",
    ),
]

PLANT_SEED = [
    ("Rose", "Hybrid Tea", "Bed A1", 24, 26.0, HealthStatus.HEALTHY, 3),
    ("Rose", "Floribunda", "Bed A2", 18, 41.0, HealthStatus.NEEDS_ATTENTION, 40),
    ("Jasmine", "Mogra", "Bed B1", 30, 55.0, HealthStatus.HEALTHY, 5),
    ("Jasmine", "Spanish Jasmine", "Bed B2", 12, 22.0, HealthStatus.PEST_SUSPECTED, 30),
    ("Marigold", "African Marigold", "Bed C1", 40, 60.0, HealthStatus.HEALTHY, 2),
    ("Marigold", "French Marigold", "Bed C2", 35, 28.0, HealthStatus.NUTRIENT_ISSUE_SUSPECTED, 15),
    ("Ornamental Plants", "Croton", "Bed D1", 15, 48.0, HealthStatus.HEALTHY, 6),
    ("Ornamental Plants", "Bougainvillea", "Bed D2", 10, 33.0, HealthStatus.DISEASE_SUSPECTED, 20),
]


def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Flower).count() > 0:
            print("Database already seeded. Skipping.")
            return

        flower_map = {}
        for f in FLOWERS:
            flower = Flower(**f)
            db.add(flower)
            db.flush()
            flower_map[f["name"]] = flower
        db.commit()

        now = datetime.datetime.utcnow()
        plants = []
        for i, (fname, variety, bed, qty, moisture, health, days_ago_watered) in enumerate(PLANT_SEED, start=1):
            flower = flower_map[fname]
            code = f"{fname[:4].upper()}-{bed.replace(' ', '')}-{i:03d}"
            plant = Plant(
                plant_code=code,
                flower_id=flower.id,
                variety=variety,
                quantity=qty,
                location=bed,
                planting_date=now - datetime.timedelta(days=90 + i * 5),
                last_watered=now - datetime.timedelta(hours=days_ago_watered),
                soil_moisture=moisture,
                temperature=29.0,
                health_status=health,
                notes="Seeded demo record.",
            )
            db.add(plant)
            plants.append(plant)
        db.commit()
        for p in plants:
            db.refresh(p)

        # Maintenance tasks
        task_defs = [
            (plants[0], "Pruning", 1, TaskPriority.MEDIUM, TaskStatus.PENDING),
            (plants[1], "Pest Inspection", 0, TaskPriority.HIGH, TaskStatus.PENDING),
            (plants[2], "Watering", 2, TaskPriority.LOW, TaskStatus.PENDING),
            (plants[3], "Pest Inspection", -1, TaskPriority.HIGH, TaskStatus.PENDING),  # overdue
            (plants[4], "Fertilizer Check", 3, TaskPriority.MEDIUM, TaskStatus.PENDING),
            (plants[5], "Soil Check", -2, TaskPriority.HIGH, TaskStatus.PENDING),  # overdue
            (plants[6], "Cleaning", 5, TaskPriority.LOW, TaskStatus.COMPLETED),
            (plants[7], "Plant Inspection", 1, TaskPriority.HIGH, TaskStatus.PENDING),
        ]
        for plant, name, offset, priority, status in task_defs:
            db.add(MaintenanceTask(
                plant_id=plant.id,
                task_name=name,
                due_date=now + datetime.timedelta(days=offset),
                priority=priority,
                status=status,
                completed_at=now - datetime.timedelta(days=1) if status == TaskStatus.COMPLETED else None,
            ))
        db.commit()

        # Alerts
        alert_defs = [
            (plants[1], "irrigation", AlertSeverity.WARNING, f"{plants[1].plant_code} soil moisture below optimal range."),
            (plants[3], "pest", AlertSeverity.CRITICAL, f"{plants[3].plant_code} showing signs of possible pest activity."),
            (plants[5], "health", AlertSeverity.WARNING, f"{plants[5].plant_code} may have a nutrient deficiency."),
            (plants[7], "health", AlertSeverity.CRITICAL, f"{plants[7].plant_code} disease suspected -- inspect promptly."),
            (None, "maintenance", AlertSeverity.INFO, "2 maintenance tasks are overdue this week."),
        ]
        for plant, category, severity, message in alert_defs:
            db.add(Alert(
                plant_id=plant.id if plant else None,
                category=category,
                severity=severity,
                message=message,
            ))
        db.commit()

        print(f"Seeded {len(FLOWERS)} flowers, {len(plants)} plants, {len(task_defs)} tasks, {len(alert_defs)} alerts.")
    finally:
        db.close()


if __name__ == "__main__":
    run()
