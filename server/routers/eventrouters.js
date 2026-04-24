// routes/eventRoutes.js
// Public routes are open to all.
// Protected routes require JWT + specific roles.

const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  toggleLike,
  toggleBookmark,
} = require("../controllers/eventcontroller");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Public routes
router.get("/", getEvents);
router.get("/my-events", protect, authorize("organizer", "admin"), getMyEvents);
router.get("/:id", getEventById);

// Protected routes
router.post("/", protect, authorize("organizer", "admin"), createEvent);
router.put("/:id", protect, authorize("organizer", "admin"), updateEvent);
router.delete("/:id", protect, authorize("organizer", "admin"), deleteEvent);

// Like & Bookmark — any logged in user
router.put("/:id/like", protect, toggleLike);
router.put("/:id/bookmark", protect, toggleBookmark);

module.exports = router;