import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";

const CropResult = () => {
   const query = new URLSearchParams(window.location.search);
  const location = query.get("location");
  const season = query.get("season");

  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const res = await axios.post("http://localhost:5000/api/crop", {
        location,
        season,
      });
      setData(res.data);
    };
    getData();
  }, []);

  return (
    <>
      <Navbar />

      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Crop Recommendations</h1>

        {!data ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white border shadow-md p-6 rounded-lg space-y-4">
            <div>
              <h2 className="text-xl font-bold">Best Crops:</h2>
              <ul className="list-disc ml-6">
                {data.crops.map((crop, idx) => (
                  <li key={idx}>{crop}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold">Fertilizer Advice:</h2>
              <p>{data.fertilizerRecommendations}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold">Disease Risk:</h2>
              <p>{data.diseaseRisk}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold">Additional Info:</h2>
              <p>{data.additionalInfo}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CropResult
