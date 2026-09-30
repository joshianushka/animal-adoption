import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const colors = { pending: "#b7791f", approved: "#2f855a", rejected: "#c53030" };

export default function ShelterDashboard() {
  const [animals, setAnimals] = useState([]);
  const [requests, setRequests] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [a, r] = await Promise.all([api.get("/animals/mine"), api.get("/requests/shelter")]);
      setAnimals(a.data);
      setRequests(r.data);
    } catch (e) {
      setError(e.response?.data?.message || "Could not load dashboard");
    }
  };
  useEffect(() => { load(); }, []);

  const predict = async (animal) => {
    try {
      const { data } = await api.post("/animals/predict-speed", animal);
      setPredictions((p) => ({ ...p, [animal._id]: data }));
    } catch (e) {
      setPredictions((p) => ({ ...p, [animal._id]: { error: e.response?.data?.message || "Prediction failed" } }));
    }
  };
  const decide = async (id, status) => {
    try { await api.patch(`/requests/${id}`, { status }); load(); }
    catch (e) { alert(e.response?.data?.message || "Failed"); }
  };
  const remove = async (id) => {
    if (window.confirm("Delete this animal?")) { await api.delete(`/animals/${id}`); load(); }
  };
  const count = (animalId, status) =>
    requests.filter((r) => r.animal?._id === animalId && r.status === status).length;

  if (error) return <p style={{ textAlign: "center" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h2>My animals</h2>
      {animals.length === 0 && <p>No animals yet. <Link to="/shelter/add-animal">Add your first one</Link>.</p>}

      {animals.map((a) => {
        const p = predictions[a._id];
        return (
          <div key={a._id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 14, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <strong>{a.name}</strong> · {a.species} · {a.size} · {a.ageMonths} months
                <div style={{ color: "#666", fontSize: 13 }}>
                  Status: <strong>{a.status}</strong> · Requests: {count(a._id, "pending")} pending, {count(a._id, "approved")} approved
                </div>
              </div>
              <div>
                <button onClick={() => predict(a)}>Predict adoption speed</button>{" "}
                <button onClick={() => remove(a._id)}>Delete</button>
              </div>
            </div>
            {p?.error && <p style={{ color: "crimson" }}>{p.error}</p>}
            {p && !p.error && (
              <div style={{ background: "#f5f9ff", padding: 8, borderRadius: 6, marginTop: 8 }}>
                Predicted: <strong>{p.label}</strong>
                {p.tips.length > 0 && (<ul style={{ margin: "4px 0" }}>{p.tips.map((t) => <li key={t}>{t}</li>)}</ul>)}
              </div>
            )}
          </div>
        );
      })}

      <h2 style={{ marginTop: 32 }}>Adoption requests</h2>
      {requests.length === 0 && <p>No requests yet.</p>}
      {requests.map((r) => (
        <div key={r._id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 14, marginBottom: 12 }}>
          <strong>{r.adopter?.name}</strong> ({r.adopter?.email}) wants <strong>{r.animal?.name}</strong> ·{" "}
          <span style={{ color: colors[r.status], fontWeight: 600 }}>{r.status}</span>
          {r.message && <p style={{ margin: "6px 0" }}>"{r.message}"</p>}
          {r.status === "pending" && (
            <>
              <button onClick={() => decide(r._id, "approved")}>Approve</button>{" "}
              <button onClick={() => decide(r._id, "rejected")}>Reject</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}