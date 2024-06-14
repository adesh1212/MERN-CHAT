const express = require("express");
require("dotenv").config({ path: "../.env" });
const connectDB = require("./db");
const cors = require("cors");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const notificationRoutes = require("./Routes/NotificationRoutes");
// console.log(process.env);

const port = process.env.PORT || 8000;
// console.log(port);
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notification", notificationRoutes);

// var server;
connectDB();

const server = app.listen(
  port,
  console.log(`Server running on PORT ${port}...`)
);

// socket
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  // create room for current logged in user
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(userData._id);
    socket.emit("Connected");
  });

  // create room for chat with room id = chatid
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room ", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // when the current user send message in the chat it should be sent to all the other users present in the chat
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", (userData) => {
    console.log("USer disconnected");
    socket.leave(userData._id);
  })
});
