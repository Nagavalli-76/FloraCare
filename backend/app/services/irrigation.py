"""
Smart Irrigation Recommendation Engine.

This is intentionally a simple, transparent, rule-based decision-support
tool -- NOT a scientific irrigation model. It is designed so a student can
explain the exact logic during a college viva. It does not replace the
judgement of an agricultural expert.

Rules (in priority order):
1. Soil moisture < 30%                         -> Irrigation Recommended
2. Soil moisture < 45% AND watered > 24h ago    -> Irrigation Recommended
3. Soil moisture < 45% (but watered recently)   -> Monitor
4. High temperature (>= 36C) AND moisture < 55% -> Monitor (heat stress risk)
5. Rainfall expected AND moisture >= 30%        -> Normal (skip irrigation)
6. Otherwise                                    -> Normal
"""
from app.schemas.schemas import IrrigationCheckRequest, IrrigationCheckResponse


def evaluate_irrigation(req: IrrigationCheckRequest) -> IrrigationCheckResponse:
    moisture = req.soil_moisture
    hours = req.hours_since_watered

    if req.rainfall_expected and moisture >= 30:
        return IrrigationCheckResponse(
            moisture_percentage=moisture,
            status="Normal",
            recommendation="No Immediate Irrigation Required",
            reason="Rainfall is expected and current moisture is adequate, so irrigation can be skipped for now.",
        )

    if moisture < 30:
        return IrrigationCheckResponse(
            moisture_percentage=moisture,
            status="Irrigation Recommended",
            recommendation="Irrigate soon",
            reason=f"Soil moisture ({moisture}%) is below the 30% low-moisture threshold.",
        )

    if moisture < 45:
        if hours is not None and hours > 24:
            return IrrigationCheckResponse(
                moisture_percentage=moisture,
                status="Irrigation Recommended",
                recommendation="Irrigate soon",
                reason=f"Moisture is below 45% ({moisture}%) and it has been over 24 hours since last watering.",
            )
        return IrrigationCheckResponse(
            moisture_percentage=moisture,
            status="Monitor",
            recommendation="Check again in a few hours",
            reason=f"Moisture is on the lower side ({moisture}%) but the plant was watered recently.",
        )

    if req.temperature >= 36 and moisture < 55:
        return IrrigationCheckResponse(
            moisture_percentage=moisture,
            status="Monitor",
            recommendation="Watch for heat stress",
            reason=f"High temperature ({req.temperature}°C) combined with moderate moisture ({moisture}%) may increase water loss.",
        )

    return IrrigationCheckResponse(
        moisture_percentage=moisture,
        status="Normal",
        recommendation="No Immediate Irrigation Required",
        reason=f"Soil moisture ({moisture}%) is adequate under current conditions.",
    )
