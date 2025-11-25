import React from 'react'
import Navbar from '../Components/Navbar'
import Cardbutton from '../Components/Cardbutton';

const Dashboard = () => {
   return (
    <>
      <Navbar />

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">
          Choose a Service
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          <Cardbutton
            title="Location-Based Crop Advice"
            desc="Enter your location & season to get the best crop recommendations."
            link="/crop-input"
          />

          <Cardbutton
            title="Disease Detection"
            desc="Upload a leaf image to identify plant diseases instantly."
            link="/disease-input"
          />

          <Cardbutton
            title="Soil Testing"
            desc="Upload a soil image to analyse soil type & fertilizer needs."
            link="/soil-input"
          />
        </div>
      </div>
    </>
  );
}

export default Dashboard