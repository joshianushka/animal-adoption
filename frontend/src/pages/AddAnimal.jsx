



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const empty = {
  name: "",
  species: "dog",
  breed: "",
  isMixedBreed: false,
  ageMonths: 12,
  gender: "male",
  size: "medium",
  color: "",
  coatLength: "short",
  energyLevel: "medium",
  temperament: "",
  goodWithKids: false,
  goodWithDogs: false,
  goodWithCats: false,
  needsYard: false,
  specialNeeds: false,
  experienceRequired: "first_time",
  maxHoursAlone: 6,
  vaccinated: false,
  dewormed: false,
  sterilized: false,
  healthCondition: "healthy",
  healthNotes: "",
  adoptionFee: 0,
  description: "",
  photos: "",
};

function Field({ label, children, full = false }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="mb-2 block text-sm font-bold text-[#4d5b51]">
        {label}
      </label>
      {children}
    </div>
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#e5e9e2] bg-[#fafbf8] px-4 py-3 text-sm font-semibold text-[#536057] transition hover:border-[#b8cbb9] hover:bg-[#f2f7f1]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#6b8e72]"
      />

      <span>{label}</span>
    </label>
  );
}

export default function AddAnimal() {
  const nav = useNavigate();

  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState("");
  const [prediction, setPrediction] = useState(null);

  const set = (key) => (value) =>
    setForm((f) => ({ ...f, [key]: value }));

  const text = (key) => ({
    value: form[key],
    onChange: (e) => set(key)(e.target.value),
  });

  const num = (key) => ({
    value: form[key],
    onChange: (e) => set(key)(Number(e.target.value)),
  });

  const opts = (list) =>
    list.map(([v, t]) => (
      <option key={v} value={v}>
        {t}
      </option>
    ));

  const buildPayload = () => ({
    ...form,

    temperament: form.temperament
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),

    photos: form.photos
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  });

  const predict = async () => {
    setPrediction(null);

    try {
      const { data } = await api.post(
        "/animals/predict-speed",
        buildPayload()
      );

      setPrediction(data);
    } catch (err) {
      setPrediction({
        error:
          err.response?.data?.message ||
          "Prediction failed",
      });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      await api.post("/animals", buildPayload());

      nav("/shelter/dashboard");
    } catch (err) {
      setStatus(
        err.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#dddcd5] bg-[#fffdfa] px-4 py-3 text-sm text-[#35423a] outline-none transition placeholder:text-[#b4b8b5] focus:border-[#6b8e72] focus:ring-4 focus:ring-[#6b8e72]/10";

  const selectClass =
    "w-full rounded-xl border border-[#dddcd5] bg-[#fffdfa] px-4 py-3 text-sm text-[#35423a] outline-none transition focus:border-[#6b8e72] focus:ring-4 focus:ring-[#6b8e72]/10";

  return (
    <div className="min-h-screen bg-[#fff9f0] px-4 py-10 font-sans text-[#35423a] md:px-8">

      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <div className="mb-8 flex items-center gap-4">

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#6b8e72] text-2xl shadow-lg shadow-[#6b8e72]/20">
            🐾
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-[#304338]">
              Add an Animal
            </h1>

            <p className="mt-1 text-sm text-[#7b857e]">
              Create a profile to help them find the right
              forever home.
            </p>
          </div>

        </div>

        <form onSubmit={submit} className="space-y-6">

          {/* BASIC INFORMATION */}
          <section className="rounded-2xl border border-[#eee9df] bg-white p-6 shadow-[0_8px_25px_rgba(70,70,50,0.06)] md:p-8">

            <div className="mb-7 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf4ed] text-xl">
                🐶
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-[#35483b]">
                  Basic Information
                </h2>

                <p className="text-xs text-[#8b938d]">
                  Tell adopters about this animal.
                </p>
              </div>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <Field label="Animal name">
                <input
                  required
                  placeholder="e.g. Bruno"
                  className={inputClass}
                  {...text("name")}
                />
              </Field>

              <Field label="Species">
                <select
                  className={selectClass}
                  {...text("species")}
                >
                  {opts([
                    ["dog", "Dog"],
                    ["cat", "Cat"],
                  ])}
                </select>
              </Field>

              <Field label="Breed">
                <input
                  placeholder="e.g. Labrador Mix"
                  className={inputClass}
                  {...text("breed")}
                />
              </Field>

              <Field label="Age (months)">
                <input
                  type="number"
                  min="0"
                  required
                  className={inputClass}
                  {...num("ageMonths")}
                />
              </Field>

              <Field label="Gender">
                <select
                  className={selectClass}
                  {...text("gender")}
                >
                  {opts([
                    ["male", "Male"],
                    ["female", "Female"],
                  ])}
                </select>
              </Field>

              <Field label="Size">
                <select
                  className={selectClass}
                  {...text("size")}
                >
                  {opts([
                    ["small", "Small"],
                    ["medium", "Medium"],
                    ["large", "Large"],
                  ])}
                </select>
              </Field>

              <Field label="Color">
                <input
                  placeholder="e.g. Black, brown, golden"
                  className={inputClass}
                  {...text("color")}
                />
              </Field>

              <Field label="Coat length">
                <select
                  className={selectClass}
                  {...text("coatLength")}
                >
                  {opts([
                    ["short", "Short"],
                    ["medium", "Medium"],
                    ["long", "Long"],
                  ])}
                </select>
              </Field>

              <div className="md:col-span-2">
                <Check
                  label="Mixed breed"
                  checked={form.isMixedBreed}
                  onChange={set("isMixedBreed")}
                />
              </div>

            </div>
          </section>

          {/* PERSONALITY */}
          <section className="rounded-2xl border border-[#eee9df] bg-white p-6 shadow-[0_8px_25px_rgba(70,70,50,0.06)] md:p-8">

            <div className="mb-7 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf4ed] text-xl">
                ❤️
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-[#35483b]">
                  Personality & Needs
                </h2>

                <p className="text-xs text-[#8b938d]">
                  Help us match them with the right family.
                </p>
              </div>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <Field label="Energy level">
                <select
                  className={selectClass}
                  {...text("energyLevel")}
                >
                  {opts([
                    ["low", "Low"],
                    ["medium", "Medium"],
                    ["high", "High"],
                  ])}
                </select>
              </Field>

              <Field label="Owner experience required">
                <select
                  className={selectClass}
                  {...text("experienceRequired")}
                >
                  {opts([
                    ["first_time", "Any owner"],
                    ["some", "Some experience"],
                    ["experienced", "Experienced only"],
                  ])}
                </select>
              </Field>

              <Field label="Temperament" full>
                <input
                  placeholder="calm, friendly, playful"
                  className={inputClass}
                  {...text("temperament")}
                />

                <p className="mt-1.5 text-xs text-[#9a9f9b]">
                  Separate multiple traits with commas.
                </p>
              </Field>

              <Field label="Maximum hours alone per day">
                <input
                  type="number"
                  min="0"
                  max="24"
                  className={inputClass}
                  {...num("maxHoursAlone")}
                />
              </Field>

            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">

              <Check
                label="Good with children"
                checked={form.goodWithKids}
                onChange={set("goodWithKids")}
              />

              <Check
                label="Good with dogs"
                checked={form.goodWithDogs}
                onChange={set("goodWithDogs")}
              />

              <Check
                label="Good with cats"
                checked={form.goodWithCats}
                onChange={set("goodWithCats")}
              />

              <Check
                label="Needs a yard"
                checked={form.needsYard}
                onChange={set("needsYard")}
              />

              <Check
                label="Has special needs"
                checked={form.specialNeeds}
                onChange={set("specialNeeds")}
              />

            </div>
          </section>

          {/* HEALTH */}
          <section className="rounded-2xl border border-[#eee9df] bg-white p-6 shadow-[0_8px_25px_rgba(70,70,50,0.06)] md:p-8">

            <div className="mb-7 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf4ed] text-xl">
                🩺
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-[#35483b]">
                  Health Information
                </h2>

                <p className="text-xs text-[#8b938d]">
                  Keep their health information transparent.
                </p>
              </div>

            </div>

            <div className="grid gap-3 md:grid-cols-3">

              <Check
                label="Vaccinated"
                checked={form.vaccinated}
                onChange={set("vaccinated")}
              />

              <Check
                label="Dewormed"
                checked={form.dewormed}
                onChange={set("dewormed")}
              />

              <Check
                label="Sterilized"
                checked={form.sterilized}
                onChange={set("sterilized")}
              />

            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <Field label="Health condition">
                <select
                  className={selectClass}
                  {...text("healthCondition")}
                >
                  {opts([
                    ["healthy", "Healthy"],
                    ["minor_injury", "Minor injury"],
                    ["serious_injury", "Serious injury"],
                  ])}
                </select>
              </Field>

              <Field label="Health notes" full>
                <textarea
                  rows="4"
                  placeholder="Mention allergies, medication, injuries, etc."
                  className={inputClass}
                  {...text("healthNotes")}
                />
              </Field>

            </div>
          </section>

          {/* LISTING */}
          <section className="rounded-2xl border border-[#eee9df] bg-white p-6 shadow-[0_8px_25px_rgba(70,70,50,0.06)] md:p-8">

            <div className="mb-7 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf4ed] text-xl">
                🏠
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-[#35483b]">
                  Adoption Listing
                </h2>

                <p className="text-xs text-[#8b938d]">
                  Give potential adopters a glimpse into
                  their life.
                </p>
              </div>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <Field label="Adoption fee">
                <div className="flex overflow-hidden rounded-xl border border-[#dddcd5] bg-[#fffdfa] focus-within:border-[#6b8e72] focus-within:ring-4 focus-within:ring-[#6b8e72]/10">

                  <span className="flex items-center pl-4 font-bold text-[#6b8e72]">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    className="w-full border-0 bg-transparent px-3 py-3 text-sm outline-none"
                    {...num("adoptionFee")}
                  />

                </div>
              </Field>

              <div />

              <Field label="Photo URLs" full>
                <input
                  placeholder="https://..., https://..."
                  className={inputClass}
                  {...text("photos")}
                />

                <p className="mt-1.5 text-xs text-[#9a9f9b]">
                  Add multiple URLs separated by commas.
                </p>
              </Field>

              <Field label="Description" full>
                <textarea
                  rows="6"
                  maxLength="2000"
                  placeholder="Tell adopters about their personality, daily routine, favorite activities and what makes them special..."
                  className={inputClass}
                  {...text("description")}
                />
              </Field>

            </div>
          </section>

          {/* AI PREDICTION */}
          {prediction && !prediction.error && (
            <div className="flex gap-4 rounded-2xl border border-[#d3e3d3] bg-[#edf5ed] p-5">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl">
                ✨
              </div>

              <div>
                <p className="text-xs font-bold text-[#6c806f]">
                  AI Adoption Prediction
                </p>

                <h3 className="mt-1 text-xl font-extrabold text-[#3e6147]">
                  {prediction.label}
                </h3>

                {prediction.tips?.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-sm text-[#617064]">
                    {prediction.tips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                )}

              </div>
            </div>
          )}

          {/* ERROR */}
          {prediction?.error && (
            <div className="rounded-xl bg-[#fff0ed] px-4 py-3 text-sm text-[#b64e3e]">
              {prediction.error}
            </div>
          )}

          {status && (
            <div className="text-center text-sm text-[#6b756e]">
              {status}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex flex-col justify-end gap-3 sm:flex-row">

            <button
              type="button"
              onClick={predict}
              className="rounded-xl bg-[#eee9df] px-6 py-3 font-extrabold text-[#5f685f] transition hover:-translate-y-0.5 hover:bg-[#e2ddd2]"
            >
              ✨ Predict Adoption Speed
            </button>

            <button
              type="submit"
              className="rounded-xl bg-[#6b8e72] px-7 py-3 font-extrabold text-white shadow-lg shadow-[#6b8e72]/20 transition hover:-translate-y-0.5 hover:bg-[#5d7e64]"
            >
              🐾 Add Animal
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}