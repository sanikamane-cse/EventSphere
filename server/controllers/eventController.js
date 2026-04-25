const Event = require("../models/event");
const Registration = require("../models/registration");

// ─── Get All Events ───────────────────────────────────────
const getEvents = async (req, res) => {
  try {
    const {
      search,
      category,
      isPaid,
      page = 1,
      limit = 9,
      sortBy = "date",
      order = "asc",
    } = req.query;

    const query = {
      status: "approved",
      isActive: true,
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (isPaid !== undefined) {
      query.isPaid = isPaid === "true";
    }

    const sortOrder = order === "desc" ? -1 : 1;
    const sortOptions = { [sortBy]: sortOrder };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const events = await Event.find(query)
      .populate("organizer", "name college avatar")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      events,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Single Event ─────────────────────────────────────
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizer",
      "name college avatar email"
    );

    if (!event || !event.isActive) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    res.status(200).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Create Event ─────────────────────────────────────────
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      venue,
      date,
      time,
      capacity,
      isPaid,
      price,
      tags,
      posterImage,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      category,
      venue,
      date,
      time,
      capacity,
      isPaid: isPaid || false,
      price: isPaid ? price : 0,
      tags: tags || [],
      posterImage: posterImage || "",
      organizer: req.user._id,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Event submitted for admin approval.",
      event,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Event ─────────────────────────────────────────
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event || !event.isActive) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    const isOwner = event.organizer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this event.",
      });
    }

    if (!isAdmin) {
      delete req.body.status;
      delete req.body.organizer;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, event: updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Delete Event ─────────────────────────────────────────
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event || !event.isActive) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    const isOwner = event.organizer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this event.",
      });
    }

    event.isActive = false;
    await event.save();

    res.status(200).json({ success: true, message: "Event deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get My Events (Organizer) ────────────────────────────
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({
      organizer: req.user._id,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: events.length, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Toggle Like ──────────────────────────────────────────
const toggleLike = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    const userId = req.user._id.toString();
    const alreadyLiked = event.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      event.likes = event.likes.filter((id) => id.toString() !== userId);
    } else {
      event.likes.push(req.user._id);
    }

    await event.save();

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: event.likes.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Toggle Bookmark ──────────────────────────────────────
const toggleBookmark = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    const userId = req.user._id.toString();
    const alreadyBookmarked = event.bookmarks.some(
      (id) => id.toString() === userId
    );

    if (alreadyBookmarked) {
      event.bookmarks = event.bookmarks.filter(
        (id) => id.toString() !== userId
      );
    } else {
      event.bookmarks.push(req.user._id);
    }

    await event.save();

    res.status(200).json({
      success: true,
      bookmarked: !alreadyBookmarked,
      bookmarksCount: event.bookmarks.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  toggleLike,
  toggleBookmark,
};