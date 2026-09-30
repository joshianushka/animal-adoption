

import { useEffect, useState } from "react";
import api from "../api";

const empty = {
  housingType: "apartment",
  hasChildren: false,
  hasDogs: false,
  hasCats: false,
  experienceLevel: "first_time",
  activityLevel: "medium",
  hoursAloneDaily: 6,
  preferredSpecies: [],
  preferredSizes: [],
  preferredAgeGroups: [],
  hasAllergies: false,
  maxAdoptionFee: 0,
  openToSpecialNeeds: false,
};

function Select({ label, value, onChange, options }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <div>{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, text]) => (
          <option key={v} value={v}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label style={{ display: "block", marginBottom: 8 }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />{" "}
      {label}
    </label>
  );
}

function MultiCheck({ label, values, options, onChange }) {
  const toggle = (v) =>
    onChange(
      values.includes(v)
        ? values.filter((x) => x !== v)
        : [...values, v]
    );

  return (
    <div style={{ marginBottom: 12 }}>
      <div>{label}</div>

      {options.map(([v, text]) => (
        <label key={v} style={{ marginRight: 16 }}>
          <input
            type="checkbox"
            checked={values.includes(v)}
            onChange={() => toggle(v)}
          />{" "}
          {text}
        </label>
      ))}
    </div>
  );
}

export default function AdopterQuestionnaire() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState("");

  const set = (key) => (value) =>
    setForm((f) => ({
      ...f,
      [key]: value,
    }));

  useEffect(() => {
    api
      .get("/adopters/me")
      .then((res) => setForm({ ...empty, ...res.data }))
      .catch(() => {}); // 404 means no profile yet
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      await api.put("/adopters/me", form);
      setStatus("Saved!");
    } catch (err) {
      setStatus(
        err.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <form
      onSubmit={submit}
      style={{ maxWidth: 560, margin: "2rem auto" }}
    >
      <h2>Tell us about you</h2>

      <h3>Your home</h3>

      <Select
        label="Housing"
        value={form.housingType}
        onChange={set("housingType")}
        options={[
          ["apartment", "Apartment"],
          ["house", "House"],
          ["house_with_yard", "House with yard"],
        ]}
      />

      <Check
        label="I have children at home"
        checked={form.hasChildren}
        onChange={set("hasChildren")}
      />

      <Check
        label="I have other dogs"
        checked={form.hasDogs}
        onChange={set("hasDogs")}
      />

      <Check
        label="I have cats"
        checked={form.hasCats}
        onChange={set("hasCats")}
      />

      <Check
        label="Someone in my home has pet allergies"
        checked={form.hasAllergies}
        onChange={set("hasAllergies")}
      />

      <h3>Your lifestyle</h3>

      <Select
        label="Pet experience"
        value={form.experienceLevel}
        onChange={set("experienceLevel")}
        options={[
          ["first_time", "First-time owner"],
          ["some", "Some experience"],
          ["experienced", "Very experienced"],
        ]}
      />

      <Select
        label="Activity level"
        value={form.activityLevel}
        onChange={set("activityLevel")}
        options={[
          ["low", "Low (calm, mostly indoors)"],
          ["medium", "Medium"],
          ["high", "High (runs, hikes)"],
        ]}
      />

      <label style={{ display: "block", marginBottom: 12 }}>
        <div>
          Hours the pet would be alone on a typical day:{" "}
          {form.hoursAloneDaily}
        </div>

        <input
          type="range"
          min="0"
          max="12"
          value={form.hoursAloneDaily}
          onChange={(e) =>
            set("hoursAloneDaily")(Number(e.target.value))
          }
        />
      </label>

      <h3>What you're looking for</h3>

      <MultiCheck
        label="Species"
        values={form.preferredSpecies}
        onChange={set("preferredSpecies")}
        options={[
          ["dog", "Dog"],
          ["cat", "Cat"],
        ]}
      />

      <MultiCheck
        label="Size"
        values={form.preferredSizes}
        onChange={set("preferredSizes")}
        options={[
          ["small", "Small"],
          ["medium", "Medium"],
          ["large", "Large"],
        ]}
      />

      <MultiCheck
        label="Age"
        values={form.preferredAgeGroups}
        onChange={set("preferredAgeGroups")}
        options={[
          ["young", "Young"],
          ["adult", "Adult"],
          ["senior", "Senior"],
        ]}
      />

      <label style={{ display: "block", marginBottom: 12 }}>
        <div>Maximum adoption fee</div>

        <input
          type="number"
          min="0"
          value={form.maxAdoptionFee}
          onChange={(e) =>
            set("maxAdoptionFee")(Number(e.target.value))
          }
        />
      </label>

      <Check
        label="I'm open to animals with special needs"
        checked={form.openToSpecialNeeds}
        onChange={set("openToSpecialNeeds")}
      />

      <button type="submit">Save my profile</button>

      <p>{status}</p>
    </form>
  );
}


