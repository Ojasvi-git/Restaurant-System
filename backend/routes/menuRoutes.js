
const express = require("express");
const {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// Public routes
router.get("/", getMenuItems);
router.get("/:id", getMenuItemById);

// Admin-only routes
router.post("/", protect, adminOnly, upload.single("image"), createMenuItem);
router.put("/:id", protect, adminOnly, upload.single("image"), updateMenuItem);
router.delete("/:id", protect, adminOnly, deleteMenuItem);

module.exports = router;

