const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["free", "pending", "paid", "failed"],
      default: "free",
    },

    paymentId: {
      type: String,
      default: "",
    },

    paymentScreenshot: {
      type: String,
      default: "",
    },

    paymentVerified: {
      type: Boolean,
      default: false,
    },

    qrToken: {
      type: String,
      default: "",
    },

    attended: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

registrationSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.models.Registration || mongoose.model("Registration", registrationSchema);