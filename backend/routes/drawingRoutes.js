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

router.get("/:id", async (req, res) => {
  try {
    const drawing = await Drawing.findById(req.params.id);
    if (!drawing) {
      return res.status(404).json({ message: "Drawing not found" });
    }
    res.json(drawing);
  } catch (err) {
    res.status(500).json({ message: "Error fetching drawing", error: err });
  }
});



module.exports = router;
