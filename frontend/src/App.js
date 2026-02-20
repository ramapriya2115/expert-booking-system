import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ExpertList from "./pages/ExpertList";
import ExpertDetail from "./pages/ExpertDetail";
import MyBookings from "./pages/MyBookings";

function Navbar() {
  const navigate = useNavigate();
  return (
    <div className="navbar">
      <h2>MedBook</h2>
      <div>
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/my-bookings")} style={{ marginLeft: "10px" }}>
          My Bookings
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ExpertList />} />
        <Route path="/expert/:id" element={<ExpertDetail />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </Router>
  );
}

export default App;
