const Registration = require("../models/Registration");
const Event = require("../models/Event");

// @POST /api/registrations/:eventId
const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) return res.status(404).json({ success: false, message: "Event not found!" });
    if (event.status !== "approved") return res.status(400).json({ success: false, message: "Event not approved yet!" });
    if (event.isFull) return res.status(400).json({ success: false, message: "Event is full!" });

    const alreadyRegistered = await Registration.findOne({
      event: req.params.eventId,
      user: req.user._id,
    });

    if (alreadyRegistered) return res.status(400).json({ success: false, message: "Already registered!" });

    const { paymentScreenshot } = req.body;

    const registration = await Registration.create({
      event: req.params.eventId,
      user: req.user._id,
      paymentStatus: event.isPaid ? "pending" : "free",
      paymentScreenshot: event.isPaid ? (paymentScreenshot || "") : "",
      paymentVerified: event.isPaid ? false : true,
    });

    await Event.findByIdAndUpdate(req.params.eventId, {
      $inc: { registeredCount: 1 },
    });

    res.status(201).json({ success: true, message: "Registered successfully! 🎉", registration });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Already registered!" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @DELETE /api/registrations/:eventId
const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOneAndDelete({
      event: req.params.eventId,
      user: req.user._id,
    });

    if (!registration) return res.status(404).json({ success: false, message: "Registration not found!" });

    await Event.findByIdAndUpdate(req.params.eventId, {
      $inc: { registeredCount: -1 },
    });

    res.json({ success: true, message: "Registration cancelled!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/registrations/my
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate("event", "title date time venue category isPaid price status organizer posterImage capacity registeredCount")
      .sort("-createdAt");

    res.json({ success: true, registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/registrations/event/:eventId (organizer/admin)
const getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ success: false, message: "Event not found!" });

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized!" });
    }

    const registrations = await Registration.find({ event: req.params.eventId })
      .populate("user", "name email college")
      .sort("-createdAt");

    res.json({ success: true, count: registrations.length, registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/registrations/:registrationId/verify (organizer/admin)
const verifyPayment = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.registrationId)
      .populate("event");

    if (!registration) return res.status(404).json({ success: false, message: "Registration not found!" });

    const event = registration.event;
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized!" });
    }

    registration.paymentVerified = true;
    registration.paymentStatus = "paid";
    await registration.save();

    res.json({ success: true, message: "Payment verified! ✅" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerForEvent, cancelRegistration, getMyRegistrations, getEventRegistrations, verifyPayment };