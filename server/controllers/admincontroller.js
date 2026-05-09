// controllers/adminController.js
// Admin-only operations: view all events, approve/reject them, manage users.

const Event = require("../models/Event");
const User = require("../models/User");

// ─── Get All Events (with filters) ───────────────────────
// @route  GET /api/admin/events
// @access Private — Admin only
const getAllEvents = async (req, res) => {
  try {
    const { status } = req.query;

    const query = { isActive: true };
    if (status) query.status = status;

    const events = await Event.find(query)
      .populate("organizer", "name email college")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: events.length, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Approve Event ────────────────────────────────────────
// @route  PUT /api/admin/events/:id/approve
// @access Private — Admin only
const approveEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "approved", rejectionReason: "" },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    res.status(200).json({
      success: true,
      message: "Event approved successfully.",
      event,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Reject Event ─────────────────────────────────────────
// @route  PUT /api/admin/events/:id/reject
// @access Private — Admin only
const rejectEvent = async (req, res) => {
  try {
    const { reason } = req.body;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        rejectionReason: reason || "Does not meet platform guidelines.",
      },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    res.status(200).json({
      success: true,
      message: "Event rejected.",
      event,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get All Users ────────────────────────────────────────
// @route  GET /api/admin/users
// @access Private — Admin only
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Toggle User Active Status ────────────────────────────
// @route  PUT /api/admin/users/:id/toggle-status
// @access Private — Admin only
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account.",
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully.`,
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllEvents,
  approveEvent,
  rejectEvent,
  getAllUsers,
  toggleUserStatus,
};