const express = require("express");
const FAQ = require("../models/FAQ");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create FAQ
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { question, answer, category } = req.body;

    if (!question || !answer || !category) {
      return res.status(400).json({
        message: "Question, answer and category are required"
      });
    }

    const faq = await FAQ.create({
      question,
      answer,
      category,
      createdBy: req.user.userId
    });

    res.status(201).json({
      message: "FAQ created successfully",
      faq
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create FAQ"
    });
  }
});

// Get all FAQs
router.get("/", async (req, res) => {
  try {
    const faqs = await FAQ.find();

    res.json({
      faqs
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch FAQs"
    });
  }
});

// Search FAQs
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) {
      return res.status(400).json({
        message: "Search query is required"
      });
    }

    const faqs = await FAQ.find({
      $or: [
        {
          question: {
            $regex: q,
            $options: "i"
          }
        },
        {
          answer: {
            $regex: q,
            $options: "i"
          }
        },
        {
          category: {
            $regex: q,
            $options: "i"
          }
        }
      ]
    });

    res.json({
      faqs
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to search FAQs"
    });
  }
});

// Get one FAQ by ID
router.get("/:id", async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        message: "FAQ not found"
      });
    }

    res.json({
      faq
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch FAQ"
    });
  }
});

// Update FAQ by ID
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { question, answer, category } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        message: "Question and answer are required"
      });
    }

    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      {
        question,
        answer,
        category
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!faq) {
      return res.status(404).json({
        message: "FAQ not found"
      });
    }

    res.json({
      message: "FAQ updated successfully",
      faq
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update FAQ"
    });
  }
});

// Delete FAQ by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);

    if (!faq) {
      return res.status(404).json({
        message: "FAQ not found"
      });
    }

    res.json({
      message: "FAQ deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete FAQ"
    });
  }
});

module.exports = router;