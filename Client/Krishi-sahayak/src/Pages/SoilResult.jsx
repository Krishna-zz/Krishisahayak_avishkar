
import React, { useState } from "react";

import Navbar from "../Components/Navbar";

const SoilResult = () => {
  const data = JSON.parse(localStorage.getItem("soil"));

  return (
    <>
      <Navbar />

      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Soil Test Result</h1>

        {!data ? (
          <p>No data found.</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-bold">Soil Type:</h2>
            <p>{data.soilType}</p>

            <h2 className="text-xl font-bold">Fertilizer Advice:</h2>
            <p>{data.fertilizerRecommendation}</p>

            <h2 className="text-xl font-bold">Irrigation Advice:</h2>
            <p>{data.irrigationAdvice}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default SoilResult
