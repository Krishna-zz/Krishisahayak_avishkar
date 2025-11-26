
import React, { useState } from "react";
import Navbar from "../Components/Navbar";

const SoilResult = () => {
  const responseData = JSON.parse(localStorage.getItem("soil"));
  const [activeTab, setActiveTab] = useState("overview");
  
  if (!responseData) {
    return (
      <>
        <Navbar />
        <div className="p-8 max-w-4xl mx-auto">
          <p className="text-lg text-gray-600">No soil analysis data found.</p>
        </div>
      </>
    );
  }

  const data = responseData.analysis;
  const confidence = (data.confidence_score * 100).toFixed(1);

  return (
    <>
      <Navbar />

      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Soil Analysis Report</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Confidence Score: <span className="font-bold text-green-600">{confidence}%</span></span>
            <span className="text-sm text-gray-500">Analysis Date: {new Date(responseData.timestamp).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b">
          {["overview", "nutrients", "crops", "fertilizer", "improvement"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold transition ${
                activeTab === tab
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Soil Characteristics Card */}
            <div className="bg-linear-to-br from-green-50 to-blue-50 p-6 rounded-lg shadow-md border-l-4 border-green-600">
              <h2 className="text-2xl font-bold mb-4 text-green-700">Soil Characteristics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded">
                  <p className="text-gray-600 text-sm">Soil Type</p>
                  <p className="text-lg font-bold">{data.soilType}</p>
                </div>
                <div className="bg-white p-4 rounded">
                  <p className="text-gray-600 text-sm">Color</p>
                  <p className="text-lg font-bold">{data.color}</p>
                </div>
                <div className="bg-white p-4 rounded">
                  <p className="text-gray-600 text-sm">Texture</p>
                  <p className="text-lg font-bold">{data.texture}</p>
                </div>
                <div className="bg-white p-4 rounded">
                  <p className="text-gray-600 text-sm">pH Level</p>
                  <p className="text-lg font-bold">{data.ph_level}</p>
                </div>
              </div>
            </div>

            {/* Key Properties */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Key Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-orange-50 p-4 rounded border-l-4 border-orange-500">
                  <p className="text-gray-600 text-sm">Organic Matter</p>
                  <p className="text-lg font-bold text-orange-700">{data.organic_matter}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                  <p className="text-gray-600 text-sm">Drainage Capacity</p>
                  <p className="text-lg font-bold text-blue-700">{data.drainage_capacity}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded border-l-4 border-purple-500">
                  <p className="text-gray-600 text-sm">Overall Assessment</p>
                  <p className="text-lg font-bold text-purple-700">Healthy & Fertile</p>
                </div>
              </div>
            </div>

            {/* Soil Deficiencies */}
            <div className="bg-green-50 p-6 rounded-lg shadow-md border-l-4 border-green-600">
              <h3 className="text-xl font-bold mb-2">Soil Health Status</h3>
              <p className="text-green-800">{data.identified_soil_deficiencies}</p>
            </div>
          </div>
        )}

        {/* NUTRIENTS TAB */}
        {activeTab === "nutrients" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-blue-700">Nutrient Levels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NutrientCard label="Nitrogen" level={data.nitrogen_level} />
                <NutrientCard label="Phosphorus" level={data.phosphorus_level} />
                <NutrientCard label="Potassium" level={data.potassium_level} />
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg shadow-md border-l-4 border-blue-600">
              <h3 className="text-xl font-bold mb-4">Recommendation</h3>
              <p className="text-gray-700 mb-4">A comprehensive laboratory soil test is recommended to get exact nutrient levels and pH for precise fertilization recommendations.</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                Schedule Soil Test
              </button>
            </div>
          </div>
        )}

        {/* CROPS TAB */}
        {activeTab === "crops" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-green-700">Recommended Crops</h2>
              <p className="text-gray-600 mb-4">This soil is suitable for growing:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.recommended_crops.map((crop, idx) => (
                  <div key={idx} className="bg-green-50 p-4 rounded border-l-4 border-green-500">
                    <p className="font-semibold text-green-800">{crop}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FERTILIZER TAB */}
        {activeTab === "fertilizer" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-orange-700">Fertilizer Recommendations</h2>
              <div className="space-y-4">
                {data.fertilizer_recommendations.map((fert, idx) => (
                  <div key={idx} className="bg-orange-50 p-4 rounded border-l-4 border-orange-500">
                    <p className="font-bold text-lg text-orange-900">{fert.nutrient}</p>
                    <p className="text-gray-700 mt-1">{fert.kg_per_acre}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 p-6 rounded-lg shadow-md border-l-4 border-amber-600">
              <h3 className="text-xl font-bold mb-3">Application Timing & Methods</h3>
              <div className="space-y-3 text-gray-700">
                {Object.entries(data.application_timing_methods).map(([key, value]) => (
                  <div key={key}>
                    <p className="font-semibold capitalize">{key.replace(/_/g, " ")}</p>
                    <p className="text-sm text-gray-600 ml-4">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* IMPROVEMENT TAB */}
        {activeTab === "improvement" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-purple-700">Improvement Suggestions</h2>
              <div className="space-y-3">
                {data.improvement_suggestions.map((suggestion, idx) => (
                  <div key={idx} className="flex gap-3 bg-purple-50 p-4 rounded">
                    <span className="text-purple-600 font-bold shrink-0">{idx + 1}.</span>
                    <p className="text-gray-700">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Long-term Plan */}
            <div className="bg-linear-to-br from-purple-50 to-pink-50 p-6 rounded-lg shadow-md border-l-4 border-purple-600">
              <h3 className="text-xl font-bold mb-4 text-purple-700">Long-term Soil Improvement Plan</h3>
              
              <div className="mb-6">
                <h4 className="font-bold text-purple-900 mb-3">Goals</h4>
                <ul className="space-y-2">
                  {data.long_term_soil_improvement_plan.goals.map((goal, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">✓</span>
                      <span className="text-gray-700">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-purple-900 mb-3">Strategies</h4>
                <ul className="space-y-2">
                  {data.long_term_soil_improvement_plan.strategies.map((strategy, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">→</span>
                      <span className="text-gray-700">{strategy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Cost-Benefit Analysis */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Cost-Benefit Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-r-2 border-green-200">
                  <h4 className="font-bold text-green-700 mb-3">Benefits</h4>
                  <ul className="space-y-2">
                    {data.cost_benefit_analysis.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex gap-2 text-sm">
                        <span className="text-green-600 font-bold">+</span>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-orange-700 mb-3">Costs</h4>
                  <ul className="space-y-2">
                    {data.cost_benefit_analysis.costs.map((cost, idx) => (
                      <li key={idx} className="flex gap-2 text-sm">
                        <span className="text-orange-600 font-bold">-</span>
                        <span className="text-gray-700">{cost}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-6 bg-green-50 p-4 rounded border-l-4 border-green-600">
                <p className="text-green-800 font-semibold">{data.cost_benefit_analysis.overall_assessment}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Helper Component for Nutrient Cards
const NutrientCard = ({ label, level }) => {
  const getLevelColor = (level) => {
    if (level.includes("High")) return "bg-green-100 border-green-500 text-green-700";
    if (level.includes("Medium")) return "bg-yellow-100 border-yellow-500 text-yellow-700";
    return "bg-red-100 border-red-500 text-red-700";
  };

  return (
    <div className={`p-4 rounded border-l-4 ${getLevelColor(level)}`}>
      <p className="text-sm font-semibold text-gray-600">{label}</p>
      <p className="text-xl font-bold mt-1">{level}</p>
    </div>
  );
};

export default SoilResult;
