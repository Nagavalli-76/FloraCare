from fastapi import APIRouter
from app.schemas.schemas import IrrigationCheckRequest, IrrigationCheckResponse
from app.services.irrigation import evaluate_irrigation

router = APIRouter(prefix="/api/irrigation", tags=["irrigation"])


@router.post("/check", response_model=IrrigationCheckResponse)
def check_irrigation(payload: IrrigationCheckRequest):
    return evaluate_irrigation(payload)
