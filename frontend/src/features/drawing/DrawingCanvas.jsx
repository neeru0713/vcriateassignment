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
  const wrapperRef = useRef(); // New ref for the wrapper div
  const [startPos, setStartPos] = useState(null);
  const [resizing, setResizing] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement.tagName;
      if (
        activeTag === "INPUT" ||
        activeTag === "TEXTAREA" ||
        e.ctrlKey ||
        e.metaKey
      )
        return;

      if ((e.key === "Delete" || e.key === "Backspace") && selectedShapeIndex !== null) {
        
        e.preventDefault();
        if (selectedShapeIndex >= 0 && selectedShapeIndex < shapes.length) {
          dispatch(deleteShape(selectedShapeIndex));
          dispatch(selectShape(null));
        }
      }
    };

    const current = wrapperRef.current;
    current?.addEventListener("keydown", handleKeyDown);

    return () => current?.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, selectedShapeIndex, shapes.length]);

  const handleMouseDown = (e, index = null) => {
    wrapperRef.current?.focus(); // Ensure focus on click
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (index !== null) {
      dispatch(selectShape(index));
      setStartPos({ index, x, y });
    } else {
      if (tool) {
        dispatch(selectShape(null));
        const newShape = createShape(tool, x, y);
        if (newShape) dispatch(addShape(newShape));
        dispatch(setTool(null));
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

    if (resizing) {
      const dx = x - resizing.x;
      const dy = y - resizing.y;
      dispatch(
        resizeShape({
          index: resizing.index,
          dx,
          dy,
          handleIndex: resizing.handleIndex,
        })
      );
      setResizing({ ...resizing, x, y });
    } else if (startPos) {
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
    switch (shape.type) {
      case "rectangle": {
        const { x, y, width, height } = shape.coords;
        return [{ cx: x + width, cy: y + height }];
      }
      case "ellipse": {
        const { cx, cy, rx, ry } = shape.coords;
        return [
          { cx: cx + rx, cy },
          { cx, cy: cy + ry },
        ];
      }
      case "circle": {
        const { cx, cy, r } = shape.coords;
        return [{ cx: cx + r, cy }];
      }
      case "line": {
        const { x2, y2 } = shape.coords;
        return [{ cx: x2, cy: y2 }];
      }
      case "diagonal": {
        return shape.coords.points.map((p) => ({ cx: p.x, cy: p.y }));
      }
      default:
        return [];
    }
  };

  const createShape = (tool, x, y) => {
    switch (tool) {
      case "rectangle":
        return {
          type: "rectangle",
          coords: { x, y, width: 100, height: 60 },
          annotation: { label: "W:100 H:60" },
        };
      case "circle":
        return {
          type: "circle",
          coords: { cx: x, cy: y, r: 40 },
          annotation: { label: "R:40" },
        };
      case "ellipse":
        return {
          type: "ellipse",
          coords: { cx: x, cy: y, rx: 60, ry: 30 },
          annotation: { label: "RX:60 RY:30" },
        };
      case "line":
        return {
          type: "line",
          coords: { x1: x, y1: y, x2: x + 80, y2: y + 40 },
          annotation: { label: "L:~89" },
        };
      case "diagonal":
        return {
          type: "diagonal",
          coords: {
            points: [
              { x, y },
              { x: x + 100, y: y + 20 },
              { x: x + 100, y: y + 70 },
              { x, y: y + 50 },
            ],
          },
          annotation: { label: "Diagonal" },
        };
      default:
        return null;
    }
  };

  return (
    <div
      ref={wrapperRef}
      tabIndex={0}
      className="outline-none"
      onMouseDown={() => wrapperRef.current?.focus()}
    >
      <svg
        ref={svgRef}
        onMouseDown={(e) => {
          if (e.target === svgRef.current) handleMouseDown(e);
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

          const renderHandles = () =>
            isSelected &&
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
            ));

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
                  {renderHandles()}
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
                  {renderHandles()}
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
                  {renderHandles()}
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
                  {renderHandles()}
                </g>
              );
            case "diagonal":
              return (
                <g key={idx}>
                  <polygon
                    points={shape.coords.points
                      .map((p) => `${p.x},${p.y}`)
                      .join(" ")}
                    {...commonProps}
                  />
                  {viewAnnotations && (
                    <text
                      x={shape.coords.points[0].x}
                      y={shape.coords.points[0].y - 5}
                    >
                      {shape.annotation.label}
                    </text>
                  )}
                  {renderHandles()}
                </g>
              );
            default:
              return null;
          }
        })}
      </svg>
    </div>
  );
};

export default DrawingCanvas;
