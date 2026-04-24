const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventRegistrations,
  verifyPayment,
} = require("../controllers/registrationController");

router.post("/:eventId", protect, authorize("student"), registerForEvent);
router.delete("/:eventId", protect, authorize("student"), cancelRegistration);
router.get("/my", protect, getMyRegistrations);
router.get("/event/:eventId", protect, authorize("organizer", "admin"), getEventRegistrations);
router.put("/:registrationId/verify", protect, authorize("organizer", "admin"), verifyPayment);

module.exports = router;