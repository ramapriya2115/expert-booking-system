const express = require("express");
const router = express.Router();
const Expert = require("../models/Expert");

// GET all experts
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 5, category, search } = req.query;

    const query = {};
// GET single expert by ID
router.get("/:id", async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    res.json(expert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search by name (case-insensitive)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const experts = await Expert.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Expert.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      experts
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new expert
router.post("/", async (req, res) => {
  try {
    const expert = new Expert(req.body);
    const savedExpert = await expert.save();
    res.status(201).json(savedExpert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;