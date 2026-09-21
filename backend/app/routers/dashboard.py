import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Plant, MaintenanceTask, Alert, Flower, HealthStatus, TaskStatus, AlertSeverity
from app.schemas.schemas import DashboardStats

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardStats)
def get_dashboard(db: Session = Depends(get_db)):
    plants = db.query(Plant).all()
    total = len(plants)
    healthy = sum(1 for p in plants if p.health_status == HealthStatus.HEALTHY)
    needs_attention = sum(1 for p in plants if p.health_status != HealthStatus.HEALTHY)
    irrigation_alerts = sum(1 for p in plants if p.soil_moisture < 30)
    pest_disease = sum(
        1 for p in plants
        if p.health_status in (HealthStatus.PEST_SUSPECTED, HealthStatus.DISEASE_SUSPECTED)
    )
    maintenance_due = (
        db.query(MaintenanceTask)
        .filter(MaintenanceTask.status == TaskStatus.PENDING)
        .filter(MaintenanceTask.due_date <= datetime.datetime.utcnow() + datetime.timedelta(days=1))
        .count()
    )

    plants_by_flower = {}
    for p in plants:
        name = p.flower.name if p.flower else "Unknown"
        plants_by_flower[name] = plants_by_flower.get(name, 0) + 1

    health_distribution = {}
    for p in plants:
        key = p.health_status.value if hasattr(p.health_status, "value") else p.health_status
        health_distribution[key] = health_distribution.get(key, 0) + 1

    all_tasks = db.query(MaintenanceTask).all()
    maintenance_status = {"Pending": 0, "Completed": 0}
    for t in all_tasks:
        key = t.status.value if hasattr(t.status, "value") else t.status
        maintenance_status[key] = maintenance_status.get(key, 0) + 1

    irrigation_status = {"Normal": 0, "Monitor": 0, "Irrigation Recommended": 0}
    for p in plants:
        if p.soil_moisture < 30:
            irrigation_status["Irrigation Recommended"] += 1
        elif p.soil_moisture < 45:
            irrigation_status["Monitor"] += 1
        else:
            irrigation_status["Normal"] += 1

    return DashboardStats(
        total_plants=total,
        healthy_plants=healthy,
        needs_attention=needs_attention,
        irrigation_alerts=irrigation_alerts,
        maintenance_due=maintenance_due,
        pest_disease_alerts=pest_disease,
        plants_by_flower=plants_by_flower,
        health_distribution=health_distribution,
        maintenance_status=maintenance_status,
        irrigation_status=irrigation_status,
    )
