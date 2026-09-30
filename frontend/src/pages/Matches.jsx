import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const label = (score) =>
  score >= 80 ? "Great match" : score >= 60 ? "Good match" : "Worth a look";

function MatchCard({ match }) {
  const { animal, score, blocked, block_reasons, why, concerns } = match;
  const [reqStatus, setReqStatus] = useState(match.requestStatus);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  if (!animal) return null;

  const sendRequest = async () => {
    try {
      await api.post("/requests", { animalId: match.animalId, message });
      setReqStatus("pending");
      setNote("");
    } catch (err) {
      setNote(err.response?.data?.message || "Could not send request");
    }
  };

  return (
    <div style={{
      border: "1px solid #ddd", borderRadius: 12, padding: 16, marginBottom: 16,
      opacity: blocked ? 0.75 : 1,
    }}>
      <div style={{ display: "flex", gap: 16 }}>
        {animal.photos?.[0] && (
          <img src={animal.photos[0]} alt={animal.name}
            style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8 }} />
        )}
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0 }}>{animal.name}</h3>
          <p style={{ margin: "4px 0", color: "#666" }}>
            {animal.breed || animal.species} · {animal.size} · {Math.floor(animal.ageMonths / 12)}y {animal.ageMonths % 12}m
          </p>
          <strong>{blocked ? "Check compatibility" : label(score)}</strong>
        </div>
      </div>

      {blocked && (
        <div style={{ background: "#fff4e5", padding: 8, borderRadius: 6, marginTop: 12 }}>
          ⚠️ {block_reasons.join(". ")}. Ask the shelter for details before deciding.
        </div>
      )}

      {why.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <strong>Why it fits</strong>
          <ul style={{ margin: "4px 0" }}>{why.map((w) => <li key={w}>{w}</li>)}</ul>
        </div>
      )}
      {concerns.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <strong>Things to consider</strong>
          <ul style={{ margin: "4px 0" }}>{concerns.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        {reqStatus ? (
          <strong>Adoption request: {reqStatus}</strong>
        ) : (
          <>
            <input
              placeholder="Optional message to the shelter"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ width: "70%", marginRight: 8 }}
            />
            <button onClick={sendRequest}>Request adoption</button>
          </>
        )}
        {note && <p style={{ color: "crimson" }}>{note}</p>}
      </div>
    </div>
  );
}

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/matches/me")
      .then((res) => {
        setMatches(res.data);
        setState("done");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Could not load matches");
        setState("error");
      });
  }, []);

  if (state === "loading") return <p style={{ textAlign: "center" }}>Finding your matches...</p>;

  if (state === "error") {
    return (
      <p style={{ textAlign: "center" }}>
        {error}{" "}
        {error.includes("questionnaire") && <Link to="/adopter/questionnaire">Fill it in here</Link>}
      </p>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: "2rem auto" }}>
      <h2>Your matches</h2>
      {matches.length === 0 && <p>No animals available right now.</p>}
      {matches.map((m) => <MatchCard key={m.animalId} match={m} />)}
    </div>
  );
}