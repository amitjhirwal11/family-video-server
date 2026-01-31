const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

/* ✅ Health check route (VERY IMPORTANT) */
app.get("/", (req, res) => {
  res.send("Family Video Server is running ❤️");
});

/* Your socket logic */
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join-room", (room) => {
    socket.join(room);
    socket.to(room).emit("user-joined");
  });

  socket.on("offer", (data) => {
    socket.to(data.room).emit("offer", data.offer);
  });

  socket.on("answer", (data) => {
    socket.to(data.room).emit("answer", data.answer);
  });

  socket.on("ice", (data) => {
    socket.to(data.room).emit("ice", data.candidate);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

/* ✅ Dynamic PORT for Railway */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
