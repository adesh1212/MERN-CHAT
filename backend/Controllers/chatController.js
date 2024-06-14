const Chat = require("../Models/ChatModel");
const User = require("../Models/UserModel");
const asyncHandler = require("express-async-handler");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "UserId not provided",
    });
  }

  // find if chat already exists between the two users
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name avatar email",
  });

  if (isChat.length > 0) {
    return res.json({
      success: true,
      data: isChat[0],
    });
  } else {
    // if chat doesn't exist create one.
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);

      const fullchat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      return res.status(200).json({
        success: true,
        data: fullchat,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        msg: error.message,
      });
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    /* Chat.find(): Searches for chat documents in the MongoDB Chat collection.
users: { $elemMatch: { $eq: req.user._id } } }: Specifies the search criteria. It finds chat documents where the users array contains an element that matches req.user._id.
.populate("users", "-password"): Populates the users field in the retrieved chat documents. It fetches data from the User collection, excluding the password field.
.populate("groupAdmin", "-password"): Populates the groupAdmin field in the retrieved chat documents. It fetches data from the User collection for the group admin, excluding the password field.
.populate("latestMessage"): Populates the latestMessage field in the retrieved chat documents. It likely fetches data from another collection message to include detailed information about the latest message in the chat.
.sort({ updatedAt: -1 }): Sorts the retrieved chat documents based on the updatedAt field in descending order (from newest to oldest). */

    let data = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    data = await User.populate(data, {
      path: "latestMessage.sender",
      select: "name avatar email",
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      msg: error.message,
    });
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  let { users, name } = req.body;
  if (!users || !name) {
    return res.status(400).json({
      success: false,
      msg: "Please enter all fields",
    });
  }

  users = JSON.parse(users);

  if (users.length < 2) {
    return res.status(400).json({
      success: false,
      msg: "More than 2 users are required to create a group",
    });
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      isGroupChat: true,
      chatName: name,
      users: users,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json({
      success: true,
      data: fullGroupChat,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  try {
    const grpchat = await Chat.find({ _id: chatId }).populate(
      "groupAdmin",
      "-password"
    );

    const adminEmail = await grpchat[0].groupAdmin.email;

    // console.log(adminEmail);
    // console.log(req.user);

    // if user is not the admin of the group then the user cannot rename the group
    if (adminEmail != req.user.email) {
      return res.status(400).json({
        success: false,
        msg: "Only group admin can rename the group!",
      });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return res.status(400).json({
        success: false,
        msg: "Chat Not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedChat,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    return res.status(400).json({
      success: false,
      msg: "Chat Not Found",
    });
  }

  return res.status(200).json({
    success: true,
    data: added,
  });
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const grpchat = await Chat.find({ _id: chatId }).populate(
      "groupAdmin",
      "-password"
    );

    const adminEmail = await grpchat[0].groupAdmin.email;

    // console.log(adminEmail);
    // console.log(req.user);

    // if user is not the admin of the group then the user cannot remove from the group
    // if (adminEmail != req.user.email) {
    //   return res.status(400).json({
    //     success: false,
    //     msg: "Only group admin can remove users from the group!",
    //   });
    // }
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      return res.status(400).json({
        success: false,
        msg: "Chat Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      data: removed,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
