const Booking = require("../models/Booking");

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { expertId, date, timeSlot } = req.body;

    // Check if slot already booked
    const existing = await Booking.findOne({
      expertId,
      date,
      timeSlot,
    });

    if (existing) {
      return res.status(400).json({
        message: "This time slot is already booked ❌",
      });
    }

    const booking = await Booking.create(req.body);

    res.status(201).json({
      message: "Booking successful",
      booking,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Get bookings by email
exports.getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    const bookings = await Booking.find({ email });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};