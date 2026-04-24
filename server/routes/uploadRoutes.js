const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// Frontend directly Cloudinary la upload karto
// He route fakt proxy ahe
router.get("/signature", protect, (req, res) => {
  res.json({
    success: true,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    uploadPreset: "eventsphere",
  });
});

module.exports = router;