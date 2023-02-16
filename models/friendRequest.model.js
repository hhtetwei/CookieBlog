// sentBy: objectid
// timestamp: date
// sentTo: objectid
// status: 'accepted' || 'declined' || 'pending'
const mongoose = require("mongoose");

const friRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("friRequests", friRequestSchema);
