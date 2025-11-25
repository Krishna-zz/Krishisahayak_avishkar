import React from 'react'
import { useNavigate } from 'react-router-dom';

function Cardbutton({ title, desc, link }) {

  const navigate = useNavigate()

   return (
    <a
      href={link}
      className="w-full md:w-1/3 p-6 bg-white rounded-xl shadow-lg border hover:scale-105 transition"
    >
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{desc}</p>
      <button className="bg-green-600 text-white px-4 py-2 rounded-lg"
              onClick={() => navigate(link)}>
        Proceed →
      </button>
    </a>
  );
}

export default Cardbutton