import { Routes, Route, Navigate } from "react-router-dom";
import AddAnimal from "./pages/AddAnimal";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/add-animal" />} />

      <Route path="/add-animal" element={<AddAnimal/>} />
    </Routes>
  );
  
}

export default App;