import { useSelector, useDispatch } from "react-redux";
import {
  selectShape,
  moveShape,
  addShape,
  deleteShape,
  setTool,
  resizeShape,
} from "./drawingSlice";
import { useRef, useState, useEffect } from "react";

const DrawingCanvas = () => {
  const { shapes, viewAnnotations, selectedShapeIndex, tool } = useSelector(
    (state) => state.drawing
  );
  const dispatch = useDispatch();
  const svgRef = useRef();
  const [startPos, setStartPos] = useState(null);
  const [resizing, setResizing] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete" && selectedShapeIndex !== null) {
        dispatch(deleteShape(selectedShapeIndex));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, selectedShapeIndex]);

  const handleMouseDown = (e, index = null) => {
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (index !== null) {
      // Select shape to move
      setStartPos({ x, y, index });
      dispatch(selectShape(index));
    } else if (tool) {
      // Draw new shape
      const shape = createShape(tool, x, y);
      if (shape) {
        dispatch(addShape(shape));
        dispatch(setTool(null)); // Only draw one shape per click
      }
    }
  };

  const handleResizeStart = (e, index, handleIndex) => {
    e.stopPropagation();
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setResizing({ index, x, y, handleIndex });
  };

  const handleMouseMove = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (resizing !== null) {
      const dx = x - resizing.x;
      const dy = y - resizing.y;
      dispatch(resizeShape({ index: resizing.index, dx, dy }));
      setResizing({ ...resizing, x, y });
    } else if (startPos !== null) {
      const dx = x - startPos.x;
      const dy = y - startPos.y;
      dispatch(moveShape({ index: startPos.index, dx, dy }));
      setStartPos({ ...startPos, x, y });
    }
  };

  const handleMouseUp = () => {
    setStartPos(null);
    setResizing(null);
  };

  const getResizeHandles = (shape) => {
    if (shape.type === "rectangle") {
      const { x, y, width, height } = shape.coords;
      return [{ cx: x + width, cy: y + height }];
    } else if (shape.type === "ellipse") {
      const { cx, cy, rx, ry } = shape.coords;
      return [
        { cx: cx + rx, cy },
        { cx, cy: cy + ry },
      ];
    } else if (shape.type === "circle") {
      const { cx, cy, r } = shape.coords;
      return [{ cx: cx + r, cy }];
    } else if (shape.type === "line") {
      const { x2, y2 } = shape.coords;
      return [{ cx: x2, cy: y2 }];
    }
    return [];
  };
  

  const createShape = (tool, x, y) => {
    switch (tool) {
      case "rectangle":
        return {
          type: "rectangle",
          coords: { x, y, width: 100, height: 60 },
          annotation: { label: `W:100 H:60` },
        };
      case "circle":
        return {
          type: "circle",
          coords: { cx: x, cy: y, r: 40 },
          annotation: { label: `R:40` },
        };
      case "ellipse":
        return {
          type: "ellipse",
          coords: { cx: x, cy: y, rx: 60, ry: 30 },
          annotation: { label: `RX:60 RY:30` },
        };
      case "line":
        return {
          type: "line",
          coords: { x1: x, y1: y, x2: x + 80, y2: y + 40 },
          annotation: { label: `L:~89` },
        };
      default:
        return null;
    }
  };

  return (
    <svg
      ref={svgRef}
      onMouseDown={(e) => {
        if (e.target === svgRef.current) {
          handleMouseDown(e);
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="w-full h-[80vh] border bg-white"
    >
      {shapes.map((shape, idx) => {
        const isSelected = idx === selectedShapeIndex;
        const commonProps = {
          stroke: isSelected ? "red" : "black",
          fill: "transparent",
          onMouseDown: (e) => handleMouseDown(e, idx),
          cursor: "move",
        };

        switch (shape.type) {
          case "rectangle":
            return (
              <g key={idx}>
                <rect {...shape.coords} {...commonProps} />
                {viewAnnotations && (
                  <text x={shape.coords.x} y={shape.coords.y - 5}>
                    {shape.annotation.label}
                  </text>
                )}
                {isSelected &&
                  getResizeHandles(shape).map((handle, i) => (
                    <circle
                      key={i}
                      cx={handle.cx}
                      cy={handle.cy}
                      r={6}
                      fill="blue"
                      cursor="nwse-resize"
                      onMouseDown={(e) => handleResizeStart(e, idx, i)}
                    />
                  ))}
              </g>
            );
          case "circle":
            return (
              <g key={idx}>
                <circle {...shape.coords} {...commonProps} />
                {viewAnnotations && (
                  <text x={shape.coords.cx} y={shape.coords.cy - 45}>
                    {shape.annotation.label}
                  </text>
                )}
                {isSelected &&
                  getResizeHandles(shape).map((handle, i) => (
                    <circle
                      key={i}
                      cx={handle.cx}
                      cy={handle.cy}
                      r={6}
                      fill="blue"
                      cursor="nwse-resize"
                      onMouseDown={(e) => handleResizeStart(e, idx, i)}
                    />
                  ))}
              </g>
            );
          case "ellipse":
            return (
              <g key={idx}>
                <ellipse {...shape.coords} {...commonProps} />
                {viewAnnotations && (
                  <text x={shape.coords.cx} y={shape.coords.cy - 35}>
                    {shape.annotation.label}
                  </text>
                )}
                {isSelected &&
                  getResizeHandles(shape).map((handle, i) => (
                    <circle
                      key={i}
                      cx={handle.cx}
                      cy={handle.cy}
                      r={6}
                      fill="blue"
                      cursor="nwse-resize"
                      onMouseDown={(e) => handleResizeStart(e, idx, i)}
                    />
                  ))}
              </g>
            );
          case "line":
            return (
              <g key={idx}>
                <line {...shape.coords} {...commonProps} />
                {viewAnnotations && (
                  <text x={shape.coords.x1} y={shape.coords.y1 - 5}>
                    {shape.annotation.label}
                  </text>
                )}
                {isSelected &&
                  getResizeHandles(shape).map((handle, i) => (
                    <circle
                      key={i}
                      cx={handle.cx}
                      cy={handle.cy}
                      r={6}
                      fill="blue"
                      cursor="nwse-resize"
                      onMouseDown={(e) => handleResizeStart(e, idx, i)}
                    />
                  ))}
              </g>
            );
          default:
            return null;
        }
      })}
    </svg>
  );
};

export default DrawingCanvas;
