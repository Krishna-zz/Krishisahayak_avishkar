import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar';

const DiseaseResult = () => {
  const [diseaseData, setDiseaseData] = useState()

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("disease"));

    console.log(data)

    setDiseaseData(data)
  },[])
    


    useEffect(() => {

console.log(diseaseData)

    },[diseaseData])

  return (
    <>
      <Navbar />

      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Disease Detection Result</h1>

        {!diseaseData ? (
          <p>No data found.</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-bold">Detected Disease:</h2>
            <p>{diseaseData.analysis?.disease_name || 'No disease detected'}</p>

            <h2 className="text-xl font-bold">Confidence:</h2>
            <p>{(diseaseData.analysis?.confidence_score * 100).toFixed(2)}%</p>

            <h2 className="text-xl font-bold">Severity:</h2>
            <p>{diseaseData.analysis?.severity || 'N/A'}</p>

            <h2 className="text-xl font-bold">Symptoms:</h2>
            <ul className="list-disc pl-5">
              {diseaseData.analysis?.symptoms_observed?.map((symptom, idx) => (
                <li key={idx}>{symptom}</li>
              ))}
            </ul>

            <h2 className="text-xl font-bold">Treatment:</h2>
            <ul className="list-disc pl-5">
              {diseaseData.analysis?.organic_treatment?.map((treatment, idx) => (
                <li key={idx}>{treatment}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default DiseaseResult
