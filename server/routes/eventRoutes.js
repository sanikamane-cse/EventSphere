const express = require("express");
const router = express.Router();
const {
  getEvents, getEventById, createEvent,
  updateEvent, deleteEvent, getMyEvents,
  toggleLike, toggleBookmark,
} = require("../controllers/eventController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.get("/", getEvents);
router.get("/my-events", protect, authorize("organizer", "admin"), getMyEvents);
router.get("/:id", getEventById);
router.post("/", protect, authorize("organizer", "admin"), createEvent);
router.put("/:id", protect, authorize("organizer", "admin"), updateEvent);
router.delete("/:id", protect, authorize("organizer", "admin"), deleteEvent);
router.put("/:id/like", protect, toggleLike);
router.put("/:id/bookmark", protect, toggleBookmark);

module.exports = router;