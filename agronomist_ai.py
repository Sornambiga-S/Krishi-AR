from typing import Optional

class AgronomistAIService:
    def answer_question(self, question: str, context_crop: Optional[str] = None) -> str:
        q = question.lower().strip()

        if "tamil nadu" in q or "district" in q or "50" in q:
            return (
                "KrishiAR catalogs **50 essential Tamil Nadu crops & plants** across four distinct botanical classes:\n"
                "- **Food & Field Crops (15):** Paddy (Cauvery Delta), Maize, Wheat, Kambu, Ragi, Cholam, Pulses, Groundnut, Cotton, Sugarcane, Sunflower, Sesame & Coconut.\n"
                "- **Vegetables (15):** Tomato, Potato (Nilgiris), Brinjal, Chilli, Small Onion (Perambalur), Okra, Drumstick, Gourds, Pumpkin, Cucumber, Tapioca (Salem), Sweet Potato & Cluster Beans.\n"
                "- **Fruits (10):** Mango, Banana, Lemon, Guava, Papaya, Custard Apple, Jackfruit, Sapota, Pomegranate & Amla.\n"
                "- **Flowers & Medicinal (10):** Neem, Rose, Jasmine (Madurai Malli), Hibiscus, Marigold, Tulsi, Aloe Vera, Curry Leaf, Coriander & Teak."
            )

        if "spot" in q or "circle" in q or "target" in q:
            return (
                "Circular brown spots with concentric target rings on potato or tomato foliage are characteristic symptoms of **Alternaria solani** (Early Blight). "
                "The fungal conidia penetrate stomata and secrete alternariol phytotoxins. Recommended TNAU intervention: foliar spray of Mancozeb (2 g/L) or Copper Oxychloride."
            )

        if "potato" in q or "urulai" in q:
            return (
                "Potato in Tamil Nadu is primarily cultivated in the temperate hill tracts of **The Nilgiris (Ooty)** and **Dindigul (Kodaikanal)**. "
                "The two major fungal threats are:\n"
                "1. **Early Blight (Alternaria solani):** Target-board concentric brown rings.\n"
                "2. **Late Blight (Phytophthora infestans):** Water-soaked black necrotic rot under cool humid conditions."
            )

        if "prevent" in q or "control" in q or "cure" in q:
            return (
                "Key cultural and biological management practices recommended by TNAU:\n"
                "1. **Drip Irrigation:** Water at root level to prevent canopy dampness.\n"
                "2. **Organic Mulching:** Coir pith or straw suppresses soil-splashed conidia.\n"
                "3. **Biological Seed Treatment:** Treat seeds with *Trichoderma viride* (4 g/kg) or *Pseudomonas fluorescens* before sowing.\n"
                "4. **Crop Rotation:** Rotate solanaceous crops with nitrogen-fixing pulses.\n"
                "5. **Sanitary Roguing:** Remove infected plants immediately to prevent vector spread."
            )

        if "spread" in q or "vector" in q:
            return (
                "Plant pathogens spread through four primary pathways:\n"
                "1. **Rain Splash:** Splashes soil conidia onto basal leaves.\n"
                "2. **Wind Spores:** Transports airborne conidia of Rice Blast and Maize Rust across kilometers.\n"
                "3. **Insect Vectors:** Whiteflies (*Bemisia tabaci*) transmit Yellow Vein Mosaic virus in okra and Cassava Mosaic in tapioca.\n"
                "4. **Infected Seed Setts:** Vegetatively propagated crops (sugarcane, potato) transmit systemic pathogens."
            )

        return (
            f"According to Tamil Nadu Agricultural University (TNAU) agronomic guidelines, plant health is governed by the "
            f"**Disease Triangle: Host + Pathogen + Favorable Environment**. You can inspect all 50 crops in the Crop Explorer "
            f"or screen any leaf image using the KrishiAR Camera Plant Identifier."
        )

agronomist_ai = AgronomistAIService()
