const User = require("../models/User");
const Profile = require("../models/Profile");
require("dotenv").config();
// updare profile information
exports.updateProfile = async (req, res) => {
  console.log("We are in Update Profile Data Schema ");
  try {
    // get the data
    const { dateOfBirth, contact, gender } = req.body;
    // find the userId
    const id = req.user.id;

    //find user details
    const userDetails = await User.findById(id);

    console.log("user found", userDetails);

    // find the profile details by id
    const profile = await Profile.findById(userDetails.additionalDetails);
    // upadte the user schema
    const user = await Profile.findByIdAndUpdate(
      profile._id,
      {
        contact,
        gender,
        dateOfBirth,
      },
      { new: true }
    ).exec();
    // save the updated profile
    await user.save();

    await profile.save();

    // find the updated user schema details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Profile details has been updated ",
      date: updatedUserDetails,
    });
  } catch (error) {
    // console.log("Kya hua", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message:
        "Error Occured while updating the profile data, Internal server Problem ",
    });
  }
};

// Delete the user Account
exports.deleteAccouunt = async (req, res) => {
  console.log("we are in delete account controller");
  try {
    // get the id
    const id = req.user.id;
    // validate the id
    // console.log("user id is ", id);
    const userDetails = await User.findById({ _id: id });
    if (userDetails?.role === "admin") {
      return res.status(404).json({
        success: false,
        message: "Admin Can not delete their account  ",
      });
    }
    // console.log("User Details", userDetails);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: " user not found  ",
      });
    }

    // before delete the user info from user schema i have to delete his profile data
    await Profile.findByIdAndDelete(userDetails.additionalDetails);
    await User.findByIdAndDelete(userDetails._id);
    // console.log("Updated user schema is ", updatedUser);

    return res.status(200).json({
      success: true,
      message: "User Account has been deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message:
        "Error Occured while deleting the User Account, Internal server Problem ",
    });
  }
};
