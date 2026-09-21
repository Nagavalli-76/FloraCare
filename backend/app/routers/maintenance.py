import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import MaintenanceTask, TaskStatus
from app.schemas.schemas import MaintenanceOut, MaintenanceCreate, MaintenanceUpdate

router = APIRouter(prefix="/api/maintenance", tags=["maintenance"])


@router.get("", response_model=List[MaintenanceOut])
def list_tasks(db: Session = Depends(get_db), status: Optional[str] = None, plant_id: Optional[int] = None):
    q = db.query(MaintenanceTask)
    if status:
        q = q.filter(MaintenanceTask.status == status)
    if plant_id:
        q = q.filter(MaintenanceTask.plant_id == plant_id)
    return q.order_by(MaintenanceTask.due_date.asc()).all()


@router.post("", response_model=MaintenanceOut)
def create_task(payload: MaintenanceCreate, db: Session = Depends(get_db)):
    task = MaintenanceTask(**payload.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.put("/{task_id}", response_model=MaintenanceOut)
def update_task(task_id: int, payload: MaintenanceUpdate, db: Session = Depends(get_db)):
    task = db.query(MaintenanceTask).filter(MaintenanceTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(task, field, value)
    if data.get("status") == TaskStatus.COMPLETED.value:
        task.completed_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(MaintenanceTask).filter(MaintenanceTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"ok": True}
