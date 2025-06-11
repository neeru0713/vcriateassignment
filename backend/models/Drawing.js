const mongoose = require("mongoose");

const shapeSchema = new mongoose.Schema({
  type: String,
  coords: Object, 
  annotation: Object,
});

const drawingSchema = new mongoose.Schema(
  {
    name: String,
    shapes: [shapeSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drawing", drawingSchema);
