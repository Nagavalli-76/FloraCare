from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import Flower
from app.schemas.schemas import FlowerOut

router = APIRouter(prefix="/api/flowers", tags=["flowers"])


@router.get("", response_model=List[FlowerOut])
def list_flowers(db: Session = Depends(get_db)):
    return db.query(Flower).all()


@router.get("/{flower_id}", response_model=FlowerOut)
def get_flower(flower_id: int, db: Session = Depends(get_db)):
    flower = db.query(Flower).filter(Flower.id == flower_id).first()
    if not flower:
        raise HTTPException(status_code=404, detail="Flower not found")
    return flower
