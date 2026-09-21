import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.database import get_db
from app.models.models import Plant, Flower, Alert, AlertSeverity
from app.schemas.schemas import PlantOut, PlantDetailOut, PlantCreate, PlantUpdate

router = APIRouter(prefix="/api/plants", tags=["plants"])


def _generate_plant_code(db: Session, flower: Flower, location: str) -> str:
    prefix = flower.name[:4].upper()
    bed = (location or "GEN").replace(" ", "")[:6].upper()
    count = db.query(Plant).filter(Plant.flower_id == flower.id).count() + 1
    return f"{prefix}-{bed}-{count:03d}"


@router.get("", response_model=List[PlantDetailOut])
def list_plants(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
    flower_id: Optional[int] = None,
    health_status: Optional[str] = None,
    sort_by: Optional[str] = Query(default="created_at"),
):
    q = db.query(Plant).options(joinedload(Plant.flower))
    if flower_id:
        q = q.filter(Plant.flower_id == flower_id)
    if health_status:
        q = q.filter(Plant.health_status == health_status)
    if search:
        like = f"%{search}%"
        q = q.filter((Plant.plant_code.ilike(like)) | (Plant.location.ilike(like)) | (Plant.variety.ilike(like)))
    if sort_by == "moisture":
        q = q.order_by(Plant.soil_moisture.asc())
    elif sort_by == "location":
        q = q.order_by(Plant.location.asc())
    else:
        q = q.order_by(Plant.created_at.desc())
    return q.all()


@router.get("/{plant_id}", response_model=PlantDetailOut)
def get_plant(plant_id: int, db: Session = Depends(get_db)):
    plant = db.query(Plant).options(joinedload(Plant.flower)).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    return plant


@router.post("", response_model=PlantDetailOut)
def create_plant(payload: PlantCreate, db: Session = Depends(get_db)):
    flower = db.query(Flower).filter(Flower.id == payload.flower_id).first()
    if not flower:
        raise HTTPException(status_code=404, detail="Flower not found")
    data = payload.model_dump()
    code = data.pop("plant_code", None) or _generate_plant_code(db, flower, payload.location)
    if not data.get("planting_date"):
        data["planting_date"] = datetime.datetime.utcnow()
    plant = Plant(plant_code=code, **data)
    db.add(plant)
    db.commit()
    db.refresh(plant)
    return plant


@router.put("/{plant_id}", response_model=PlantDetailOut)
def update_plant(plant_id: int, payload: PlantUpdate, db: Session = Depends(get_db)):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(plant, field, value)
    db.commit()
    db.refresh(plant)

    if plant.soil_moisture < 30:
        db.add(Alert(plant_id=plant.id, category="irrigation", severity=AlertSeverity.WARNING,
                      message=f"{plant.plant_code} soil moisture is low ({plant.soil_moisture}%)."))
        db.commit()
    return plant


@router.delete("/{plant_id}")
def delete_plant(plant_id: int, db: Session = Depends(get_db)):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    db.delete(plant)
    db.commit()
    return {"ok": True}
