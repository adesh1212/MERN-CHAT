const asyncHandler = require("express-async-handler");
const Message = require("../Models/MessageModel");
const User = require("../Models/UserModel");
const Chat = require("../Models/ChatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({
      success: false,
      msg: "Invalid data passed to the request!",
    });
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name avatar");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name avatar email",
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    message = await Message.populate(message, {
      path: "chat.latestMessage",
      select: "sender content",
    });

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name avatar email")
      .populate("chat");

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
});
module.exports = { sendMessage, allMessages };
