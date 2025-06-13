// src/components/DrawingList.js
import React, { useEffect, useState } from "react";

const DrawingList = ({ onSelect }) => {
  const [drawings, setDrawings] = useState([]);

  useEffect(() => {
    fetch("https://vcriateassignment.onrender.com/api/drawings")
      .then((res) => res.json())
      .then((data) => setDrawings(data))
      .catch((err) => console.error("Failed to fetch drawings:", err));
  }, []);

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold">Saved Drawings</h2>
      <ul className="mt-2 space-y-2">
        {drawings.map((drawing) => (
          <li key={drawing._id}>
            <button
              className="bg-white shadow px-3 py-1 rounded hover:bg-gray-200 text-left w-full"
              onClick={() => onSelect(drawing)}
            >
              {drawing.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DrawingList;
