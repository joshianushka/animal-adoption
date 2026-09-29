LEVELS3 = ["low", "medium", "high"]
EXP = ["first_time", "some", "experienced"]

WEIGHTS = {
    "energy": 0.18, "housing": 0.14, "experience": 0.12, "alone_time": 0.12,
    "species": 0.10, "special_needs": 0.08, "size": 0.06, "age": 0.06,
    "allergy": 0.06, "budget": 0.08,
}

def age_group(months):
    return "young" if months < 12 else "adult" if months < 96 else "senior"

def _f(score, good, bad=None):
    return {"score": score, "reason": good if score >= 0.7 else (bad or good)}

def hard_blocks(a, an):
    blocks = []
    if a["hasChildren"] and not an.get("goodWithKids"):
        blocks.append("Not confirmed safe with children")
    if a["hasDogs"] and an["species"] == "dog" and not an.get("goodWithDogs"):
        blocks.append("Not confirmed good with other dogs")
    if a["hasCats"] and not an.get("goodWithCats"):
        blocks.append("Not confirmed good with cats")
    return blocks

def factors(a, an):
    out = {}
    # energy
    d = abs(LEVELS3.index(a["activityLevel"]) - LEVELS3.index(an.get("energyLevel", "medium")))
    out["energy"] = _f(1 - d / 2, "Energy level fits your lifestyle",
                       f"Energy level ({an.get('energyLevel')}) differs from your activity level")
    # housing
    s = 1.0
    if an["size"] == "large" and a["housingType"] == "apartment": s = 0.3
    if an.get("needsYard") and a["housingType"] != "house_with_yard": s = min(s, 0.2)
    out["housing"] = _f(s, "Suits your home", "May need more space than your home offers")
    # experience
    gap = EXP.index(an.get("experienceRequired", "first_time")) - EXP.index(a["experienceLevel"])
    out["experience"] = _f(1.0 if gap <= 0 else 0.4 if gap == 1 else 0.1,
                           "Matches your pet experience", "Needs a more experienced owner")
    # time alone
    over = a["hoursAloneDaily"] - an.get("maxHoursAlone", 6)
    out["alone_time"] = _f(1.0 if over <= 0 else max(0.0, 1 - over / 4),
                           "Comfortable with the time you're away",
                           "Would be alone longer than is ideal")
    # preferences
    out["species"] = _f(1.0 if an["species"] in a["preferredSpecies"] or not a["preferredSpecies"] else 0.0,
                        f"Matches your preference for {an['species']}s", "Not your preferred species")
    out["size"] = _f(1.0 if an["size"] in a["preferredSizes"] or not a["preferredSizes"] else 0.4,
                     "Preferred size", "Different size from your preference")
    out["age"] = _f(1.0 if age_group(an["ageMonths"]) in a["preferredAgeGroups"] or not a["preferredAgeGroups"] else 0.5,
                    "In your preferred age range", "Outside your preferred age range")
    # allergies (no pet is truly hypoallergenic, so keep this soft)
    coat = {"short": 0.8, "medium": 0.5, "long": 0.3}.get(an.get("coatLength"), 0.5)
    out["allergy"] = _f(coat if a["hasAllergies"] else 1.0, "Shorter coat may suit allergies",
                        "Longer coat may be harder with allergies")
    out["budget"] = _f(1.0 if an.get("adoptionFee", 0) <= a["maxAdoptionFee"] else 0.0,
                       "Within your budget", "Adoption fee is above your budget")
    out["special_needs"] = _f(0.0 if an.get("specialNeeds") and not a["openToSpecialNeeds"] else 1.0,
                              "No special-needs mismatch", "Has special needs you're not set up for")
    return out

def score_match(a, an):
    blocks = hard_blocks(a, an)
    f = factors(a, an)
    total = sum(WEIGHTS[k] * v["score"] for k, v in f.items()) / sum(WEIGHTS.values())
    ranked = sorted(f.items(), key=lambda kv: kv[1]["score"] * WEIGHTS[kv[0]], reverse=True)
    return {
        "animalId": an.get("_id"),
        "score": round(100 * total, 1),
        "blocked": bool(blocks),
        "block_reasons": blocks,
        "why": [v["reason"] for k, v in ranked if v["score"] >= 0.7][:3],
        "concerns": [v["reason"] for k, v in f.items() if v["score"] < 0.6],
    }