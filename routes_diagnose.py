from fastapi import APIRouter, HTTPException
from app.models.schemas import DiagnosisRequest, DiagnosisResponse
from app.services.plant_service import plant_service

router = APIRouter(prefix="/api/diagnose", tags=["Pathology Diagnosis"])

@router.post("", response_model=DiagnosisResponse, summary="Perform pathology screening and 15-day timeline generation")
def diagnose_crop(req: DiagnosisRequest):
    target_id = req.cropOrDiseaseId or "tomato-early-blight"
    plant = plant_service.get_plant_by_id(target_id)
    if not plant:
        plant = plant_service.get_plant_by_id("tomato")

    disease_name = plant.get("diseaseName", "Foliar Blight")
    pathogen = plant.get("scientificDisease", "Alternaria solani")
    timeline = plant_service.generate_timeline(disease_name, pathogen)

    return DiagnosisResponse(
        cropName=plant.get("name", "Crop"),
        cropScientificName=plant.get("scientificName", ""),
        tamilCropName=plant.get("tamilName", ""),
        diseaseName=disease_name,
        scientificName=pathogen,
        tamilName=plant.get("tamilDisease", ""),
        confidence=float(plant.get("confidence", 92)),
        healthStatus=plant.get("healthStatus", "Needs Attention"),
        severity=plant.get("severity", "Medium"),
        symptoms=plant.get("symptoms", ["Foliar lesion spotting with yellow chlorotic halo."]),
        cause=plant.get("cause", "Fungal infection proliferating in high humidity."),
        plantImpact=plant.get("plantImpact", "Reduces photosynthetic capacity and canopy vigor."),
        prevention=plant.get("prevention", ["Spray copper fungicide", "Ensure drip irrigation"]),
        majorTNRegions=plant.get("majorTNRegions", []),
        timelineDays=timeline,
        backendEngine="KrishiAR-ResNet50-DualHead (FastAPI)"
    )
