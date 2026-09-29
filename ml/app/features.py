import numpy as np, pandas as pd

def build_features(p: dict, art: dict) -> pd.DataFrame:
    desc = p.get("Description") or ""
    row = {
        "Type": p["Type"], "Age": p["Age"], "Breed1": p["Breed1"], "Breed2": p.get("Breed2", 0),
        "Gender": p["Gender"], "Color1": p["Color1"], "Color2": p.get("Color2", 0),
        "Color3": p.get("Color3", 0), "MaturitySize": p["MaturitySize"],
        "FurLength": p["FurLength"], "Vaccinated": p["Vaccinated"], "Dewormed": p["Dewormed"],
        "Sterilized": p["Sterilized"], "Health": p["Health"], "Quantity": p.get("Quantity", 1),
        "Fee": p.get("Fee", 0), "State": p["State"], "VideoAmt": p.get("VideoAmt", 0),
        "PhotoAmt": p.get("PhotoAmt", 0),
    }
    # same engineered features as in the notebook
    row["desc_len"] = len(desc)
    row["desc_words"] = len(desc.split())
    row["has_name"] = int(bool(p.get("Name")))
    row["is_mixed"] = int(row["Breed2"] > 0)
    row["age_years"] = row["Age"] / 12
    row["has_fee"] = int(row["Fee"] > 0)
    row["photo_per_pet"] = row["PhotoAmt"] / max(row["Quantity"], 1)
    row["breed1_freq"] = art["breed1_freq"].get(row["Breed1"], 0.0)
    row["state_freq"] = art["state_freq"].get(row["State"], 0.0)

    txt = art["svd"].transform(art["tfidf"].transform([desc]))[0]
    for i, v in enumerate(txt):
        row[f"txt_{i}"] = v

    X = pd.DataFrame([row])[art["feature_columns"]]          # same column order
    for c in art["categorical_features"]:
        X[c] = pd.Categorical(X[c], categories=art["category_levels"][c])
    return X