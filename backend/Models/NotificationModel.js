const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  message: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  },
});

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
