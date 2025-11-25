import React from 'react'
import Navbar from '../Components/Navbar'
import { useNavigate } from 'react-router';

function Homepage() {

    const navigate = useNavigate()

    const GotoDashboard = () => {
        navigate("/dashboard")
    }

  return (
    <>
      <Navbar />
      <div className="h-[90vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl font-bold mb-4 text-green-700">
          Smart AI Farming Assistant
        </h1>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl">
          Get real-time, location-based crop guidance, disease detection, and soil health analysis.
        </p>
         <button
          onClick={GotoDashboard}
          className="px-8 py-3 bg-green-600 text-white text-lg rounded-lg shadow-md hover:bg-green-700"
        >
          Go to Dashboard
        </button>
      </div>
    </>
  );
}

export default Homepage