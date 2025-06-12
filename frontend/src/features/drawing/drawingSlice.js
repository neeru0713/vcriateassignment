import { createSlice } from "@reduxjs/toolkit";

const drawingSlice = createSlice({
  name: "drawing",
  initialState: {
    shapes: [],
    viewAnnotations: true,
    tool: "rectangle",
    selectedShapeIndex: null,
  },
  reducers: {
    setTool: (state, action) => {
      state.tool = action.payload;
    },
    selectShape: (state, action) => {
      state.selectedShapeIndex = action.payload;
    },
    addShape: (state, action) => {
      state.shapes.push(action.payload);
    },
    toggleAnnotations: (state) => {
      state.viewAnnotations = !state.viewAnnotations;
    },
    resetDrawing: (state) => {
      state.shapes = [];
    },
    deleteShape: (state, action) => {
      state.shapes.splice(action.payload, 1);
    },
    moveShape: (state, action) => {
      const { index, dx, dy } = action.payload;
      const shape = state.shapes[index];
      if (!shape) return;

      switch (shape.type) {
        case "rectangle":
          shape.coords.x += dx;
          shape.coords.y += dy;
          break;
        case "circle":
        case "ellipse":
          shape.coords.cx += dx;
          shape.coords.cy += dy;
          break;
        case "line":
          shape.coords.x1 += dx;
          shape.coords.y1 += dy;
          shape.coords.x2 += dx;
          shape.coords.y2 += dy;
          break;
      }
    },
    resizeShape: (state, action) => {
      const { index, dx, dy } = action.payload;
      const shape = state.shapes[index];
      if (!shape) return;

      if (shape.type === "rectangle") {
        shape.coords.width += dx;
        shape.coords.height += dy;
        shape.annotation.label = `W:${shape.coords.width} H:${shape.coords.height}`;
      } else if (shape.type === "ellipse") {
        shape.coords.rx += dx / 2;
        shape.coords.ry += dy / 2;
        shape.annotation.label = `RX:${shape.coords.rx} RY:${shape.coords.ry}`;
      } else if (shape.type === "circle") {
        shape.coords.r += dx; // Uniform radius increase
        shape.annotation.label = `R:${shape.coords.r}`;
      } else if (shape.type === "line") {
        shape.coords.x2 += dx;
        shape.coords.y2 += dy;
        const len = Math.round(
          Math.hypot(
            shape.coords.x2 - shape.coords.x1,
            shape.coords.y2 - shape.coords.y1
          )
        );
        shape.annotation.label = `L:~${len}`;
      }
    },
  },
});

// Don't forget to export the new reducer
export const {
  setTool,
  addShape,
  toggleAnnotations,
  resetDrawing,
  deleteShape,
  moveShape,
  selectShape,
  resizeShape, // 👈 Add this here
} = drawingSlice.actions;

export default drawingSlice.reducer;



