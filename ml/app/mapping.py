

MIXED = 307                # PetFinder's "Mixed Breed" id (confirm in breed_labels.csv)
DEFAULT_STATE = 41326      # a state code seen in training; the app has no equivalent field
FEE_TO_MYR = 1.0           # PetFinder fees are in Malaysian ringgit; set a factor if your currency differs

COLORS = {"black": 1, "brown": 2, "golden": 3, "yellow": 4, "cream": 5, "gray": 6, "grey": 6, "white": 7}
SIZE = {"small": 1, "medium": 2, "large": 3}
FUR = {"short": 1, "medium": 2, "long": 3}
HEALTH = {"healthy": 1, "minor_injury": 2, "serious_injury": 3}


def yn(flag):
    return 1 if flag else 2          # PetFinder: 1 = yes, 2 = no


def color_codes(text):
    t = (text or "").lower()
    codes = []
    for word, code in COLORS.items():
        if word in t and code not in codes:
            codes.append(code)
    codes = codes or [2]             # unknown colour text -> brown
    return (codes + [0, 0, 0])[:3]


def to_petfinder(a: dict) -> dict:
    species = a.get("species", "dog")
    c1, c2, c3 = color_codes(a.get("color"))
    photos = a.get("photos") or []
    return {
        "Type": 1 if species == "dog" else 2,
        "Age": int(a.get("ageMonths") or 0),
        "Breed1": MIXED,
        "Breed2": 0,
        "Gender": 1 if a.get("gender") == "male" else 2,
        "Color1": c1, "Color2": c2, "Color3": c3,
        "MaturitySize": SIZE.get(a.get("size"), 2),
        "FurLength": FUR.get(a.get("coatLength"), 1),
        "Vaccinated": yn(a.get("vaccinated")),
        "Dewormed": yn(a.get("dewormed")),
        "Sterilized": yn(a.get("sterilized")),
        "Health": HEALTH.get(a.get("healthCondition"), 1),
        "Quantity": 1,
        "Fee": float(a.get("adoptionFee") or 0) * FEE_TO_MYR,
        "State": DEFAULT_STATE,
        "VideoAmt": 0,
        "PhotoAmt": len(photos),
        "Name": a.get("name"),
        "Description": a.get("description") or "",
    }