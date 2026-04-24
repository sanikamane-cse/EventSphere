// models/Event.js
// Defines the Event document structure.
// An event is created by an organizer and must be approved by admin before going public.

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Event description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    category: {
      type: String,
      enum: ["technical", "cultural", "sports", "workshop", "seminar", "other"],
      required: [true, "Category is required"],
    },

    // Reference to the User who created this event
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    posterImage: {
      type: String,
      default: "", // Cloudinary URL — added in Phase 6
    },

    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },

    date: {
      type: Date,
      required: [true, "Event date is required"],
    },

    time: {
      type: String,
      required: [true, "Event time is required"],
    },

    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },

    // Track how many have registered — avoids counting registrations every time
    registeredCount: {
      type: Number,
      default: 0,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
    },

    // Admin controls this field — new events start as 'pending'
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // Rejection reason from admin (optional)
    rejectionReason: {
      type: String,
      default: "",
    },

    tags: {
      type: [String],
      default: [],
    },

    // Array of User IDs who liked this event
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Array of User IDs who bookmarked this event
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    // Add virtual fields to JSON output
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtual Fields ───────────────────────────────────────
// Virtual: seats remaining — computed on the fly, not stored in DB
eventSchema.virtual("seatsRemaining").get(function () {
  return this.capacity - this.registeredCount;
});

// Virtual: is event full?
eventSchema.virtual("isFull").get(function () {
  return this.registeredCount >= this.capacity;
});

// ─── Indexes ──────────────────────────────────────────────
// Index for fast search and filter queries
eventSchema.index({ title: "text", description: "text", tags: "text" });
eventSchema.index({ status: 1, date: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ category: 1 });

module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);