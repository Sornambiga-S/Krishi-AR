from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class GrowingConditions(BaseModel):
    optimalTemperature: str
    soilType: str
    waterNeed: str
    sunlight: str
    growthPeriod: str

class CultivationInfo(BaseModel):
    majorTNRegions: List[str] = []
    harvestYield: str
    funFact: str
    basicPractices: List[str] = []

class GrowthStage(BaseModel):
    stage: str
    duration: str
    description: str

class PlantDetail(BaseModel):
    id: str
    name: str
    tamilName: Optional[str] = None
    scientificName: str
    category: str
    icon: str
    growthPeriod: str
    optimalTemperature: str
    waterNeed: str
    soilType: str
    sunlight: str
    majorTNRegions: List[str] = []
    stages: List[GrowthStage] = []
    commonDiseases: List[str] = []
    funFact: str
    harvestYield: str
    basicPractices: List[str] = []
    diseaseKey: Optional[str] = None
    diseaseName: Optional[str] = None
    tamilDisease: Optional[str] = None

class IdentificationRequest(BaseModel):
    imageDataUrl: Optional[str] = Field(None, description="Base64 encoded JPEG/PNG image data URL")
    fileName: Optional[str] = Field(None, description="Filename of uploaded image")
    selectedPlantId: Optional[str] = Field(None, description="Optional preset crop ID")
    simulateBlurry: Optional[bool] = Field(False, description="Flag to simulate low confidence threshold test")
    simulateUnsupported: Optional[bool] = Field(False, description="Flag to simulate unsupported specimen test")

class IdentificationResponse(BaseModel):
    plantId: str
    plantName: str
    scientificName: str
    tamilName: str
    category: str
    confidence: float
    status: str  # 'identified' | 'low_confidence' | 'unsupported'
    statusMessage: str
    capturedImage: Optional[str] = None
    suitableConditions: GrowingConditions
    cultivationInfo: CultivationInfo
    backendEngine: str = "KrishiAR-VisionCore (FastAPI + Vision Transformer)"

class DiseaseTimelineStage(BaseModel):
    day: int
    title: str
    description: str
    pathogenState: str
    chlorophyllLevel: int
    damagePercent: int

class DiagnosisRequest(BaseModel):
    cropOrDiseaseId: Optional[str] = "tomato-early-blight"
    imageDataUrl: Optional[str] = None
    fileName: Optional[str] = None

class DiagnosisResponse(BaseModel):
    cropName: str
    cropScientificName: str
    tamilCropName: Optional[str] = None
    diseaseName: str
    scientificName: str
    tamilName: Optional[str] = None
    confidence: float
    healthStatus: str
    severity: str
    symptoms: List[str] = []
    cause: str
    plantImpact: str
    prevention: List[str] = []
    majorTNRegions: List[str] = []
    timelineDays: List[DiseaseTimelineStage] = []
    backendEngine: str = "KrishiAR-ResNet50-Pathology"

class ChatRequest(BaseModel):
    question: str
    contextCrop: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    source: str = "TNAU Agronomic Advisory Knowledge Graph"
