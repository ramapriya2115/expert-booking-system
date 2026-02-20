const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Expert",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  notes: String,
  status: {
    type: String,
    default: "Pending"
  }
});

bookingSchema.index(
  { expertId: 1, date: 1, timeSlot: 1 },
  { unique: true }
);

module.exports = mongoose.model("Booking", bookingSchema);