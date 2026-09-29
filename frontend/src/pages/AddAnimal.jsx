import { useState } from "react";
import api from "../services/api";
//import axios from "axios";

const AddAnimal = () => {
  const [formData, setFormData] = useState({
    name: "",
    species: "dog",
    age: "",
    gender: "male",
    size: "medium",
    energyLevel: "medium",
    temperament: "friendly",
    goodWithChildren: false,
    goodWithDogs: false,
    goodWithCats: false,
    trainingLevel: "none",
    medicalNeeds: "low",
    adoptionStatus: "available",
    photo: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/animals", {
        ...formData,
        age: Number(formData.age),
      });

      alert("Animal added successfully!");

      setFormData({
        name: "",
        species: "dog",
        age: "",
        gender: "male",
        size: "medium",
        energyLevel: "medium",
        temperament: "friendly",
        goodWithChildren: false,
        goodWithDogs: false,
        goodWithCats: false,
        trainingLevel: "none",
        medicalNeeds: "low",
        adoptionStatus: "available",
        photo: "",
      });
    } catch (error) {
      console.error("Error adding animal:", error);
      alert("Failed to add animal");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">

        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Add Animal
          </h1>

          <p className="mt-2 text-gray-600">
            Add an animal to the shelter database.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-md"
        >

          {/* ================= BASIC INFORMATION ================= */}

          <div className="mb-8">
            <h2 className="mb-5 text-xl font-semibold text-gray-800">
              Basic Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Bruno"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Species */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Species
                </label>

                <select
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Age */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Age (years)
                </label>

                <input
                  type="number"
                  name="age"
                  min="0"
                  placeholder="e.g. 4"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

            </div>
          </div>


          {/* ================= CHARACTERISTICS ================= */}

          <div className="mb-8 border-t border-gray-200 pt-8">

            <h2 className="mb-5 text-xl font-semibold text-gray-800">
              Characteristics
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Size */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Size
                </label>

                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              {/* Energy Level */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Energy Level
                </label>

                <select
                  name="energyLevel"
                  value={formData.energyLevel}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Temperament */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Temperament
                </label>

                <select
                  name="temperament"
                  value={formData.temperament}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="calm">Calm</option>
                  <option value="friendly">Friendly</option>
                  <option value="playful">Playful</option>
                  <option value="shy">Shy</option>
                  <option value="energetic">Energetic</option>
                </select>
              </div>

              {/* Training Level */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Training Level
                </label>

                <select
                  name="trainingLevel"
                  value={formData.trainingLevel}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="none">No training</option>
                  <option value="basic">Basic</option>
                  <option value="trained">Trained</option>
                </select>
              </div>

              {/* Medical Needs */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Medical Needs
                </label>

                <select
                  name="medicalNeeds"
                  value={formData.medicalNeeds}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

            </div>
          </div>


          {/* ================= COMPATIBILITY ================= */}

          <div className="mb-8 border-t border-gray-200 pt-8">

            <h2 className="mb-5 text-xl font-semibold text-gray-800">
              Compatibility
            </h2>

            <div className="space-y-3">

              {/* Children */}
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50">

                <input
                  type="checkbox"
                  name="goodWithChildren"
                  checked={formData.goodWithChildren}
                  onChange={handleChange}
                  className="h-4 w-4"
                />

                <span className="text-gray-700">
                  Good with children
                </span>

              </label>


              {/* Dogs */}
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50">

                <input
                  type="checkbox"
                  name="goodWithDogs"
                  checked={formData.goodWithDogs}
                  onChange={handleChange}
                  className="h-4 w-4"
                />

                <span className="text-gray-700">
                  Good with dogs
                </span>

              </label>


              {/* Cats */}
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50">

                <input
                  type="checkbox"
                  name="goodWithCats"
                  checked={formData.goodWithCats}
                  onChange={handleChange}
                  className="h-4 w-4"
                />

                <span className="text-gray-700">
                  Good with cats
                </span>

              </label>

            </div>
          </div>


          {/* ================= ADOPTION INFORMATION ================= */}

          <div className="mb-8 border-t border-gray-200 pt-8">

            <h2 className="mb-5 text-xl font-semibold text-gray-800">
              Adoption Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Adoption Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Adoption Status
                </label>

                <select
                  name="adoptionStatus"
                  value={formData.adoptionStatus}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="adopted">Adopted</option>
                </select>
              </div>


              {/* Photo URL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Photo URL
                </label>

                <input
                  type="text"
                  name="photo"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.photo}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>
          </div>


          {/* ================= SUBMIT ================= */}

          <div className="border-t border-gray-200 pt-6">

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Add Animal
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default AddAnimal;

