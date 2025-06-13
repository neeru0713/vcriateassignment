import React, { useState } from "react";
import Toolbar from "./components/Toolbar";
import DrawingCanvas from "./features/drawing/DrawingCanvas";
import DrawingManager from "./features/drawing/DrawingManager"; // updated component

const App = () => {
  const [selectedDrawing, setSelectedDrawing] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">🏗️ Building Planner</h1>
      <Toolbar />

      <div className="flex gap-4 mt-4">
        <div className="w-64">
          <DrawingManager onSelect={setSelectedDrawing} />
        </div>
        <div className="flex-1">
          <DrawingCanvas loadedDrawing={selectedDrawing} />
        </div>
      </div>
    </div>
  );
};

export default App;
