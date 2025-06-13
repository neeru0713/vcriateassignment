import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTool, toggleAnnotations } from "../features/drawing/drawingSlice";
import {
  FaRegSquare,
  FaRegCircle,
  FaRegEdit,
  FaSlash,
  FaDrawPolygon,
  FaRegEye,
} from "react-icons/fa";
import { PiDotsSix } from "react-icons/pi";
import { TbOval } from "react-icons/tb";


const tools = [
  { name: "Rectangle", tool: "rectangle", icon: <FaRegSquare /> },
  { name: "Circle", tool: "circle", icon: <FaRegCircle /> },
  { name: "Ellipse", tool: "ellipse", icon: <TbOval /> },
  { name: "Line", tool: "line", icon: <FaSlash /> },
  { name: "Diagonal", tool: "diagonal", icon: <FaDrawPolygon /> },
];

const Toolbar = () => {
  const dispatch = useDispatch();
  const toolbarRef = useRef(null);
  const handleRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 250 });
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    if (!handleRef.current.contains(e.target)) return;
    setIsDragging(true);
    const rect = toolbarRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const onMouseUp = () => setIsDragging(false);

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={toolbarRef}
      style={{ top: position.y, left: position.x }}
      className="fixed w-14 bg-gray-100 flex flex-col items-center py-4 shadow-md z-10 rounded-md cursor-pointer"
    >
      <div
        ref={handleRef}
        onMouseDown={onMouseDown}
        className="text-gray-700 mb-4 text-2xl cursor-move"
        title="Move Toolbar"
      >
        <PiDotsSix />
      </div>

      {tools.map(({ name, tool, icon }) => (
        <div key={tool} className="group relative mb-4">
          <button
            onClick={() => dispatch(setTool(tool))}
            className="text-gray-700 hover:text-black text-xl"
          >
            {icon}
          </button>
          <span className="absolute left-10 top-1 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
            {name}
          </span>
        </div>
      ))}

      <div className="group relative mt-auto mb-2">
        <button
          onClick={() => dispatch(toggleAnnotations())}
          className="text-gray-700 hover:text-black text-xl"
        >
          <FaRegEye />
        </button>
        <span className="absolute left-16 top-1 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
          Toggle Annotations
        </span>
      </div>
    </div>
  );
};

export default Toolbar;
