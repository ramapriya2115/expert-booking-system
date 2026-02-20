const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./src/config/db");
const expertRoutes = require("./src/routes/expertRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);

// Attach socket
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH"]
  }
});

// Make io accessible in routes
app.set("io", io);

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/experts", expertRoutes);
app.use("/api/bookings", bookingRoutes);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});