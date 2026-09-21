"""
SQLAlchemy ORM models for FloraCare.

Tables:
- Flower: the care-guide encyclopedia entries (Rose, Jasmine, Marigold, Ornamental)
- Plant: an individual nursery plant/batch record
- MaintenanceTask: a scheduled task tied to a plant/batch
- HealthObservation: a logged health check / AI-demo analysis result for a plant
- Alert: a system-generated notice (irrigation, maintenance, health)
"""
import enum
import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Text, DateTime, ForeignKey, Enum
)
from sqlalchemy.orm import relationship
from app.database import Base


class HealthStatus(str, enum.Enum):
    HEALTHY = "Healthy"
    NEEDS_ATTENTION = "Needs Attention"
    PEST_SUSPECTED = "Pest Suspected"
    DISEASE_SUSPECTED = "Disease Suspected"
    NUTRIENT_ISSUE_SUSPECTED = "Nutrient Issue Suspected"


class TaskStatus(str, enum.Enum):
    PENDING = "Pending"
    COMPLETED = "Completed"


class TaskPriority(str, enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class AlertSeverity(str, enum.Enum):
    INFO = "INFO"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"


class Flower(Base):
    __tablename__ = "flowers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    emoji = Column(String(10), default="🌸")
    category = Column(String(100))
    description = Column(Text)
    sunlight = Column(Text)
    watering = Column(Text)
    soil = Column(Text)
    maintenance = Column(Text)
    common_issues = Column(Text)  # newline-separated
    care_tips = Column(Text)      # newline-separated
    image_color = Column(String(20), default="#e8f0e3")  # placeholder swatch for card art

    plants = relationship("Plant", back_populates="flower")


class Plant(Base):
    __tablename__ = "plants"

    id = Column(Integer, primary_key=True, index=True)
    plant_code = Column(String(50), unique=True, index=True)  # e.g. ROSE-A1-001
    flower_id = Column(Integer, ForeignKey("flowers.id"))
    variety = Column(String(100))
    quantity = Column(Integer, default=1)
    location = Column(String(100))  # nursery bed/location
    planting_date = Column(DateTime, default=datetime.datetime.utcnow)
    last_watered = Column(DateTime, nullable=True)
    soil_moisture = Column(Float, default=50.0)  # percentage, demo/manual input
    temperature = Column(Float, default=28.0)
    health_status = Column(Enum(HealthStatus), default=HealthStatus.HEALTHY)
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    flower = relationship("Flower", back_populates="plants")
    maintenance_tasks = relationship("MaintenanceTask", back_populates="plant", cascade="all, delete-orphan")
    health_observations = relationship("HealthObservation", back_populates="plant", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="plant", cascade="all, delete-orphan")


class MaintenanceTask(Base):
    __tablename__ = "maintenance_tasks"

    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"))
    task_name = Column(String(100))
    due_date = Column(DateTime)
    priority = Column(Enum(TaskPriority), default=TaskPriority.MEDIUM)
    status = Column(Enum(TaskStatus), default=TaskStatus.PENDING)
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    plant = relationship("Plant", back_populates="maintenance_tasks")


class HealthObservation(Base):
    __tablename__ = "health_observations"

    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"))
    status = Column(Enum(HealthStatus))
    symptoms = Column(Text, default="")
    observation_notes = Column(Text, default="")
    is_ai_demo = Column(Integer, default=0)  # 1 if generated via "AI Analysis Demo"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    plant = relationship("Plant", back_populates="health_observations")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=True)
    category = Column(String(50))  # irrigation | maintenance | health | pest
    severity = Column(Enum(AlertSeverity), default=AlertSeverity.INFO)
    message = Column(Text)
    is_read = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    plant = relationship("Plant", back_populates="alerts")
