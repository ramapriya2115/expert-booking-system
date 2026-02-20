import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/experts";

function ExpertList() {
  const [experts, setExperts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API, {
        params: { page, limit: 5, search, category }
      });
      setExperts(res.data.experts);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch experts");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, [page, search, category]);

  return (
     <>
   <div className="hero">
  <h1>Doctor Appointment Booking System</h1>
  <p>Book trusted medical experts in seconds</p>
  <img src="https://cdn-icons-png.flaticon.com/512/387/387561.png" alt="Doctor" />
</div>
    <div className="container">
      <h2>Expert Listing</h2>

      <button onClick={() => navigate("/my-bookings")}>
        My Bookings
      </button>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filter */}
      <input
        type="text"
        placeholder="Filter by category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {experts.map((expert) => (
       <div
  key={expert._id}
  className="card"
  style={{ cursor: "pointer" }}
  onClick={() => navigate(`/expert/${expert._id}`)}
>
  <h3>{expert.name}</h3>
  <p><strong>Category:</strong> {expert.category}</p>
  <p><strong>Experience:</strong> {expert.experience} years</p>
  <p><strong>Rating:</strong> {expert.rating}</p>
  <button>Book Appointment</button>
</div>
      ))}

      {/* Pagination */}
      <div style={{ marginTop: "20px" }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages}
        </span>

        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
    </>
  );
}

export default ExpertList;