

import { useEffect, useState } from "react";
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

export default function MyRequests() {
  const [list, setList] = useState([]);

  useEffect(() => {
    api
      .get("/requests/mine")
      .then((r) => setList(r.data));
  }, []);

  return (
    <div className="min-h-screen bg-[#fff9f0] px-4 py-10 font-sans text-[#35423a] md:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#6b8e72] text-2xl shadow-lg shadow-[#6b8e72]/20">
              🐾
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-[#304338]">
                My Adoption Requests
              </h1>

              <p className="mt-1 text-sm text-[#7b857e]">
                Keep track of the animals you've requested to adopt.
              </p>
            </div>
          </div>

          {/* Request count */}
          {list.length > 0 && (
            <div className="mt-5 rounded-xl border border-[#d3e3d3] bg-[#edf5ed] px-4 py-3 text-sm text-[#617064]">
              🐾 You have{" "}
              <strong className="text-[#3e6147]">
                {list.length}
              </strong>{" "}
              adoption request{list.length !== 1 ? "s" : ""}.
            </div>
          )}
        </div>

        {/* Empty state */}
        {list.length === 0 && (
          <div className="rounded-2xl border border-[#eee9df] bg-white p-10 text-center shadow-[0_8px_25px_rgba(70,70,50,0.06)]">
            <div className="mb-5 text-6xl">🐕</div>

            <h2 className="text-xl font-extrabold text-[#35483b]">
              No requests yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7b857e]">
              You haven't sent any adoption requests yet.
              Find an animal that matches your lifestyle and
              send them a request.
            </p>
          </div>
        )}

        {/* Request cards */}
        <div className="space-y-5">
          {list.map((r) => {
            const style =
              statusStyles[r.status] ||
              statusStyles.pending;

            return (
              <div
                key={r._id}
                className="overflow-hidden rounded-2xl border border-[#eee9df] bg-white shadow-[0_8px_25px_rgba(70,70,50,0.06)] transition hover:shadow-[0_12px_30px_rgba(70,70,50,0.10)]"
              >
                <div className="p-5 sm:p-6">

                  {/* Animal information */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">

                      {/* Animal image / fallback */}
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
                        <h2 className="text-lg font-extrabold text-[#304338]">
                          {r.animal?.name || "Unknown animal"}
                        </h2>

                        <p className="mt-1 text-sm text-[#7b857e]">
                          {r.animal?.species || "Animal"}
                          {r.animal?.breed
                            ? ` · ${r.animal.breed}`
                            : ""}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div
                      className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 ${style.bg} ${style.border}`}
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

                  {/* Divider */}
                  <div className="my-5 border-t border-[#eee9df]" />

                  {/* Request details */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#9aa19b]">
                        Request status
                      </p>

                      <p className="mt-1 font-bold capitalize text-[#4d5b51]">
                        {r.status}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#9aa19b]">
                        Sent on
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#617064]">
                        {new Date(
                          r.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Status message */}
                  <div
                    className={`mt-5 rounded-xl px-4 py-3 text-sm ${style.bg} ${style.text}`}
                  >
                    {r.status === "pending" && (
                      <>
                        ⏳ Your request has been sent to the
                        shelter. They will review it and update
                        the status.
                      </>
                    )}

                    {r.status === "approved" && (
                      <>
                        🐾 Great news! Your adoption request
                        has been approved. Please follow up
                        with the shelter for the next steps.
                      </>
                    )}

                    {r.status === "rejected" && (
                      <>
                        Thank you for your interest. This
                        request was not approved by the
                        shelter.
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}