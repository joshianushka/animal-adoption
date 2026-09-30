

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const label = (score) =>
  score >= 80
    ? "Great match"
    : score >= 60
    ? "Good match"
    : "Worth a look";

const matchColor = (score) => {
  if (score >= 80) return "bg-[#6b8e72]";
  if (score >= 60) return "bg-[#a58b57]";
  return "bg-[#8b918b]";
};

function MatchCard({ match }) {
  const {
    animal,
    score,
    blocked,
    block_reasons,
    why,
    concerns,
  } = match;

  const [reqStatus, setReqStatus] = useState(
    match.requestStatus
  );

  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");

  if (!animal) return null;

  const sendRequest = async () => {
    try {
      setNote("");

      await api.post("/requests", {
        animalId: match.animalId,
        message,
      });

      setReqStatus("pending");
      setMessage("");
    } catch (err) {
      setNote(
        err.response?.data?.message ||
          "Could not send request"
      );
    }
  };

  const ageYears = Math.floor(animal.ageMonths / 12);
  const ageMonths = animal.ageMonths % 12;

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-[0_8px_25px_rgba(70,70,50,0.06)] transition hover:shadow-[0_12px_30px_rgba(70,70,50,0.10)] ${
        blocked
          ? "border-[#eadfce]"
          : "border-[#eee9df]"
      }`}
    >

      
      <div className="relative">

        {animal.photos?.[0] ? (
          <img
            src={animal.photos[0]}
            alt={animal.name}
            className={`h-64 w-full object-cover ${
              blocked ? "brightness-90" : ""
            }`}
          />
        ) : (
          <div className="flex h-64 w-full items-center justify-center bg-[#edf4ed] text-6xl">
            🐾
          </div>
        )}

        
        {!blocked && (
          <div className="absolute right-4 top-4 flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-2 shadow-lg backdrop-blur">

            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold text-white ${matchColor(
                score
              )}`}
            >
              {Math.round(score)}%
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8b938d]">
                Compatibility
              </p>

              <p className="text-sm font-extrabold text-[#35483b]">
                {label(score)}
              </p>
            </div>

          </div>
        )}

        {blocked && (
          <div className="absolute right-4 top-4 rounded-xl bg-[#fff4e5] px-4 py-2 text-sm font-bold text-[#8b6b38] shadow-lg">
            ⚠️ Compatibility check
          </div>
        )}

      </div>

      
      <div className="p-6">

        
        <div className="mb-5">

          <h2 className="text-2xl font-extrabold text-[#304338]">
            {animal.name}
          </h2>

          <p className="mt-1 text-sm text-[#7b857e]">
            {animal.breed || animal.species}
            {" · "}
            {animal.size}
            {" · "}
            {ageYears > 0 && `${ageYears}y `}
            {ageMonths > 0 && `${ageMonths}m`}
          </p>

        </div>

        
        {blocked && (
          <div className="mb-5 rounded-xl border border-[#eadfce] bg-[#fff8ec] p-4">

            <div className="flex gap-3">

              <span className="text-xl">⚠️</span>

              <div>
                <h3 className="font-extrabold text-[#705b36]">
                  Compatibility check needed
                </h3>

                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#806f50]">
                  {block_reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>

                <p className="mt-3 text-xs text-[#907f60]">
                  Ask the shelter for more details before
                  making a decision.
                </p>
              </div>

            </div>
          </div>
        )}

        
        {why?.length > 0 && (
          <div className="mb-5">

            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#edf5ed] text-sm">
                ❤️
              </span>

              <h3 className="font-extrabold text-[#35483b]">
                Why {animal.name} may be a good fit
              </h3>
            </div>

            <div className="space-y-2">
              {why.map((w) => (
                <div
                  key={w}
                  className="flex items-start gap-2 text-sm text-[#617064]"
                >
                  <span className="mt-0.5 font-bold text-[#6b8e72]">
                    ✓
                  </span>

                  <span>{w}</span>
                </div>
              ))}
            </div>

          </div>
        )}

        
        {concerns?.length > 0 && (
          <div className="mb-5">

            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fff4e5] text-sm">
                💡
              </span>

              <h3 className="font-extrabold text-[#5d5749]">
                Things to consider
              </h3>
            </div>

            <div className="space-y-2">
              {concerns.map((c) => (
                <div
                  key={c}
                  className="flex items-start gap-2 text-sm text-[#756f61]"
                >
                  <span className="mt-0.5 text-[#a58b57]">
                    •
                  </span>

                  <span>{c}</span>
                </div>
              ))}
            </div>

          </div>
        )}

        
        <div className="border-t border-[#eee9df] pt-5">

          {reqStatus ? (
            <div className="flex items-center gap-3 rounded-xl bg-[#edf5ed] px-4 py-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                {reqStatus === "pending"
                  ? "⏳"
                  : "🐾"}
              </div>

              <div>
                <p className="text-xs text-[#718075]">
                  Adoption request
                </p>

                <p className="font-extrabold capitalize text-[#3e6147]">
                  {reqStatus}
                </p>
              </div>

            </div>
          ) : (
            <div>

              <label className="mb-2 block text-sm font-bold text-[#4d5b51]">
                Interested in {animal.name}?
              </label>

              <textarea
                rows="3"
                placeholder="Optional message to the shelter..."
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                className="mb-3 w-full resize-none rounded-xl border border-[#dddcd5] bg-[#fffdfa] px-4 py-3 text-sm text-[#35423a] outline-none transition placeholder:text-[#b4b8b5] focus:border-[#6b8e72] focus:ring-4 focus:ring-[#6b8e72]/10"
              />

              <button
                onClick={sendRequest}
                className="w-full rounded-xl bg-[#6b8e72] px-5 py-3 font-extrabold text-white shadow-lg shadow-[#6b8e72]/20 transition hover:-translate-y-0.5 hover:bg-[#5d7e64]"
              >
                🐾 Request Adoption
              </button>

              {note && (
                <p className="mt-2 text-sm text-[#b64e3e]">
                  {note}
                </p>
              )}

            </div>
          )}

        </div>

      </div>
    </article>
  );
}

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/matches/me")
      .then((res) => {
        setMatches(res.data);
        setState("done");
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Could not load matches"
        );

        setState("error");
      });
  }, []);

  
  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff9f0] px-4">

        <div className="text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-[#6b8e72] text-3xl">
            🐾
          </div>

          <h2 className="text-xl font-extrabold text-[#35483b]">
            Finding your matches...
          </h2>

          <p className="mt-1 text-sm text-[#8b938d]">
            We're looking for companions that fit your
            lifestyle.
          </p>

        </div>

      </div>
    );
  }

  
  if (state === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff9f0] px-4">

        <div className="max-w-md rounded-2xl border border-[#eee9df] bg-white p-8 text-center shadow-[0_8px_25px_rgba(70,70,50,0.06)]">

          <div className="mb-4 text-5xl">
            🐾
          </div>

          <h2 className="text-xl font-extrabold text-[#35483b]">
            We couldn't find your matches
          </h2>

          <p className="mt-2 text-sm text-[#7b857e]">
            {error}
          </p>

          {error.includes("questionnaire") && (
            <Link
              to="/adopter/questionnaire"
              className="mt-5 inline-block rounded-xl bg-[#6b8e72] px-6 py-3 font-extrabold text-white shadow-lg shadow-[#6b8e72]/20 transition hover:bg-[#5d7e64]"
            >
              Complete My Questionnaire
            </Link>
          )}

        </div>

      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-[#fff9f0] px-4 py-10 font-sans text-[#35423a] md:px-8">

      <div className="mx-auto max-w-5xl">

        
        <div className="mb-8">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#6b8e72] text-2xl shadow-lg shadow-[#6b8e72]/20">
              🐾
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-[#304338]">
                Your Matches
              </h1>

              <p className="mt-1 text-sm text-[#7b857e]">
                Companions selected based on your lifestyle
                and preferences.
              </p>
            </div>

          </div>

          {matches.length > 0 && (
            <div className="mt-5 rounded-xl border border-[#d3e3d3] bg-[#edf5ed] px-4 py-3 text-sm text-[#617064]">
              ✨ We found{" "}
              <strong className="text-[#3e6147]">
                {matches.length}
              </strong>{" "}
              potential companion
              {matches.length !== 1 ? "s" : ""} for you.
            </div>
          )}

        </div>

        
        {matches.length === 0 && (
          <div className="rounded-2xl border border-[#eee9df] bg-white p-10 text-center shadow-[0_8px_25px_rgba(70,70,50,0.06)]">

            <div className="mb-4 text-6xl">
              🐕
            </div>

            <h2 className="text-xl font-extrabold text-[#35483b]">
              No animals available right now
            </h2>

            <p className="mt-2 text-sm text-[#7b857e]">
              Check back later. New animals may be added
              by shelters soon.
            </p>

          </div>
        )}

        
        <div className="grid gap-6 md:grid-cols-2">

          {matches.map((m) => (
            <MatchCard
              key={m.animalId}
              match={m}
            />
          ))}

        </div>

      </div>
    </div>
  );
}