"""
Pydantic schemas for request/response validation.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


# ---------- Flower ----------
class FlowerBase(BaseModel):
    name: str
    emoji: str = "🌸"
    category: Optional[str] = None
    description: Optional[str] = None
    sunlight: Optional[str] = None
    watering: Optional[str] = None
    soil: Optional[str] = None
    maintenance: Optional[str] = None
    common_issues: Optional[str] = None
    care_tips: Optional[str] = None
    image_color: Optional[str] = "#e8f0e3"


class FlowerOut(FlowerBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---------- Plant ----------
class PlantBase(BaseModel):
    flower_id: int
    variety: Optional[str] = ""
    quantity: int = 1
    location: str
    planting_date: Optional[datetime] = None
    last_watered: Optional[datetime] = None
    soil_moisture: float = 50.0
    temperature: float = 28.0
    health_status: str = "Healthy"
    notes: Optional[str] = ""


class PlantCreate(PlantBase):
    plant_code: Optional[str] = None  # auto-generated if omitted


class PlantUpdate(BaseModel):
    variety: Optional[str] = None
    quantity: Optional[int] = None
    location: Optional[str] = None
    last_watered: Optional[datetime] = None
    soil_moisture: Optional[float] = None
    temperature: Optional[float] = None
    health_status: Optional[str] = None
    notes: Optional[str] = None


class PlantOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    plant_code: str
    flower_id: int
    variety: Optional[str]
    quantity: int
    location: str
    planting_date: datetime
    last_watered: Optional[datetime]
    soil_moisture: float
    temperature: float
    health_status: str
    notes: Optional[str]
    created_at: datetime


class PlantDetailOut(PlantOut):
    flower: FlowerOut


# ---------- Maintenance ----------
class MaintenanceBase(BaseModel):
    plant_id: int
    task_name: str
    due_date: datetime
    priority: str = "Medium"
    status: str = "Pending"
    notes: Optional[str] = ""


class MaintenanceCreate(MaintenanceBase):
    pass


class MaintenanceUpdate(BaseModel):
    task_name: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class MaintenanceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    plant_id: int
    task_name: str
    due_date: datetime
    priority: str
    status: str
    notes: Optional[str]
    created_at: datetime
    completed_at: Optional[datetime]


# ---------- Health ----------
class HealthObservationCreate(BaseModel):
    plant_id: int
    status: str
    symptoms: Optional[str] = ""
    observation_notes: Optional[str] = ""
    is_ai_demo: int = 0


class HealthObservationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    plant_id: int
    status: str
    symptoms: Optional[str]
    observation_notes: Optional[str]
    is_ai_demo: int
    created_at: datetime


# ---------- Irrigation ----------
class IrrigationCheckRequest(BaseModel):
    flower_id: Optional[int] = None
    soil_moisture: float
    temperature: float = 28.0
    hours_since_watered: Optional[float] = None
    rainfall_expected: bool = False


class IrrigationCheckResponse(BaseModel):
    moisture_percentage: float
    status: str  # Normal | Monitor | Irrigation Recommended
    recommendation: str
    reason: str


# ---------- Alerts ----------
class AlertOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    plant_id: Optional[int]
    category: str
    severity: str
    message: str
    is_read: int
    created_at: datetime


# ---------- Dashboard ----------
class DashboardStats(BaseModel):
    total_plants: int
    healthy_plants: int
    needs_attention: int
    irrigation_alerts: int
    maintenance_due: int
    pest_disease_alerts: int
    plants_by_flower: dict
    health_distribution: dict
    maintenance_status: dict
    irrigation_status: dict
