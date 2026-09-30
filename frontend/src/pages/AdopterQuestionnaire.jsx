


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
    <div>
      <label className="mb-2 block text-sm font-bold text-[#4d5b51]">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#dddcd5] bg-[#fffdfa] px-4 py-3 text-sm text-[#35423a] outline-none transition focus:border-[#6b8e72] focus:ring-4 focus:ring-[#6b8e72]/10"
      >
        {options.map(([v, text]) => (
          <option key={v} value={v}>
            {text}
          </option>
        ))}
      </select>
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

function MultiCheck({
  label,
  values,
  options,
  onChange,
}) {
  const toggle = (v) => {
    onChange(
      values.includes(v)
        ? values.filter((x) => x !== v)
        : [...values, v]
    );
  };

  return (
    <div>
      <label className="mb-3 block text-sm font-bold text-[#4d5b51]">
        {label}
      </label>

      <div className="grid gap-3 sm:grid-cols-3">
        {options.map(([v, text]) => {
          const selected = values.includes(v);

          return (
            <label
              key={v}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                selected
                  ? "border-[#6b8e72] bg-[#edf5ed] text-[#3e6147]"
                  : "border-[#e5e9e2] bg-[#fafbf8] text-[#536057] hover:border-[#b8cbb9] hover:bg-[#f2f7f1]"
              }`}
            >
              <input
                type="checkbox"
                checked={selected}
                onChange={() => toggle(v)}
                className="h-4 w-4 accent-[#6b8e72]"
              />

              <span>{text}</span>
            </label>
          );
        })}
      </div>
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
      .catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      await api.put("/adopters/me", form);
      setStatus("Saved!");
    } catch (err) {
      setStatus(
        err.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

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
              Find Your Perfect Match
            </h1>

            <p className="mt-1 max-w-xl text-sm text-[#7b857e]">
              Tell us a little about your lifestyle and
              we'll help you find animals that fit your
              home and everyday life.
            </p>
          </div>

        </div>

        <form
          onSubmit={submit}
          className="space-y-6"
        >

          {/* HOME */}
          <section className="rounded-2xl border border-[#eee9df] bg-white p-6 shadow-[0_8px_25px_rgba(70,70,50,0.06)] md:p-8">

            <div className="mb-7 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf4ed] text-xl">
                🏠
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-[#35483b]">
                  Your Home
                </h2>

                <p className="text-xs text-[#8b938d]">
                  Tell us about the environment your
                  future pet will live in.
                </p>
              </div>

            </div>

            <div className="space-y-5">

              <Select
                label="What type of home do you live in?"
                value={form.housingType}
                onChange={set("housingType")}
                options={[
                  ["apartment", "Apartment"],
                  ["house", "House"],
                  ["house_with_yard", "House with yard"],
                ]}
              />

              <div className="grid gap-3 md:grid-cols-2">

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
                  label="Someone has pet allergies"
                  checked={form.hasAllergies}
                  onChange={set("hasAllergies")}
                />

              </div>

            </div>
          </section>

          {/* LIFESTYLE */}
          <section className="rounded-2xl border border-[#eee9df] bg-white p-6 shadow-[0_8px_25px_rgba(70,70,50,0.06)] md:p-8">

            <div className="mb-7 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf4ed] text-xl">
                🌿
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-[#35483b]">
                  Your Lifestyle
                </h2>

                <p className="text-xs text-[#8b938d]">
                  This helps us understand what kind of
                  companion suits your routine.
                </p>
              </div>

            </div>

            <div className="space-y-5">

              <Select
                label="How experienced are you with pets?"
                value={form.experienceLevel}
                onChange={set("experienceLevel")}
                options={[
                  ["first_time", "First-time owner"],
                  ["some", "Some experience"],
                  ["experienced", "Very experienced"],
                ]}
              />

              <Select
                label="How active is your lifestyle?"
                value={form.activityLevel}
                onChange={set("activityLevel")}
                options={[
                  [
                    "low",
                    "Low — calm, mostly indoors",
                  ],
                  ["medium", "Medium"],
                  [
                    "high",
                    "High — runs, hikes, outdoor activities",
                  ],
                ]}
              />

              {/* HOURS ALONE */}
              <div className="rounded-xl border border-[#e5e9e2] bg-[#fafbf8] p-5">

                <div className="mb-3 flex items-center justify-between">

                  <label className="text-sm font-bold text-[#4d5b51]">
                    How many hours would your pet
                    typically be alone?
                  </label>

                  <span className="rounded-lg bg-[#edf5ed] px-3 py-1 text-sm font-extrabold text-[#3e6147]">
                    {form.hoursAloneDaily} hrs
                  </span>

                </div>

                <input
                  type="range"
                  min="0"
                  max="12"
                  value={form.hoursAloneDaily}
                  onChange={(e) =>
                    set("hoursAloneDaily")(
                      Number(e.target.value)
                    )
                  }
                  className="w-full accent-[#6b8e72]"
                />

                <div className="mt-2 flex justify-between text-xs text-[#9a9f9b]">
                  <span>Always home</span>
                  <span>12 hours</span>
                </div>

              </div>

            </div>
          </section>

          {/* PREFERENCES */}
          <section className="rounded-2xl border border-[#eee9df] bg-white p-6 shadow-[0_8px_25px_rgba(70,70,50,0.06)] md:p-8">

            <div className="mb-7 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf4ed] text-xl">
                ❤️
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-[#35483b]">
                  What You're Looking For
                </h2>

                <p className="text-xs text-[#8b938d]">
                  Choose your preferences. You can select
                  more than one option.
                </p>
              </div>

            </div>

            <div className="space-y-7">

              <MultiCheck
                label="Which animals would you consider?"
                values={form.preferredSpecies}
                onChange={set("preferredSpecies")}
                options={[
                  ["dog", "🐶 Dog"],
                  ["cat", "🐱 Cat"],
                ]}
              />

              <MultiCheck
                label="Preferred size"
                values={form.preferredSizes}
                onChange={set("preferredSizes")}
                options={[
                  ["small", "Small"],
                  ["medium", "Medium"],
                  ["large", "Large"],
                ]}
              />

              <MultiCheck
                label="Preferred age"
                values={form.preferredAgeGroups}
                onChange={set("preferredAgeGroups")}
                options={[
                  ["young", "Young"],
                  ["adult", "Adult"],
                  ["senior", "Senior"],
                ]}
              />

              {/* FEE */}
              <div>

                <label className="mb-2 block text-sm font-bold text-[#4d5b51]">
                  Maximum adoption fee
                </label>

                <div className="flex max-w-sm overflow-hidden rounded-xl border border-[#dddcd5] bg-[#fffdfa] focus-within:border-[#6b8e72] focus-within:ring-4 focus-within:ring-[#6b8e72]/10">

                  <span className="flex items-center pl-4 font-bold text-[#6b8e72]">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={form.maxAdoptionFee}
                    onChange={(e) =>
                      set("maxAdoptionFee")(
                        Number(e.target.value)
                      )
                    }
                    className="w-full border-0 bg-transparent px-3 py-3 text-sm outline-none"
                  />

                </div>

              </div>

              {/* SPECIAL NEEDS */}
              <Check
                label="I'm open to animals with special needs"
                checked={form.openToSpecialNeeds}
                onChange={set("openToSpecialNeeds")}
              />

            </div>
          </section>

          {/* MATCHING INFO */}
          <div className="rounded-2xl border border-[#d3e3d3] bg-[#edf5ed] p-5">

            <div className="flex gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl">
                ✨
              </div>

              <div>

                <h3 className="font-extrabold text-[#3e6147]">
                  Why are we asking this?
                </h3>

                <p className="mt-1 text-sm leading-6 text-[#617064]">
                  Your answers help our matching system
                  find animals whose needs and personality
                  are compatible with your lifestyle.
                </p>

              </div>

            </div>

          </div>

          {/* STATUS */}
          {status && (
            <div
              className={`rounded-xl px-4 py-3 text-center text-sm font-semibold ${
                status === "Saved!"
                  ? "bg-[#edf5ed] text-[#3e6147]"
                  : "text-[#6b756e]"
              }`}
            >
              {status}
            </div>
          )}

          {/* SAVE BUTTON */}
          <div className="flex justify-end">

            <button
              type="submit"
              className="w-full rounded-xl bg-[#6b8e72] px-8 py-3.5 font-extrabold text-white shadow-lg shadow-[#6b8e72]/20 transition hover:-translate-y-0.5 hover:bg-[#5d7e64] sm:w-auto"
            >
              🐾 Save My Profile
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}