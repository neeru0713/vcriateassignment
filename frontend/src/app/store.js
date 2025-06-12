import { configureStore } from "@reduxjs/toolkit";
import drawingReducer from "../features/drawing/drawingSlice";

const store = configureStore({
  reducer: {
    drawing: drawingReducer,
  },
});

export default store; 
