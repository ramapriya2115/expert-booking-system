import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

function ExpertDetail() {
  const { id } = useParams();

  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });

  // Fetch expert
  useEffect(() => {
    const fetchExpert = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/experts/${id}`
      );
      setExpert(res.data);
      setLoading(false);
    };
    fetchExpert();
  }, [id]);

  // Real-time socket
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("slotBooked", (data) => {
      if (data.expertId === id) {
        setExpert((prev) => ({
          ...prev,
          slots: prev.slots.map((slot) =>
            slot.date === data.date
              ? {
                  ...slot,
                  times: slot.times.filter(
                    (t) => t !== data.timeSlot
                  )
                }
              : slot
          )
        }));
      }
    });

    return () => socket.disconnect();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!expert) return <p>Expert not found</p>;

  return (
    <div className="container">
      <div className="card">
        <h2>{expert.name}</h2>
        <p><strong>Category:</strong> {expert.category}</p>
        <p><strong>Experience:</strong> {expert.experience} years</p>
        <p><strong>Rating:</strong>  {expert.rating}</p>
      </div>

      <div className="card">
        <h3>Available Slots</h3>

        {expert.slots.map((slot) => (
          <div key={slot.date}>
            <h4>{slot.date}</h4>

            {slot.times.length === 0 ? (
              <p>No slots available</p>
            ) : (
              slot.times.map((time) => (
                <button
                  key={time}
                  className="slot-button"
                  onClick={() => {
                    setSelectedDate(slot.date);
                    setSelectedTime(time);
                    setMessage("");
                  }}
                >
                  {time}
                </button>
              ))
            )}
          </div>
        ))}
      </div>

      {selectedTime && (
        <div className="booking-form">
          <h3>Book Appointment</h3>

          <p><strong>Date:</strong> {selectedDate}</p>
          <p><strong>Time:</strong> {selectedTime}</p>

          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          <textarea
            placeholder="Additional Notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />

          <button
            disabled={
              !formData.name ||
              !formData.email ||
              !formData.phone
            }
            onClick={async () => {
              try {
                await axios.post(
                  "http://localhost:5000/api/bookings",
                  {
                    expertId: expert._id,
                    ...formData,
                    date: selectedDate,
                    timeSlot: selectedTime
                  }
                );

                // Remove slot instantly
                setExpert((prev) => ({
                  ...prev,
                  slots: prev.slots.map((slot) =>
                    slot.date === selectedDate
                      ? {
                          ...slot,
                          times: slot.times.filter(
                            (t) => t !== selectedTime
                          )
                        }
                      : slot
                  )
                }));

                setMessage("Booking Successful!");
                setSelectedTime("");
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  notes: ""
                });
              } catch (err) {
                setMessage(" Slot already booked!");
              }
            }}
          >
            Confirm Booking
          </button>

          {message && <p>{message}</p>}
        </div>
      )}
    </div>
  );
}

export default ExpertDetail;