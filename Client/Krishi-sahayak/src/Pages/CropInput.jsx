import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../Components/Navbar'


const CropInput = () => {
    const [location, setLocation] = useState("");
  const [season, setSeason] = useState("summer");

  const navigate = useNavigate()

  const handleSubmit = () => {
   navigate(`/crop-result?location=${location}&season=${season}`);
  };

  return (
    <>
      <Navbar />
      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Location-Based Crop Advisory</h1>

        <label className="text-lg font-semibold">Enter Location:</label>
        <input
          className="w-full border p-3 rounded-lg mb-4"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <label className="text-lg font-semibold">Select Season:</label>
        <select
          className="w-full border p-3 rounded-lg mb-6"
          onChange={(e) => setSeason(e.target.value)}
        >
          <option value="summer">Summer</option>
          <option value="rainy">Rainy</option>
          <option value="winter">Winter</option>
        </select>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-3 rounded-lg"
        >
          Get Recommendation
        </button>
      </div>
    </>
  );
}

export default CropInput
