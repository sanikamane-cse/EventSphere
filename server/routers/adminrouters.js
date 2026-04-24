// routes/adminRoutes.js
// All routes here are admin-only — double protected by both middlewares.

const express = require("express");
const router = express.Router();
const {
  getAllEvents,
  approveEvent,
  rejectEvent,
  getAllUsers,
  toggleUserStatus,
} = require("../controllers/admincontroller");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Apply protect + admin role to ALL routes in this file
router.use(protect, authorize("admin"));

router.get("/events", getAllEvents);
router.put("/events/:id/approve", approveEvent);
router.put("/events/:id/reject", rejectEvent);

router.get("/users", getAllUsers);
router.put("/users/:id/toggle-status", toggleUserStatus);

module.exports = router;