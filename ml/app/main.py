from pathlib import Path
from typing import List, Optional

import joblib
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel

from .features import build_features
from .mapping import to_petfinder
from .matching import score_match

# load the model relative to this file, so it works no matter where uvicorn is started
BASE_DIR = Path(__file__).resolve().parent.parent
art = joblib.load(BASE_DIR / "artifacts" / "adoption_speed.pkl")

app = FastAPI(title="Pet Adoption ML Service")

LABELS = {
    0: "Same day",
    1: "Within a week",
    2: "Within a month",
    3: "1 to 3 months",
    4: "Over 100 days (at risk of waiting)",
}


def predict_score(petfinder_row: dict):
    X = build_features(petfinder_row, art)
    score = float(np.mean([m.predict(X)[0] for m in art["lgb_models"]]))
    label = int(np.digitize(score, sorted(art["thresholds"])))
    return score, label


def listing_tips(p: dict):
    # simple rules of thumb, not explanations pulled from the model
    tips = []
    if p["PhotoAmt"] < 3:
        tips.append("Add more photos (3 or more)")
    if len(p["Description"]) < 150:
        tips.append("Write a longer, more personal description")
    if not p["Name"]:
        tips.append("Give the animal a name")
    if p["Vaccinated"] == 2:
        tips.append("Vaccination status can build adopter confidence")
    return tips


@app.get("/health")
def health():
    return {"status": "ok"}


# ---------- adoption speed: raw PetFinder-coded input (used for testing in /docs) ----------
class AnimalIn(BaseModel):
    Type: int
    Age: int
    Breed1: int
    Breed2: int = 0
    Gender: int
    Color1: int
    Color2: int = 0
    Color3: int = 0
    MaturitySize: int
    FurLength: int
    Vaccinated: int
    Dewormed: int
    Sterilized: int
    Health: int
    Quantity: int = 1
    Fee: float = 0
    State: int
    VideoAmt: int = 0
    PhotoAmt: int = 0
    Name: Optional[str] = None
    Description: Optional[str] = ""


@app.post("/predict/adoption-speed")
def predict(a: AnimalIn):
    score, label = predict_score(a.model_dump())
    return {"score": score, "adoption_speed": label}


# ---------- adoption speed: input in the app's own Animal format (used by Express) ----------
@app.post("/predict/adoption-speed/from-app")
def predict_from_app(animal: dict):
    p = to_petfinder(animal)
    score, label = predict_score(p)
    return {
        "score": round(score, 3),
        "adoption_speed": label,
        "label": LABELS[label],
        "tips": listing_tips(p),
    }


# ---------- adopter <-> animal matching ----------
class RankIn(BaseModel):
    adopter: dict
    animals: List[dict]


@app.post("/match/rank")
def rank(req: RankIn):
    results = [score_match(req.adopter, an) for an in req.animals]
    results.sort(key=lambda r: (r["blocked"], -r["score"]))   # unblocked first, best score first
    return results