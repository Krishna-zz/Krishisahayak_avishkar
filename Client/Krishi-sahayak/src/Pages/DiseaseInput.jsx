import React from 'react'
import Navbar from '../Components/Navbar';
import { useNavigate } from 'react-router'
import React, { useState } from "react";

const DiseaseInput = () => {
   const [image, setImage] = useState(null);

  const submit = () => {
    const fd = new FormData();
    fd.append("image", image);

    fetch("http://localhost:5000/api/disease", {
      method: "POST",
      body: fd,
    })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("disease", JSON.stringify(data));
        window.location.href = "/disease-result";
      });
  };

  return (
    <>
      <Navbar />
      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Disease Detection</h1>

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-6"
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

export default DiseaseInput
