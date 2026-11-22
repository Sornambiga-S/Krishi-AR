from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict
from app.services.plant_service import plant_service

router = APIRouter(prefix="/api/plants", tags=["Plants"])

@router.get("", summary="Get all 50 Tamil Nadu crops and plants")
def get_plants(
    category: Optional[str] = Query(None, description="Filter by category (Food and Field Crops, Vegetables, Fruits and Fruit Trees, Flowers, Medicinal and Other Plants)"),
    search: Optional[str] = Query(None, description="Search term for English, Tamil or scientific name")
):
    return plant_service.get_all_plants(category=category, search=search)

@router.get("/categories", summary="Get crop counts per botanical category")
def get_categories():
    return plant_service.get_categories()

@router.get("/{plant_id}", summary="Get detailed agronomic and cultivation info for a specific plant")
def get_plant_detail(plant_id: str):
    plant = plant_service.get_plant_by_id(plant_id)
    if not plant:
        raise HTTPException(status_code=404, detail=f"Plant '{plant_id}' not found in 50-crop catalog")
    return plant
