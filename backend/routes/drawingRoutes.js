const express = require("express");
const Drawing = require("../models/Drawing");
const router = express.Router();

router.post("/", async (req, res) => {
  const drawing = new Drawing(req.body);
  const saved = await drawing.save();
  res.json(saved);
});

router.get("/", async (req, res) => {
  const drawings = await Drawing.find();
  res.json(drawings);
});

module.exports = router;
