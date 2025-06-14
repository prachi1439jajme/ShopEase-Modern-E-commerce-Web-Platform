const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();
exports.Verify = async (req, res, next) => {
  try {
    const token =
      req.body.token ||
      req.cookies.token ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(404).json({
        success: false,
        message: "No token found, Please Login",
      });
    }

    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;

    next();
  } catch (error) {
    return res.status(401).json({
      error: error?.message,
      success: false,
      message:
        " Something went wrong while verifying the token,Please Login when you try to access protected route",
    });
  }
};

exports.isUser = async (req, res, next) => {
  // console.log("yes");
  try {
    // we already set the email inside the token wo we can fetch from there bcs we already decode the token
    const userInfo = await User.findOne({ email: req.user.email });
    if (userInfo.role !== "user") {
      return res.success(403).json({
        success: false,
        message: "This is a protected route for admin only user can access!! ",
        Logs: "Try to login with user role !!!",
      });
    }

    // and move to the next controller or middleware
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role can'nt be verified, please try again with different account!!! ",
    });
  }
};

// for employer who post the job i.e provider
exports.isAdmin = async (req, res, next) => {
  try {
    // we already set the email inside the token wo we can fetch from there bcs we already decode the token
    const userInfo = await User.findOne({ email: req.user.email });
    if (userInfo.role !== "admin") {
      return res.success(403).json({
        success: false,
        message:
          "This is a protected route for user only admin have rights to access it   ",
        Logs: "Try to login with different role !!!",
      });
    }

    // and move to the next controller or middleware
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role can'nt be verified, please try again!!! ",
    });
  }
};
