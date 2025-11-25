import React from 'react'
import Navbar from '../Components/Navbar';

const DiseaseResult = () => {
    const data = JSON.parse(localStorage.getItem("disease"));

  return (
    <>
      <Navbar />

      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Disease Detection Result</h1>

        {!data ? (
          <p>No data found.</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-bold">Detected Disease:</h2>
            <p>{data.label}</p>

            <h2 className="text-xl font-bold">Confidence:</h2>
            <p>{data.confidence}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default DiseaseResult
