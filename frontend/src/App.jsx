import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdopterQuestionnaire from "./pages/AdopterQuestionnaire";
import Matches from "./pages/Matches";
import MyRequests from "./pages/MyRequests";
import ShelterDashboard from "./pages/ShelterDashboard";
import AddAnimal from "./pages/AddAnimal";

function Home() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "shelter" ? "/shelter/dashboard" : "/matches"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/adopter/questionnaire" element={<ProtectedRoute role="adopter"><AdopterQuestionnaire /></ProtectedRoute>} />
          <Route path="/matches" element={<ProtectedRoute role="adopter"><Matches /></ProtectedRoute>} />
          <Route path="/my-requests" element={<ProtectedRoute role="adopter"><MyRequests /></ProtectedRoute>} />

          <Route path="/shelter/dashboard" element={<ProtectedRoute role="shelter"><ShelterDashboard /></ProtectedRoute>} />
          <Route path="/shelter/add-animal" element={<ProtectedRoute role="shelter"><AddAnimal /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
  


