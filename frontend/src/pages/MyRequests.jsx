import { useEffect, useState } from "react";
import api from "../api";

const colors = { pending: "#b7791f", approved: "#2f855a", rejected: "#c53030" };

export default function MyRequests() {
  const [list, setList] = useState([]);
  useEffect(() => { api.get("/requests/mine").then((r) => setList(r.data)); }, []);

  return (
    <div style={{ maxWidth: 640, margin: "2rem auto" }}>
      <h2>My adoption requests</h2>
      {list.length === 0 && <p>No requests yet. Find an animal in your matches.</p>}
      {list.map((r) => (
        <div key={r._id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <strong>{r.animal?.name}</strong> ({r.animal?.species}) ·{" "}
          <span style={{ color: colors[r.status], fontWeight: 600 }}>{r.status}</span>
          <div style={{ color: "#666", fontSize: 13 }}>Sent {new Date(r.createdAt).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  );
}