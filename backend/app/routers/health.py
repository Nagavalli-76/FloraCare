import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import HealthObservation, Plant, HealthStatus
from app.schemas.schemas import HealthObservationOut, HealthObservationCreate

router = APIRouter(prefix="/api/health", tags=["health"])

# Demo-only "AI Analysis" outcomes. This is NOT a real diagnostic model --
# it is a labelled demo response so the UI/UX and future ML integration
# point can be shown without pretending a real model exists.
_DEMO_OUTCOMES = [
    (HealthStatus.HEALTHY, "No visible symptoms detected in the demo analysis.", []),
    (HealthStatus.PEST_SUSPECTED, "Leaf discoloration pattern resembles common pest activity (demo).", ["spotting", "curled leaves"]),
    (HealthStatus.NUTRIENT_ISSUE_SUSPECTED, "Yellowing pattern consistent with a possible nutrient deficiency (demo).", ["yellowing"]),
]


@router.get("/plant/{plant_id}", response_model=List[HealthObservationOut])
def get_history(plant_id: int, db: Session = Depends(get_db)):
    return (
        db.query(HealthObservation)
        .filter(HealthObservation.plant_id == plant_id)
        .order_by(HealthObservation.created_at.desc())
        .all()
    )


@router.post("", response_model=HealthObservationOut)
def log_observation(payload: HealthObservationCreate, db: Session = Depends(get_db)):
    plant = db.query(Plant).filter(Plant.id == payload.plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    obs = HealthObservation(**payload.model_dump())
    db.add(obs)
    plant.health_status = payload.status
    db.commit()
    db.refresh(obs)
    return obs


@router.post("/ai-demo/{plant_id}", response_model=HealthObservationOut)
def run_ai_demo(plant_id: int, db: Session = Depends(get_db)):
    """
    Simulated 'Upload Plant Image -> Analyze' flow.
    Clearly labelled as a DEMO -- returns a random plausible outcome rather
    than performing any real image analysis. Architecture is ready for a
    future ML API to be swapped in here.
    """
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    status, note, symptoms = random.choice(_DEMO_OUTCOMES)
    obs = HealthObservation(
        plant_id=plant_id,
        status=status,
        symptoms=", ".join(symptoms),
        observation_notes=f"[AI Analysis Demo] {note}",
        is_ai_demo=1,
    )
    db.add(obs)
    plant.health_status = status
    db.commit()
    db.refresh(obs)
    return obs
