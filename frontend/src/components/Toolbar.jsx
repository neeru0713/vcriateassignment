import React from "react";
import { useDispatch } from "react-redux";
import { setTool, toggleAnnotations } from "../features/drawing/drawingSlice";

const Toolbar = () => {
  const dispatch = useDispatch();

  const selectTool = (tool) => {
    dispatch(setTool(tool));
  };

  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => dispatch(setTool("rectangle"))}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Rectangle
      </button>

      <button
        onClick={() => selectTool("circle")}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Circle
      </button>
      <button
        onClick={() => selectTool("ellipse")}
        className="px-4 py-2 bg-yellow-500 text-black rounded"
      >
        Ellipse
      </button>
      <button
        onClick={() => selectTool("line")}
        className="px-4 py-2 bg-purple-500 text-white rounded"
      >
        Line
      </button>
      <button
        onClick={() => dispatch(toggleAnnotations())}
        className="px-4 py-2 bg-gray-500 text-white rounded"
      >
        Toggle Annotations
      </button>
    </div>
  );
};

export default Toolbar;
