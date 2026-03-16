import json
import os
from ..core.config import settings

class InterpretationService:
    def __init__(self):
        self.palm_rules = self._load_rules("palm_rules.json")
        self.face_rules = self._load_rules("face_rules.json")

    def _load_rules(self, filename: str) -> dict:
        path = os.path.join(settings.RULES_PATH, filename)
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[InterpretationService] Error loading {filename}: {e}")
            return {}

    def interpret_palm(self, features: dict) -> list:
        """
        Maps extracted palm features to lifestyle meanings.
        """
        results = []
        for feature, value in features.items():
            meaning = self.palm_rules.get("lines", {}).get(feature, {}).get(value)
            if meaning:
                results.append(meaning)
        return results

    def interpret_face(self, attributes: dict) -> list:
        """
        Maps extracted face attributes to lifestyle meanings.
        """
        results = []
        for attr, value in attributes.items():
            meaning = self.face_rules.get("features", {}).get(attr, {}).get(value)
            if meaning:
                results.append(meaning)
        return results

interpretation_service = InterpretationService()
