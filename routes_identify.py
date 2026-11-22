from fastapi import APIRouter
from app.models.schemas import IdentificationRequest, IdentificationResponse
from app.services.vision_ai import vision_ai_service

router = APIRouter(prefix="/api/identify", tags=["Identification"])

@router.post("", response_model=IdentificationResponse, summary="Identify plant from camera snapshot or image upload")
def identify_plant(req: IdentificationRequest):
    return vision_ai_service.classify_image(
        image_data_url=req.imageDataUrl,
        file_name=req.fileName,
        selected_plant_id=req.selectedPlantId,
        simulate_blurry=req.simulateBlurry or False,
        simulate_unsupported=req.simulateUnsupported or False
    )
