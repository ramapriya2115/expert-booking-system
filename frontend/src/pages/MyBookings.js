import { useState } from "react";
import axios from "axios";

function MyBookings() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/bookings?email=" + email
      );
      setBookings(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h2>My Bookings</h2>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "350px", marginRight: "10px" }}
        />
        <button onClick={fetchBookings}>Search</button>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {bookings.map((b) => (
          <div key={b._id} className="card">
            <p><strong>Date:</strong> {b.date}</p>
            <p><strong>Time:</strong> {b.timeSlot}</p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`status-badge ${
                  b.status.toLowerCase() === "pending"
                    ? "status-pending"
                    : b.status.toLowerCase() === "confirmed"
                    ? "status-confirmed"
                    : "status-completed"
                }`}
              >
                {b.status}
              </span>
            </p>
          </div>
        ))}
      </div>

      {bookings.length === 0 && email && (
        <p style={{ textAlign: "center" }}>No bookings found.</p>
      )}
    </div>
  );
}

export default MyBookings;