import json
import os
from ..core.config import settings

class InterpretationService:
    def __init__(self):
        self.rules = {
            "palm": self._load_rules("palm_rules.json"),
            "face": self._load_rules("face_rules.json"),
            "love": self._load_rules("love_rules.json")
        }

    def _load_rules(self, filename: str) -> dict:
        path = os.path.join(settings.RULES_PATH, filename)
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[InterpretationService] Error loading {filename}: {e}")
            return {}

    def interpret_palm(self, features: dict) -> list:
        results = []
        rules = self.rules.get("palm", {}).get("lines", {})
        for feature, value in features.items():
            meaning = rules.get(feature, {}).get(value)
            if meaning:
                results.append(meaning)
        return results

    def interpret_face(self, attributes: dict) -> list:
        results = []
        rules = self.rules.get("face", {}).get("features", {})
        for attr, value in attributes.items():
            meaning = rules.get(attr, {}).get(value)
            if meaning:
                results.append(meaning)
        return results

    def interpret_love(self, signs: dict) -> list:
        """
        Calculates compatibility between two signs/profiles.
        """
        # Placeholder logic: in reality, this uses compatibility matrices
        sign1 = signs.get("user")
        sign2 = signs.get("partner")
        
        if not sign1 or not sign2:
            return ["ដើម្បីដឹងពីភាពត្រូវគ្នា សូមផ្តល់ព័ត៌មានរបស់អ្នកទាំងពីរ។"]
            
        return [f"ភាពត្រូវគ្នារវាង {sign1} និង {sign2} គឺខ្ពស់ណាស់! អ្នកទាំងពីរមានថាមពលស្របគ្នា។"]

interpretation_service = InterpretationService()
