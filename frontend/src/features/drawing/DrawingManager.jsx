import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setShapes } from "./drawingSlice";

const DrawingManager = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [drawingName, setDrawingName] = useState("");
  const [savedDrawings, setSavedDrawings] = useState([]);
  const shapes = useSelector((state) => state.drawing.shapes);
  const dispatch = useDispatch();

  const saveDrawing = async () => {
    if (!drawingName) return alert("Please enter a name for your drawing");
    try {
      const res = await fetch("http://localhost:3000/api/drawings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: drawingName, shapes }),
      });

      if (!res.ok) throw new Error("Failed to save drawing");

      setDrawingName("");
      fetchDrawings();
    } catch (err) {
      alert("Error saving drawing");
      console.error(err);
    }
  };

  const fetchDrawings = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/drawings");
      const data = await res.json();
      setSavedDrawings(data);
    } catch (err) {
      console.error("Failed to fetch drawings", err);
    }
  };

  const loadDrawing = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/drawings/${id}`);
      const data = await res.json();
      dispatch(setShapes(data.shapes));
    } catch (err) {
      console.error("Failed to load drawing", err);
    }
  };

  useEffect(() => {
    fetchDrawings();
  }, []);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-200 px-2 py-1 rounded mb-2 w-full text-left"
      >
        {isOpen ? "Hide " : "Show "}
      </button>

      {isOpen && (
        <div className="space-y-4">
          {/* Save Drawing Box */}
          <div className="bg-white shadow rounded p-4">
            <h2 className="font-semibold mb-2 ">Save New Drawing</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={drawingName}
                onChange={(e) => setDrawingName(e.target.value)}
                placeholder="Enter drawing name"
                className="border px-2 py-1 rounded w-full text-sm"
              />
              <button
                onClick={saveDrawing}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Save
              </button>
            </div>
          </div>

          {/* Drawing List Box */}
          <div className="bg-white shadow rounded p-4">
            <h2 className="font-semibold mb-2">Saved Drawings</h2>
            <ul className="space-y-1 text-sm">
              {savedDrawings.map((d) => (
                <li key={d._id} className="p-1">
                  <button
                    onClick={() => loadDrawing(d._id)}
                    className="text-blue-600 underline"
                  >
                    {d.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawingManager;
