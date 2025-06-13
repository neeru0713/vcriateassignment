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
      state.selectedShapeIndex = null;
    },
    deleteShape: (state, action) => {
      const index = action.payload;
      if (index >= 0 && index < state.shapes.length) {
        state.shapes.splice(index, 1);

        // Adjust selected index
        if (state.selectedShapeIndex === index) {
          state.selectedShapeIndex = null;
        } else if (state.selectedShapeIndex > index) {
          state.selectedShapeIndex -= 1;
        }
      }
    },

    loadShapes: (state, action) => {
      state.shapes = action.payload;
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
        case "diagonal":
          shape.coords.points = shape.coords.points.map((p) => ({
            x: p.x + dx,
            y: p.y + dy,
          }));
          break;
      }
    },

    setShapes: (state, action) => {
      state.shapes = action.payload;
    },

    resizeShape: (state, action) => {
      const { index, dx, dy, handleIndex } = action.payload;
      const shape = state.shapes[index];
      if (!shape) return;

      switch (shape.type) {
        case "rectangle":
          shape.coords.width += dx;
          shape.coords.height += dy;
          shape.annotation.label = `W:${shape.coords.width} H:${shape.coords.height}`;
          break;
        case "ellipse":
          shape.coords.rx += dx / 2;
          shape.coords.ry += dy / 2;
          shape.annotation.label = `RX:${shape.coords.rx} RY:${shape.coords.ry}`;
          break;
        case "circle":
          shape.coords.r += dx;
          shape.annotation.label = `R:${shape.coords.r}`;
          break;
        case "line":
          shape.coords.x2 += dx;
          shape.coords.y2 += dy;
          const len = Math.round(
            Math.hypot(
              shape.coords.x2 - shape.coords.x1,
              shape.coords.y2 - shape.coords.y1
            )
          );
          shape.annotation.label = `L:~${len}`;
          break;
        case "diagonal":
          if (handleIndex != null) {
            const point = shape.coords.points[handleIndex];
            point.x += dx;
            point.y += dy;
            const [p1, p2] = shape.coords.points;
            const diagLen = Math.round(Math.hypot(p2.x - p1.x, p2.y - p1.y));
            shape.annotation.label = `L:~${diagLen}`;
          }
          break;
      }
    },
  },
});

export const {
  setTool,
  addShape,
  toggleAnnotations,
  resetDrawing,
  deleteShape,
  loadShapes,
  setShapes,
  moveShape,
  selectShape,
  resizeShape,
} = drawingSlice.actions;

export default drawingSlice.reducer;
