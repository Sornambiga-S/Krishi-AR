import json
from typing import List, Optional, Dict, Any
from app.config import PLANTS_JSON_PATH
from app.models.schemas import PlantDetail, DiseaseTimelineStage

class PlantService:
    def __init__(self):
        self._plants: List[Dict[str, Any]] = []
        self._by_id: Dict[str, Dict[str, Any]] = {}
        self._by_disease: Dict[str, Dict[str, Any]] = {}
        self._load_data()

    def _load_data(self):
        if PLANTS_JSON_PATH.exists():
            with open(PLANTS_JSON_PATH, "r", encoding="utf-8") as f:
                self._plants = json.load(f)
                for p in self._plants:
                    self._by_id[p["id"]] = p
                    if "diseaseKey" in p:
                        self._by_disease[p["diseaseKey"]] = p
        else:
            print(f"Warning: {PLANTS_JSON_PATH} not found.")

    def get_all_plants(self, category: Optional[str] = None, search: Optional[str] = None) -> List[Dict[str, Any]]:
        results = self._plants
        if category and category != "All":
            results = [p for p in results if p.get("category") == category]
        if search:
            term = search.lower()
            results = [
                p for p in results
                if term in p.get("name", "").lower()
                or term in p.get("scientificName", "").lower()
                or term in p.get("tamilName", "").lower()
                or any(term in r.lower() for r in p.get("majorTNRegions", []))
            ]
        return results

    def get_plant_by_id(self, plant_id: str) -> Optional[Dict[str, Any]]:
        # Check direct ID
        if plant_id in self._by_id:
            return self._by_id[plant_id]
        # Check diseaseKey
        if plant_id in self._by_disease:
            return self._by_disease[plant_id]
        # Check case-insensitive match
        for p in self._plants:
            if p["id"].lower() == plant_id.lower() or p["name"].lower() == plant_id.lower():
                return p
        return None

    def get_categories(self) -> Dict[str, int]:
        counts = {}
        for p in self._plants:
            cat = p.get("category", "Other")
            counts[cat] = counts.get(cat, 0) + 1
        return counts

    def generate_timeline(self, disease_name: str, pathogen: str) -> List[DiseaseTimelineStage]:
        stages = []
        for day in range(1, 16):
            pct = (day - 1) / 14.0
            chlorophyll = max(10, int(98 - pct * 86))
            damage = min(96, int(2 + pct * 94))
            if day <= 3:
                t = f"Day {day}: Spore Ingress"
                desc = f"Microscopic spores of {pathogen} enter leaf stomata. Chlorophyll remains high at {chlorophyll}%."
                path = "Conidia germination on leaf cuticle; penetration through natural apertures."
            elif day <= 6:
                t = f"Day {day}: Initial Chlorosis (Intervention Window)"
                desc = f"Chlorotic yellow halos appear around microscopic infection points. Optimal window for TNAU spray treatment."
                path = "Intercellular hyphae proliferate, releasing hydrolytic enzymes into mesophyll."
            elif day <= 10:
                t = f"Day {day}: Lesion Expansion & Necrosis"
                desc = f"Characteristic {disease_name} lesions expand across the leaf blade. Foliar damage reaches {damage}%."
                path = "Extensive cellular lysis; cell walls rupture and chloroplasts degenerate."
            else:
                t = f"Day {day}: Advanced Blighting & Canopy Collapse"
                desc = f"Necrotic areas coalesce, leading to severe leaf crisping, premature defoliation, and photosynthetic shutdown."
                path = "Abundant secondary sporulation ready for wind or splash dispersal across field."

            stages.append(DiseaseTimelineStage(
                day=day,
                title=t,
                description=desc,
                pathogenState=path,
                chlorophyllLevel=chlorophyll,
                damagePercent=damage
            ))
        return stages

plant_service = PlantService()
