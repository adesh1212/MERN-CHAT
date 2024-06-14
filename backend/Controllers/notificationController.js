const asyncHandler = require("express-async-handler");
const Notification = require("../Models/NotificationModel");
const Chat = require("../Models/ChatModel");
const User = require("../Models/UserModel");

const storeNotification = asyncHandler(async (req, res) => {
  const { msg_id, chat_id } = req.body;

  if (!msg_id || !chat_id) {
    return res.status(400).json({
      success: false,
      msg: "Please provide all the details",
    });
  }
  try {
    let added = await Notification.findOneAndUpdate(
      { userId: req.user._id, chat: chat_id },
      {
        $push: { message: msg_id },
      },
      {
        new: true,
      }
    ).populate("message");

    added = await Chat.populate(added, {
      path: "message.chat",
      select: "chatName isGroupChat users latestMessage groupAdmin",
    });

    if (added) {
      return res.status(200).json({
        success: true,
        data: added,
      });
    }
    let notif = await Notification.create({
      userId: req.user._id,
      message: msg_id,
      chat: chat_id,
    });

    notif = await notif.populate("message");
    notif = await Chat.populate(notif, {
      path: "message.chat",
      select: "chatName isGroupChat users latestMessage groupAdmin",
    });

    notif = await User.populate(notif, {
      path: "message.sender",
      select: "name avatar email",
    });

    if (notif) {
      return res.status(200).json({
        success: true,
        data: notif,
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: error.message,
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
});

const getNotifications = asyncHandler(async (req, res) => {
  try {
    let notif = await Notification.find({ userId: req.user._id }).populate(
      "message"
    );

    notif = await Chat.populate(notif, {
      path: "message.chat",
      select: "chatName isGroupChat users latestMessage groupAdmin",
    });

    notif = await User.populate(notif, {
      path: "message.sender",
      select: "name avatar email",
    });

    notif = await User.populate(notif, {
      path: "message.chat.users",
      select: "name avatar email",
    });

    return res.status(200).json({
      success: true,
      data: notif,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
});

const deleteNotification = asyncHandler(async (req, res) => {
  const data = await Notification.deleteMany({
    userId: req.user._id,
    chat: req.params.chat_id,
  });

  return res.status(200).json({
    success: true,
    data,
  });
});

module.exports = { storeNotification, getNotifications, deleteNotification };
