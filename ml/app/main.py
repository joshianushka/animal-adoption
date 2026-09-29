import joblib, numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from .features import build_features
from typing import List
from .matching import score_match

art = joblib.load("artifacts/adoption_speed.pkl")
app = FastAPI()

class AnimalIn(BaseModel):
    Type: int; Age: int; Breed1: int; Breed2: int = 0; Gender: int
    Color1: int; Color2: int = 0; Color3: int = 0; MaturitySize: int; FurLength: int
    Vaccinated: int; Dewormed: int; Sterilized: int; Health: int
    Quantity: int = 1; Fee: float = 0; State: int
    VideoAmt: int = 0; PhotoAmt: int = 0
    Name: Optional[str] = None; Description: Optional[str] = ""

@app.post("/predict/adoption-speed")
def predict(a: AnimalIn):
    X = build_features(a.model_dump(), art)
    score = float(np.mean([m.predict(X)[0] for m in art["lgb_models"]]))
    label = int(np.digitize(score, sorted(art["thresholds"])))
    return {"score": score, "adoption_speed": label}

class RankIn(BaseModel):
    adopter: dict
    animals: List[dict]

@app.post("/match/rank")
def rank(req: RankIn):
    results = [score_match(req.adopter, an) for an in req.animals]
    results.sort(key=lambda r: (r["blocked"], -r["score"]))   # unblocked first, best score first
    return results