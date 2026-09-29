import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/animals";
const SHELTER_ID = "65f000000000000000000002"; // dev only, replace with the logged-in shelter later

const empty = {
  name: "", species: "dog", breed: "", isMixedBreed: false,
  ageMonths: 12, gender: "male", size: "medium", color: "",
  coatLength: "short", energyLevel: "medium", temperament: "",
  goodWithKids: false, goodWithDogs: false, goodWithCats: false,
  needsYard: false, specialNeeds: false, experienceRequired: "first_time", maxHoursAlone: 6,
  vaccinated: false, dewormed: false, sterilized: false, healthCondition: "healthy", healthNotes: "",
  adoptionFee: 0, description: "", photos: "",
};

const row = { display: "block", marginBottom: 12 };

function Field({ label, children }) {
  return (
    <label style={row}>
      <div>{label}</div>
      {children}
    </label>
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label style={{ display: "block", marginBottom: 6 }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /> {label}
    </label>
  );
}

export default function AddAnimal() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState("");
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const text = (key) => ({ value: form[key], onChange: (e) => set(key)(e.target.value) });
  const num = (key) => ({ value: form[key], onChange: (e) => set(key)(Number(e.target.value)) });

  const opts = (list) => list.map(([v, t]) => <option key={v} value={v}>{t}</option>);

  const submit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    const payload = {
      ...form,
      shelter: SHELTER_ID,
      temperament: form.temperament.split(",").map((s) => s.trim()).filter(Boolean),
      photos: form.photos.split(",").map((s) => s.trim()).filter(Boolean),
    };
    try {
      await axios.post(API, payload);
      setStatus(`${form.name} added!`);
      setForm(empty);
    } catch (err) {
      setStatus(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Add an animal</h2>

      <h3>Basics</h3>
      <Field label="Name"><input required {...text("name")} /></Field>
      <Field label="Species">
        <select {...text("species")}>{opts([["dog", "Dog"], ["cat", "Cat"]])}</select>
      </Field>
      <Field label="Breed"><input {...text("breed")} /></Field>
      <Check label="Mixed breed" checked={form.isMixedBreed} onChange={set("isMixedBreed")} />
      <Field label="Age (months)"><input type="number" min="0" required {...num("ageMonths")} /></Field>
      <Field label="Gender">
        <select {...text("gender")}>{opts([["male", "Male"], ["female", "Female"]])}</select>
      </Field>
      <Field label="Size">
        <select {...text("size")}>{opts([["small", "Small"], ["medium", "Medium"], ["large", "Large"]])}</select>
      </Field>
      <Field label="Color"><input {...text("color")} /></Field>
      <Field label="Coat length">
        <select {...text("coatLength")}>{opts([["short", "Short"], ["medium", "Medium"], ["long", "Long"]])}</select>
      </Field>

      <h3>Personality & needs</h3>
      <Field label="Energy level">
        <select {...text("energyLevel")}>{opts([["low", "Low"], ["medium", "Medium"], ["high", "High"]])}</select>
      </Field>
      <Field label="Temperament (comma separated, e.g. calm, friendly)"><input {...text("temperament")} /></Field>
      <Check label="Good with children" checked={form.goodWithKids} onChange={set("goodWithKids")} />
      <Check label="Good with dogs" checked={form.goodWithDogs} onChange={set("goodWithDogs")} />
      <Check label="Good with cats" checked={form.goodWithCats} onChange={set("goodWithCats")} />
      <Check label="Needs a yard" checked={form.needsYard} onChange={set("needsYard")} />
      <Check label="Has special needs" checked={form.specialNeeds} onChange={set("specialNeeds")} />
      <Field label="Owner experience required">
        <select {...text("experienceRequired")}>
          {opts([["first_time", "Any owner"], ["some", "Some experience"], ["experienced", "Experienced only"]])}
        </select>
      </Field>
      <Field label="Max hours alone per day"><input type="number" min="0" max="24" {...num("maxHoursAlone")} /></Field>

      <h3>Health</h3>
      <Check label="Vaccinated" checked={form.vaccinated} onChange={set("vaccinated")} />
      <Check label="Dewormed" checked={form.dewormed} onChange={set("dewormed")} />
      <Check label="Sterilized" checked={form.sterilized} onChange={set("sterilized")} />
      <Field label="Health condition">
        <select {...text("healthCondition")}>
          {opts([["healthy", "Healthy"], ["minor_injury", "Minor injury"], ["serious_injury", "Serious injury"]])}
        </select>
      </Field>
      <Field label="Health notes"><textarea rows={2} {...text("healthNotes")} /></Field>

      <h3>Listing</h3>
      <Field label="Adoption fee"><input type="number" min="0" {...num("adoptionFee")} /></Field>
      <Field label="Description"><textarea rows={4} maxLength={2000} {...text("description")} /></Field>
      <Field label="Photo URLs (comma separated)"><input {...text("photos")} /></Field>

      <button type="submit">Add animal</button>
      <p>{status}</p>
    </form>
  );
}