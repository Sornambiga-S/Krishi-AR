import json
import os
import sys

sys.path.append(r"C:\Users\sornambiga\.gemini\antigravity\scratch\krishi-ar")
from plants_dataset import PLANTS

TARGET_PATH = r"C:\Users\sornambiga\.gemini\antigravity\scratch\krishi-ar\src\data\mockData.ts"
TAIL_PATH = r"C:\Users\sornambiga\.gemini\antigravity\scratch\krishi-ar\tail_data.ts"

def generate_timeline(disease_name, pathogen):
    stages = []
    for day in range(1, 16):
        pct = (day - 1) / 14.0
        chlorophyll = max(10, int(98 - pct * 86))
        damage = min(96, int(2 + pct * 94))
        if day <= 3:
            t = f"Day {day}: Spore Ingress"
            desc = f"Microscopic spores of {pathogen} enter epidermal stomata. Chlorophyll remains high at {chlorophyll}%."
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

        stages.append({
            "day": day,
            "title": t,
            "description": desc,
            "pathogenState": path,
            "chlorophyllLevel": chlorophyll,
            "damagePercent": damage
        })
    return stages

def s(val):
    return json.dumps(val, ensure_ascii=False)

def build_mock_data():
    lines = []
    lines.append("import { CropInfo, DiseaseInfo, QuizQuestion, SampleLeaf, UserProgress, LabExperiment, UserProfile } from '../types';\n\n")

    # 1. SAMPLE_LEAVES (50 items)
    lines.append("export const SAMPLE_LEAVES: SampleLeaf[] = [\n")
    for p in PLANTS:
        lines.append("  {\n")
        lines.append(f"    id: {s(p['diseaseKey'])},\n")
        lines.append(f"    title: {s(p['name'] + ' Leaf')},\n")
        lines.append(f"    crop: {s(p['name'] + ' (' + p['scientificName'] + ')')},\n")
        lines.append(f"    tamilCropName: {s(p['tamilName'])},\n")
        lines.append(f"    disease: {s(p['diseaseName'])},\n")
        lines.append(f"    tamilDisease: {s(p['tamilDisease'])},\n")
        lines.append(f"    category: {s(p['category'])},\n")
        lines.append(f"    confidence: {p['confidence']},\n")
        lines.append(f"    imageThumbnail: {s(p['icon'])},\n")
        lines.append(f"    description: {s(p['symptoms'][0])},\n")
        lines.append(f"    majorTNRegions: {json.dumps(p['majorTNRegions'], ensure_ascii=False)}\n")
        lines.append("  },\n")
    lines.append("];\n\n")

    # 2. DISEASE_DATABASE (50 items)
    lines.append("export const DISEASE_DATABASE: Record<string, DiseaseInfo> = {\n")
    for p in PLANTS:
        tl = generate_timeline(p["diseaseName"], p["scientificDisease"])
        lines.append(f"  {s(p['diseaseKey'])}: {{\n")
        lines.append(f"    id: {s(p['diseaseKey'])},\n")
        lines.append(f"    name: {s(p['diseaseName'])},\n")
        lines.append(f"    scientificName: {s(p['scientificDisease'])},\n")
        lines.append(f"    cropName: {s(p['name'])},\n")
        lines.append(f"    cropScientificName: {s(p['scientificName'])},\n")
        lines.append(f"    tamilName: {s(p['tamilDisease'])},\n")
        lines.append(f"    tamilCropName: {s(p['tamilName'])},\n")
        lines.append(f"    confidence: {p['confidence']},\n")
        lines.append(f"    healthStatus: {s(p['healthStatus'])},\n")
        lines.append(f"    severity: {s(p['severity'])},\n")
        lines.append(f"    symptoms: {json.dumps(p['symptoms'], ensure_ascii=False)},\n")
        lines.append(f"    cause: {s(p['cause'])},\n")
        lines.append(f"    plantImpact: {s('Disrupts cellular metabolism, weakens foliar canopy, and impacts yield if unmitigated.')},\n")
        lines.append(f"    prevention: {json.dumps(p['prevention'], ensure_ascii=False)},\n")
        lines.append(f"    majorTNRegions: {json.dumps(p['majorTNRegions'], ensure_ascii=False)},\n")
        lines.append(f"    timelineDays: {json.dumps(tl, ensure_ascii=False, indent=6)}\n")
        lines.append("  },\n")
    lines.append("};\n\n")

    # 3. CROPS_DATABASE (50 items)
    lines.append("export const CROPS_DATABASE: CropInfo[] = [\n")
    for p in PLANTS:
        lines.append("  {\n")
        lines.append(f"    id: {s(p['id'])},\n")
        lines.append(f"    name: {s(p['name'])},\n")
        lines.append(f"    scientificName: {s(p['scientificName'])},\n")
        lines.append(f"    tamilName: {s(p['tamilName'])},\n")
        lines.append(f"    category: {s(p['category'])},\n")
        lines.append(f"    icon: {s(p['icon'])},\n")
        lines.append(f"    growthPeriod: {s(p['growthPeriod'])},\n")
        lines.append(f"    optimalTemperature: {s(p['optimalTemperature'])},\n")
        lines.append(f"    waterNeed: {s(p['waterNeed'])},\n")
        lines.append(f"    soilType: {s(p['soilType'])},\n")
        lines.append(f"    sunlight: {s(p['sunlight'])},\n")
        lines.append(f"    majorTNRegions: {json.dumps(p['majorTNRegions'], ensure_ascii=False)},\n")
        lines.append(f"    stages: {json.dumps(p['stages'], ensure_ascii=False, indent=6)},\n")
        lines.append(f"    commonDiseases: {json.dumps(p['commonDiseases'], ensure_ascii=False)},\n")
        lines.append(f"    funFact: {s(p['funFact'])},\n")
        lines.append(f"    harvestYield: {s(p['harvestYield'])},\n")
        lines.append(f"    basicPractices: {json.dumps(p['basicPractices'], ensure_ascii=False)}\n")
        lines.append("  },\n")
    lines.append("];\n\n")

    # 4. Retain LAB_EXPERIMENTS, QUIZ_QUESTIONS, DEMO_USER_PROFILES, INITIAL_USER_PROGRESS from tail
    with open(TAIL_PATH, "r", encoding="utf-8") as f:
        tail = f.read()
    lines.append(tail)

    full_content = "".join(lines)
    with open(TARGET_PATH, "w", encoding="utf-8") as f:
        f.write(full_content)

    print(f"Successfully generated 50 plants database in {TARGET_PATH}")

if __name__ == "__main__":
    build_mock_data()
