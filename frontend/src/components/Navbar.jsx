


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    nav("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#e9e5dc] bg-[#fff9f0]/95 font-sans shadow-[0_4px_15px_rgba(70,70,50,0.05)] backdrop-blur">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link
          to={
            user?.role === "shelter"
              ? "/shelter/dashboard"
              : user?.role === "adopter"
              ? "/matches"
              : "/login"
          }
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6b8e72] text-xl shadow-md shadow-[#6b8e72]/20">
            🐾
          </div>

          <div className="hidden sm:block">
            <p className="text-lg font-extrabold leading-tight text-[#304338]">
              Pet Adoption
            </p>

            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8b938d]">
              Find. Match. Love.
            </p>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-1 md:flex">

          {user?.role === "adopter" && (
            <>
              <Link
                to="/matches"
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#617064] transition hover:bg-[#edf5ed] hover:text-[#3e6147]"
              >
                🐾 My Matches
              </Link>

              <Link
                to="/adopter/questionnaire"
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#617064] transition hover:bg-[#edf5ed] hover:text-[#3e6147]"
              >
                👤 My Profile
              </Link>

              <Link
                to="/my-requests"
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#617064] transition hover:bg-[#edf5ed] hover:text-[#3e6147]"
              >
                💌 My Requests
              </Link>
            </>
          )}

          {user?.role === "shelter" && (
            <>
              <Link
                to="/shelter/dashboard"
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#617064] transition hover:bg-[#edf5ed] hover:text-[#3e6147]"
              >
                🏡 Dashboard
              </Link>

              <Link
                to="/shelter/add-animal"
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#617064] transition hover:bg-[#edf5ed] hover:text-[#3e6147]"
              >
                🐕 Add Animal
              </Link>
            </>
          )}
        </div>

        {/* DESKTOP USER AREA */}
        <div className="hidden items-center gap-3 md:flex">

          {user ? (
            <>
              <div className="flex items-center gap-2 rounded-xl bg-[#edf5ed] px-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6b8e72] text-sm text-white">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="max-w-[120px]">
                  <p className="truncate text-sm font-extrabold text-[#35483b]">
                    {user.name}
                  </p>

                  <p className="text-[10px] font-semibold capitalize text-[#7b857e]">
                    {user.role}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-[#ecd4cf] bg-[#fff0ee] px-4 py-2.5 text-sm font-extrabold text-[#b64e3e] transition hover:bg-[#ffe5e1]"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-[#6b8e72] px-5 py-2.5 text-sm font-extrabold text-white shadow-md shadow-[#6b8e72]/20 transition hover:bg-[#5d7e64]"
            >
              Log in
            </Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf5ed] text-xl text-[#3e6147] transition hover:bg-[#dfeee0] md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="border-t border-[#e9e5dc] bg-white px-4 py-4 shadow-lg md:hidden">

          {user ? (
            <>
              {/* User */}
              <div className="mb-4 flex items-center gap-3 rounded-xl bg-[#edf5ed] p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6b8e72] font-extrabold text-white">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div>
                  <p className="font-extrabold text-[#35483b]">
                    {user.name}
                  </p>

                  <p className="text-xs capitalize text-[#7b857e]">
                    {user.role}
                  </p>
                </div>
              </div>

              {/* Adopter links */}
              {user.role === "adopter" && (
                <div className="space-y-1">

                  <Link
                    to="/matches"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 font-bold text-[#617064] transition hover:bg-[#edf5ed] hover:text-[#3e6147]"
                  >
                    🐾 My Matches
                  </Link>

                  <Link
                    to="/adopter/questionnaire"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 font-bold text-[#617064] transition hover:bg-[#edf5ed] hover:text-[#3e6147]"
                  >
                    👤 My Profile
                  </Link>

                  <Link
                    to="/my-requests"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 font-bold text-[#617064] transition hover:bg-[#edf5ed] hover:text-[#3e6147]"
                  >
                    💌 My Requests
                  </Link>
                </div>
              )}

              {/* Shelter links */}
              {user.role === "shelter" && (
                <div className="space-y-1">

                  <Link
                    to="/shelter/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 font-bold text-[#617064] transition hover:bg-[#edf5ed] hover:text-[#3e6147]"
                  >
                    🏡 Dashboard
                  </Link>

                  <Link
                    to="/shelter/add-animal"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 font-bold text-[#617064] transition hover:bg-[#edf5ed] hover:text-[#3e6147]"
                  >
                    🐕 Add Animal
                  </Link>
                </div>
              )}

              {/* Logout */}
              <div className="mt-3 border-t border-[#eee9df] pt-3">
                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl border border-[#ecd4cf] bg-[#fff0ee] px-4 py-3 text-left font-extrabold text-[#b64e3e] transition hover:bg-[#ffe5e1]"
                >
                  Log out
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl bg-[#6b8e72] px-4 py-3 text-center font-extrabold text-white"
            >
              Log in
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}


