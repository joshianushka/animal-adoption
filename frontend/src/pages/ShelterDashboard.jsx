

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const statusStyles = {
  pending: {
    bg: "bg-[#fff4e5]",
    text: "text-[#9a6b25]",
    border: "border-[#eadfce]",
    icon: "⏳",
  },
  approved: {
    bg: "bg-[#edf5ed]",
    text: "text-[#3e6147]",
    border: "border-[#d3e3d3]",
    icon: "✓",
  },
  rejected: {
    bg: "bg-[#fff0ee]",
    text: "text-[#b64e3e]",
    border: "border-[#ecd4cf]",
    icon: "✕",
  },
};

export default function ShelterDashboard() {
  const [animals, setAnimals] = useState([]);
  const [requests, setRequests] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [a, r] = await Promise.all([
        api.get("/animals/mine"),
        api.get("/requests/shelter"),
      ]);

      setAnimals(a.data);
      setRequests(r.data);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Could not load dashboard"
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  const predict = async (animal) => {
    try {
      const { data } = await api.post(
        "/animals/predict-speed",
        animal
      );

      setPredictions((p) => ({
        ...p,
        [animal._id]: data,
      }));
    } catch (e) {
      setPredictions((p) => ({
        ...p,
        [animal._id]: {
          error:
            e.response?.data?.message ||
            "Prediction failed",
        },
      }));
    }
  };

  const decide = async (id, status) => {
    try {
      await api.patch(`/requests/${id}`, { status });
      load();
    } catch (e) {
      alert(
        e.response?.data?.message ||
          "Failed"
      );
    }
  };

  const remove = async (id) => {
    if (window.confirm("Delete this animal?")) {
      await api.delete(`/animals/${id}`);
      load();
    }
  };

  const count = (animalId, status) =>
    requests.filter(
      (r) =>
        r.animal?._id === animalId &&
        r.status === status
    ).length;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff9f0] px-4">
        <div className="max-w-md rounded-2xl border border-[#ecd4cf] bg-white p-8 text-center shadow-[0_8px_25px_rgba(70,70,50,0.06)]">
          <div className="mb-4 text-5xl">🐾</div>

          <h2 className="text-xl font-extrabold text-[#35483b]">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-[#b64e3e]">
            {error}
          </p>

          <button
            onClick={load}
            className="mt-5 rounded-xl bg-[#6b8e72] px-6 py-3 font-extrabold text-white shadow-lg shadow-[#6b8e72]/20 transition hover:bg-[#5d7e64]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const pendingRequests = requests.filter(
    (r) => r.status === "pending"
  ).length;

  const approvedRequests = requests.filter(
    (r) => r.status === "approved"
  ).length;

  return (
    <div className="min-h-screen bg-[#fff9f0] px-4 py-10 font-sans text-[#35423a] md:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#6b8e72] text-2xl shadow-lg shadow-[#6b8e72]/20">
                🐾
              </div>

              <div>
                <h1 className="text-3xl font-extrabold text-[#304338]">
                  Shelter Dashboard
                </h1>

                <p className="mt-1 text-sm text-[#7b857e]">
                  Manage your animals and adoption requests.
                </p>
              </div>
            </div>

            <Link
              to="/shelter/add-animal"
              className="inline-flex items-center justify-center rounded-xl bg-[#6b8e72] px-5 py-3 font-extrabold text-white shadow-lg shadow-[#6b8e72]/20 transition hover:-translate-y-0.5 hover:bg-[#5d7e64]"
            >
              + Add Animal
            </Link>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-[#eee9df] bg-white p-5 shadow-[0_8px_25px_rgba(70,70,50,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#9aa19b]">
                  My Animals
                </p>

                <p className="mt-1 text-3xl font-extrabold text-[#304338]">
                  {animals.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf5ed] text-2xl">
                🐕
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#eee9df] bg-white p-5 shadow-[0_8px_25px_rgba(70,70,50,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#9aa19b]">
                  Pending Requests
                </p>

                <p className="mt-1 text-3xl font-extrabold text-[#9a6b25]">
                  {pendingRequests}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff4e5] text-2xl">
                ⏳
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#eee9df] bg-white p-5 shadow-[0_8px_25px_rgba(70,70,50,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#9aa19b]">
                  Approved
                </p>

                <p className="mt-1 text-3xl font-extrabold text-[#3e6147]">
                  {approvedRequests}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf5ed] text-2xl">
                ✓
              </div>
            </div>
          </div>
        </div>

        {/* ANIMALS */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-[#304338]">
                My Animals
              </h2>

              <p className="mt-1 text-sm text-[#7b857e]">
                View and manage animals currently in your shelter.
              </p>
            </div>
          </div>

          {animals.length === 0 && (
            <div className="rounded-2xl border border-[#eee9df] bg-white p-10 text-center shadow-[0_8px_25px_rgba(70,70,50,0.06)]">
              <div className="mb-4 text-6xl">🐕</div>

              <h3 className="text-xl font-extrabold text-[#35483b]">
                No animals yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-[#7b857e]">
                Add your first animal to start finding suitable
                adopters.
              </p>

              <Link
                to="/shelter/add-animal"
                className="mt-5 inline-block rounded-xl bg-[#6b8e72] px-6 py-3 font-extrabold text-white shadow-lg shadow-[#6b8e72]/20 transition hover:bg-[#5d7e64]"
              >
                Add Your First Animal
              </Link>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {animals.map((a) => {
              const p = predictions[a._id];

              return (
                <div
                  key={a._id}
                  className="overflow-hidden rounded-2xl border border-[#eee9df] bg-white shadow-[0_8px_25px_rgba(70,70,50,0.06)] transition hover:shadow-[0_12px_30px_rgba(70,70,50,0.10)]"
                >
                  {/* Animal image */}
                  {a.photos?.[0] ? (
                    <img
                      src={a.photos[0]}
                      alt={a.name}
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-56 w-full items-center justify-center bg-[#edf5ed] text-6xl">
                      🐾
                    </div>
                  )}

                  <div className="p-6">

                    {/* Animal info */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-2xl font-extrabold text-[#304338]">
                          {a.name}
                        </h3>

                        <p className="mt-1 text-sm text-[#7b857e]">
                          {a.species}
                          {" · "}
                          {a.size}
                          {" · "}
                          {a.ageMonths} months
                        </p>

                        <div className="mt-3">
                          <span className="inline-flex rounded-lg bg-[#edf5ed] px-3 py-1 text-xs font-bold capitalize text-[#3e6147]">
                            {a.status}
                          </span>
                        </div>
                      </div>

                      {/* Request counts */}
                      <div className="flex gap-2">
                        <div className="rounded-xl bg-[#fff4e5] px-3 py-2 text-center">
                          <p className="text-lg font-extrabold text-[#9a6b25]">
                            {count(a._id, "pending")}
                          </p>

                          <p className="text-[10px] font-bold uppercase tracking-wide text-[#9a8050]">
                            Pending
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#edf5ed] px-3 py-2 text-center">
                          <p className="text-lg font-extrabold text-[#3e6147]">
                            {count(a._id, "approved")}
                          </p>

                          <p className="text-[10px] font-bold uppercase tracking-wide text-[#66806b]">
                            Approved
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Prediction */}
                    {p?.error && (
                      <div className="mt-5 rounded-xl border border-[#ecd4cf] bg-[#fff0ee] p-4 text-sm text-[#b64e3e]">
                        ⚠️ {p.error}
                      </div>
                    )}

                    {p && !p.error && (
                      <div className="mt-5 rounded-xl border border-[#d3e3d3] bg-[#edf5ed] p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                            🤖
                          </div>

                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-[#718075]">
                              Adoption Speed Prediction
                            </p>

                            <p className="mt-1 text-lg font-extrabold text-[#3e6147]">
                              {p.label}
                            </p>
                          </div>
                        </div>

                        {p.tips?.length > 0 && (
                          <div className="mt-4">
                            <p className="mb-2 text-sm font-extrabold text-[#4d5b51]">
                              Suggestions
                            </p>

                            <ul className="space-y-2">
                              {p.tips.map((t) => (
                                <li
                                  key={t}
                                  className="flex items-start gap-2 text-sm text-[#617064]"
                                >
                                  <span className="font-bold text-[#6b8e72]">
                                    ✓
                                  </span>

                                  <span>{t}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={() => predict(a)}
                        className="flex-1 rounded-xl border border-[#6b8e72] bg-[#edf5ed] px-4 py-3 text-sm font-extrabold text-[#3e6147] transition hover:bg-[#dfeee0]"
                      >
                        🤖 Predict Adoption Speed
                      </button>

                      <button
                        onClick={() => remove(a._id)}
                        className="rounded-xl border border-[#ecd4cf] bg-[#fff0ee] px-5 py-3 text-sm font-extrabold text-[#b64e3e] transition hover:bg-[#ffe5e1]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ADOPTION REQUESTS */}
        <section className="mt-12">
          <div className="mb-5">
            <h2 className="text-2xl font-extrabold text-[#304338]">
              Adoption Requests
            </h2>

            <p className="mt-1 text-sm text-[#7b857e]">
              Review and respond to people interested in your animals.
            </p>
          </div>

          {requests.length === 0 && (
            <div className="rounded-2xl border border-[#eee9df] bg-white p-10 text-center shadow-[0_8px_25px_rgba(70,70,50,0.06)]">
              <div className="mb-4 text-5xl">💌</div>

              <h3 className="text-xl font-extrabold text-[#35483b]">
                No requests yet
              </h3>

              <p className="mt-2 text-sm text-[#7b857e]">
                Adoption requests from potential adopters will
                appear here.
              </p>
            </div>
          )}

          <div className="space-y-5">
            {requests.map((r) => {
              const style =
                statusStyles[r.status] ||
                statusStyles.pending;

              return (
                <div
                  key={r._id}
                  className="rounded-2xl border border-[#eee9df] bg-white p-5 shadow-[0_8px_25px_rgba(70,70,50,0.06)] transition hover:shadow-[0_12px_30px_rgba(70,70,50,0.10)] sm:p-6"
                >
                  {/* Request header */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-4">

                      {/* Animal image */}
                      {r.animal?.photos?.[0] ? (
                        <img
                          src={r.animal.photos[0]}
                          alt={r.animal?.name || "Animal"}
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#edf5ed] text-3xl">
                          🐾
                        </div>
                      )}

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-[#9aa19b]">
                          Adoption Request
                        </p>

                        <h3 className="mt-1 text-lg font-extrabold text-[#304338]">
                          {r.adopter?.name || "Unknown adopter"}
                        </h3>

                        <p className="text-sm text-[#7b857e]">
                          {r.adopter?.email}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div
                      className={`flex w-fit items-center gap-2 rounded-xl border px-3 py-2 ${style.bg} ${style.border}`}
                    >
                      <span className={style.text}>
                        {style.icon}
                      </span>

                      <span
                        className={`text-xs font-extrabold capitalize ${style.text}`}
                      >
                        {r.status}
                      </span>
                    </div>
                  </div>

                  {/* Animal requested */}
                  <div className="mt-5 rounded-xl bg-[#fff9f0] px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#9aa19b]">
                      Interested in
                    </p>

                    <p className="mt-1 font-extrabold text-[#4d5b51]">
                      🐾 {r.animal?.name || "Unknown animal"}
                    </p>
                  </div>

                  {/* Message */}
                  {r.message && (
                    <div className="mt-4 rounded-xl border border-[#eee9df] bg-[#fffdfa] p-4">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#9aa19b]">
                        Message from adopter
                      </p>

                      <p className="text-sm italic leading-6 text-[#617064]">
                        "{r.message}"
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  {r.status === "pending" && (
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={() =>
                          decide(r._id, "approved")
                        }
                        className="flex-1 rounded-xl bg-[#6b8e72] px-5 py-3 font-extrabold text-white shadow-lg shadow-[#6b8e72]/20 transition hover:-translate-y-0.5 hover:bg-[#5d7e64]"
                      >
                        ✓ Approve Request
                      </button>

                      <button
                        onClick={() =>
                          decide(r._id, "rejected")
                        }
                        className="flex-1 rounded-xl border border-[#ecd4cf] bg-[#fff0ee] px-5 py-3 font-extrabold text-[#b64e3e] transition hover:bg-[#ffe5e1]"
                      >
                        ✕ Reject Request
                      </button>
                    </div>
                  )}

                  {/* Already processed */}
                  {r.status === "approved" && (
                    <div className="mt-5 rounded-xl bg-[#edf5ed] px-4 py-3 text-sm font-semibold text-[#3e6147]">
                      ✓ This adoption request has been approved.
                    </div>
                  )}

                  {r.status === "rejected" && (
                    <div className="mt-5 rounded-xl bg-[#fff0ee] px-4 py-3 text-sm font-semibold text-[#b64e3e]">
                      This adoption request has been rejected.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}