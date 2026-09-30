



import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const user = await login(
        form.email,
        form.password
      );

      nav(
        user.role === "shelter"
          ? "/shelter/dashboard"
          : "/matches"
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed"
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
                Welcome
                <br />
                back.
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-7 text-white/85">
                Continue your journey toward finding the
                right companion or helping an animal find a
                loving home.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-sm font-semibold leading-6 text-white/90">
                🐾 Every match is a step toward a happier
                home.
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

            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-[#304338]">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-[#7b857e]">
                Log in to continue your adoption journey.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-5">

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
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[#dddcd5] bg-[#fffdfa] px-4 py-3.5 text-sm text-[#35423a] outline-none transition placeholder:text-[#b4b8b5] focus:border-[#6b8e72] focus:ring-4 focus:ring-[#6b8e72]/10"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-bold text-[#4d5b51]">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[#dddcd5] bg-[#fffdfa] px-4 py-3.5 text-sm text-[#35423a] outline-none transition placeholder:text-[#b4b8b5] focus:border-[#6b8e72] focus:ring-4 focus:ring-[#6b8e72]/10"
                />
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
                Log In 🐾
              </button>
            </form>

            {/* Register */}
            <div className="mt-7 border-t border-[#eee9df] pt-6 text-center">
              <p className="text-sm text-[#7b857e]">
                New here?
              </p>

              <Link
                to="/register"
                className="mt-1 inline-block font-extrabold text-[#5d7e64] hover:underline"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}