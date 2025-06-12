import React from "react";
import Toolbar from "./components/Toolbar";
import DrawingCanvas from "./features/drawing/DrawingCanvas";

const App = () => (
  <div className="min-h-screen bg-gray-100 p-4">
    <h1 className="text-2xl font-bold mb-4">🏗️ Building Planner</h1>
    <Toolbar />
    <DrawingCanvas />
  </div>
);

export default App;
