const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
const server = http.createServer(app);

// WebSocket bağlantısı
const io = new Server(server, {
  cors: {
    origin: "*", // Vercel URL’ini buraya ekleyebilirsin
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("rollDice", ({ diceCount, difficulty, username }) => {
    const results = [];
    for (let i = 0; i < diceCount; i++) {
      results.push(Math.floor(Math.random() * 10) + 1);
    }
    io.emit("diceRolled", {
      results,
      username,
      diceCount,
      difficulty,
      timestamp: new Date().toISOString()
    });
  });


  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.get("/", (req, res) => {
  res.send("Socket.IO Dice Roller is running.");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});