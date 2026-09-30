import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const bar = { display: "flex", gap: 16, padding: "12px 24px", borderBottom: "1px solid #ddd", alignItems: "center" };

  return (
    <nav style={bar}>
      <strong>Pet Adoption</strong>
      {user?.role === "adopter" && (<>
        <Link to="/matches">My matches</Link>
        <Link to="/adopter/questionnaire">My profile</Link>
        <Link to="/my-requests">My requests</Link>
      </>)}
      {user?.role === "shelter" && (<>
        <Link to="/shelter/dashboard">Dashboard</Link>
        <Link to="/shelter/add-animal">Add animal</Link>
      </>)}
      <span style={{ marginLeft: "auto" }}>
        {user ? (<>{user.name} · <button onClick={() => { logout(); nav("/login"); }}>Log out</button></>)
               : <Link to="/login">Log in</Link>}
      </span>
    </nav>
  );
}