

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "adopter",
    shelterName: "",
  });

  const [error, setError] = useState("");

  const set = (k) => (e) =>
    setForm({
      ...form,
      [k]: e.target.value,
    });

  const submit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const user = await register(form);

      nav(
        user.role === "shelter"
          ? "/shelter/dashboard"
          : "/adopter/questionnaire"
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9f0] px-4 py-10 font-sans text-[#35423a]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">

        <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-[#eee9df] bg-white shadow-[0_15px_45px_rgba(70,70,50,0.10)] md:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="hidden bg-[#6b8e72] p-10 text-white md:flex md:flex-col md:justify-between">
            <div>
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl">
                🐾
              </div>

              <h1 className="text-4xl font-extrabold leading-tight">
                Find a friend.
                <br />
                Change a life.
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-7 text-white/85">
                Create an account to discover animals that
                match your lifestyle and preferences.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-sm font-semibold leading-6 text-white/90">
                "Every animal deserves a loving home, and
                every home deserves the right companion."
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-7 sm:p-10">

            {/* Mobile logo */}
            <div className="mb-6 flex items-center gap-3 md:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6b8e72] text-xl shadow-lg shadow-[#6b8e72]/20">
                🐾
              </div>

              <span className="text-xl font-extrabold text-[#304338]">
                ShelterMatch
              </span>
            </div>

            <div className="mb-7">
              <h2 className="text-3xl font-extrabold text-[#304338]">
                Create an account
              </h2>

              <p className="mt-2 text-sm text-[#7b857e]">
                Join us in helping animals find loving homes.
              </p>
            </div>

            {/* ROLE SELECTION */}
            <div className="mb-6">
              <label className="mb-3 block text-sm font-extrabold text-[#4d5b51]">
                I am here to...
              </label>

              <div className="grid gap-3 sm:grid-cols-2">

                {/* Adopter */}
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      role: "adopter",
                    })
                  }
                  className={`rounded-xl border p-4 text-left transition ${
                    form.role === "adopter"
                      ? "border-[#6b8e72] bg-[#edf5ed] ring-2 ring-[#6b8e72]/10"
                      : "border-[#e5e2da] bg-[#fffdfa] hover:border-[#b8cbb9]"
                  }`}
                >
                  <div className="mb-2 text-2xl">
                    🏠
                  </div>

                  <p className="font-extrabold text-[#35483b]">
                    I want to adopt
                  </p>

                  <p className="mt-1 text-xs text-[#7b857e]">
                    Find my perfect companion
                  </p>
                </button>

                {/* Shelter */}
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      role: "shelter",
                    })
                  }
                  className={`rounded-xl border p-4 text-left transition ${
                    form.role === "shelter"
                      ? "border-[#6b8e72] bg-[#edf5ed] ring-2 ring-[#6b8e72]/10"
                      : "border-[#e5e2da] bg-[#fffdfa] hover:border-[#b8cbb9]"
                  }`}
                >
                  <div className="mb-2 text-2xl">
                    🏡
                  </div>

                  <p className="font-extrabold text-[#35483b]">
                    I run a shelter
                  </p>

                  <p className="mt-1 text-xs text-[#7b857e]">
                    Help animals find homes
                  </p>
                </button>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-4">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-bold text-[#4d5b51]">
                  Your name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  required
                  value={form.name}
                  onChange={set("name")}
                  className="w-full rounded-xl border border-[#dddcd5] bg-[#fffdfa] px-4 py-3 text-sm text-[#35423a] outline-none transition placeholder:text-[#b4b8b5] focus:border-[#6b8e72] focus:ring-4 focus:ring-[#6b8e72]/10"
                />
              </div>

              {/* Shelter Name */}
              {form.role === "shelter" && (
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#4d5b51]">
                    Shelter name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your shelter name"
                    value={form.shelterName}
                    onChange={set("shelterName")}
                    className="w-full rounded-xl border border-[#dddcd5] bg-[#fffdfa] px-4 py-3 text-sm text-[#35423a] outline-none transition placeholder:text-[#b4b8b5] focus:border-[#6b8e72] focus:ring-4 focus:ring-[#6b8e72]/10"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-bold text-[#4d5b51]">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={form.email}
                  onChange={set("email")}
                  className="w-full rounded-xl border border-[#dddcd5] bg-[#fffdfa] px-4 py-3 text-sm text-[#35423a] outline-none transition placeholder:text-[#b4b8b5] focus:border-[#6b8e72] focus:ring-4 focus:ring-[#6b8e72]/10"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-bold text-[#4d5b51]">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={set("password")}
                  className="w-full rounded-xl border border-[#dddcd5] bg-[#fffdfa] px-4 py-3 text-sm text-[#35423a] outline-none transition placeholder:text-[#b4b8b5] focus:border-[#6b8e72] focus:ring-4 focus:ring-[#6b8e72]/10"
                />

                <p className="mt-2 text-xs text-[#9aa19b]">
                  Use at least 6 characters.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-[#ecd4cf] bg-[#fff0ee] px-4 py-3 text-sm font-semibold text-[#b64e3e]">
                  ⚠️ {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl bg-[#6b8e72] px-5 py-3.5 font-extrabold text-white shadow-lg shadow-[#6b8e72]/20 transition hover:-translate-y-0.5 hover:bg-[#5d7e64] active:translate-y-0"
              >
                Create Account 🐾
              </button>
            </form>

            {/* Login */}
            <p className="mt-6 text-center text-sm text-[#7b857e]">
              Already registered?{" "}
              <Link
                to="/login"
                className="font-extrabold text-[#5d7e64] hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}