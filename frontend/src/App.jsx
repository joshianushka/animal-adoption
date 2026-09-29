import { Routes, Route, Navigate } from "react-router-dom";
import AddAnimal from "./pages/AddAnimal";
import AdopterQuestionnaire from "./pages/AdopterQuestionnaire";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/add-animal" />} />
      <Route path="/adopter/questionnaire" element={<AdopterQuestionnaire />} />
      <Route path="/add-animal" element={<AddAnimal/>} />
    </Routes>
  );
  
}

export default App;