import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import Navbar from '../Components/Navbar';

const SoilInput = () => {
   const [image, setImage] = useState(null);
   const navigate = useNavigate()

  const submit = () => {
    const fd = new FormData();
    fd.append("image", image);

    fetch("http://localhost:5000/api/analyze/analyze-soil", {
      method: "POST",
      body: fd,
    })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("soil", JSON.stringify(data));
        navigate("/soil-result")
      });
  };

  return (
    <>
      <Navbar />
      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Soil Testing</h1>

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-6 px-5 py-2 border-2 border-black rounded-xl"
        />

        <button
          onClick={submit}
          className="bg-green-600 text-white py-3 w-full rounded-lg"
        >
          Upload & Analyse
        </button>
      </div>
    </>
  );
}

export default SoilInput
