const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");

const isAuth = async (req, res, next) => {
  let token;

//   token -> "Bearer {token}"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
      try {
          token = req.headers.authorization.split(" ")[1];
          
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          
          req.user = await User.findById(decoded.id).select("-password");

          next();

      } catch (error) {
          return res.status(400).json({
              success: false,
              message:"Unauthorized user"
            })
      }
  } else {
      return res.status(400).json({
        success: false,
        message: "Error Occured!",
      });
  }
};

module.exports = isAuth;