const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Expert = require("../models/Expert");

// CREATE booking
router.post("/", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const savedBooking = await booking.save();

    //  Remove booked slot safely
const expert = await Expert.findById(savedBooking.expertId);

if (expert) {
  // Convert booking date to YYYY-MM-DD format
  const bookingDate = new Date(savedBooking.date)
    .toISOString()
    .split("T")[0];

  const slotObj = expert.slots.find(
    (slot) => slot.date === bookingDate
  );

  if (slotObj) {
    slotObj.times = slotObj.times.filter(
      (time) => time !== savedBooking.timeSlot
    );
  }

  await expert.save();
}
    //  Emit socket event
    const io = req.app.get("io");

    io.emit("slotBooked", {
      expertId: savedBooking.expertId,
      date: savedBooking.date,
      timeSlot: savedBooking.timeSlot
    });

    res.status(201).json(savedBooking);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET bookings (optional email filter)
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;

    let bookings;

    if (email) {
      bookings = await Booking.find({
        email: { $regex: new RegExp(`^${email}$`, "i") }
      });
    } else {
      bookings = await Booking.find();
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH booking status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;