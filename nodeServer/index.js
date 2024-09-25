const express = require("express");
const cors = require("cors");
const app = express();

// Set up CORS middleware
app.use(
  cors({
    origin: "*", // Your frontend origins
    methods: ["GET", "POST"],
    credentials: true, // Allow cookies or other credentials
  })
);

// Set up the server
const server = app.listen(8000, () => {
  console.log("Server running on port: 8000");
});

// Import and configure Socket.io
const io = require("socket.io")(server, {
  cors: {
    origin: "*", // Frontend URLs
    methods: ["GET", "POST"],
    credentials: true, // Allow cookies or other credentials
  },
});

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});