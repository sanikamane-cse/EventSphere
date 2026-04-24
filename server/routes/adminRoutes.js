const express = require("express");
const router = express.Router();
const {
  getAllEvents, approveEvent, rejectEvent,
  getAllUsers, toggleUserStatus,
} = require("../controllers/admincontroller");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect, authorize("admin"));

router.get("/events", getAllEvents);
router.put("/events/:id/approve", approveEvent);
router.put("/events/:id/reject", rejectEvent);
router.get("/users", getAllUsers);
router.put("/users/:id/toggle-status", toggleUserStatus);

module.exports = router;