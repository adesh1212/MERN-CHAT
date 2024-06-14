const asyncHandler = require("express-async-handler");
const User = require("../Models/UserModel");
const generateToken = require("../config/generateToken");
var validator = require("email-validator");
const Otp = require("../Models/OtpModel");
const mailer = require("nodemailer");
const { sendEmail } = require("../config/sendEmail");
const crypto = require("crypto");
const { hashPassword } = require("../config/hashPassword");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, avatar } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields",
    });
    // throw new Error("Please enter all fields");
  }

  if (!validator.validate(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email address",
    });
  }

  try {
    const exisingUser = await User.findOne({ email });

    if (exisingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const pass = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password:pass,
      avatar,
    });

    if (user) {
      return res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          avatar: user.avatar,
          token: generateToken(user._id),
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Error Occured!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "error",
    });
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields",
    });
  }

  if (!validator.validate(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email address",
    });
  }

  try {
    const user = await User.findOne({ email });
    // console.log(user);

    if (user) {
      const isMatch = await user.matchPassword(password);

      if (isMatch) {
        return res.status(201).json({
          success: true,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            avatar: user.avatar,
            token: generateToken(user._id),
          },
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error Occured",
    });
  }
});

// -> /api/user?search=adesh
const allUsers = async (req, res) => {
  try {
    // console.log(req.query);

    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            // { email: { $regex: req.query.search, $options: "i" } }
          ],
        }
      : {};

    // giving all users that contains the search parameter in their name except the current user.
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

    return res.status(201).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error Occured",
    });
  }
};

const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      success: false,
      msg: "User not found!",
    });
  }

  try {
    const resetToken = await user.getResetToken();

    await user.save();

    // send token via email
    const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
    const message = `Click on the link to reset your password. ${url}`;
    await sendEmail(user.email, "Password Reset Token", message);

    return res.status(200).json({
      success: true,
      msg: `Reset password link has been sent to ${email}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      msg: error,
    });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  // console.log(req.params);
  const { token } = req.params;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Token is invalid or has been expired",
      });
    }

    const password = await hashPassword(req.body.password);
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      msg: "Password has been reset successfully!",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error,
    });
  }
});

module.exports = {
  registerUser,
  authUser,
  allUsers,
  forgetPassword,
  resetPassword,
};
