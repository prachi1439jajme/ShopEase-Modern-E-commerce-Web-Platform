const User = require("../models/User");
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile");
const Address = require("../models/Address");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const OTP = require("../models/OTP");
const crypto = require("crypto");
require("dotenv").config();
const mailSender = require("../utility/mailSender");
const { passwordUpdate } = require("../mailTemplate/PasswordUpdate");
exports.signup = async (req, res) => {
  console.log("i am in signup");
  try {
    // account type that is role ek hee bar
    const {
      firstName,
      lastName,
      email,
      password,
      confirm_password,
      otp,
      role,
    } = req.body;
    console.log(email, password, confirm_password, otp, firstName, lastName);

    // step-1 validate user info
    if (
      !email ||
      !password ||
      !confirm_password ||
      !firstName ||
      !lastName ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "please enter all the details ",
      });
    }

    // step-2 Check user email id is already register with us
    const isUserPresent = await User.findOne({ email }).exec();
    if (isUserPresent) {
      return res.status(200).json({
        success: false,
        message: `User email ${email} is already registered with us  `,
      });
    }

    console.log("is user present ", isUserPresent);
    // step-3 match the password and confirm password
    if (password !== confirm_password) {
      return res.status(403).json({
        success: false,
        message:
          "Password and Confirm Password value not macth please try again ",
      });
    }

    // step-4 send the otp for verifying the user emailid is correct or not
    const recentotp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    console.log("otp array is ", recentotp[0]?.otp);

    if (recentotp.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          " Plese check your email id once, due to missmatch email or otp is empty,So Please resend the OTP !!!",
      });
    }

    if (otp !== recentotp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "otp is  miss macth , please enter valid otp",
      });
    }

    // if you put invalid email
    if (email !== recentotp[0].email) {
      return res.status(400).json({
        success: false,
        message: "Email Id and send otp email is different",
      });
    }

    // step-5 if the password match we have to hash the password that means encrypt
    let hashPassword;

    try {
      hashPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Error occured while hashing the password ",
        error: error.message,
      });
    }

    // also add some profile details
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      contact: null,
    });

    // there is no need to create the address details at the time of payment we will add address
    // const addressDetails = await Address.create({
    //   fullName: null,
    //   phone: null,
    //   alterNativePhone: null,
    //   pincode: null,
    //   state: null,
    //   city: null,
    //   HouseNo_Building_Name: null,
    //   Road_Area: null,
    //   NearBy: null,
    // });
    // if all is well so we have to insert record in db

    // mene yha par await nhi lagaya tha so ye cerate to karta tha but db me save nhi karta tha yad rakho await with async function
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      additionalDetails: profileDetails._id,
      img: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "User Registerd successfully ",
      Data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User can not be reagister, Please try again",
      error: error.message,
    });
  }
};

//otp verification
exports.sendOtp = async (req, res) => {
  console.log("i am in send otp");
  try {
    const { email } = req.body;
    // console.log("email id is ", email);

    // email is required
    if (!email) {
      return res.status(401).json({
        success: false,
        message: `Email id is required`,
      });
    }

    // check account if email is already registered or not

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(401).json({
        success: false,
        message: ` User already registered with this email ${email}`,
      });
    }

    // if not register so generate the otp
    // only we need numeric 6 digit otp
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const entry = await OTP.findOne({ otp: otp });
    // console.log("we get this entry in db related to this otp ", entry);

    // if we are not get valid otp so generate otp till get the correct otp
    while (entry) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      // try to get the entry with newly created otp
      entry = await OTP.findOne({ otp: otp });
    }

    // if otp generated successfully so we have to save email and otp in db
    const otpData = { email, otp };

    // create db entry
    await OTP.create(otpData);
    // so otp stored in db
    // console.log("Otp model has these value ", otpEntry);

    // finally return the response
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "OTP Can't sent, Internal Server Problem, Please check it in ",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  console.log("i am in login");
  try {
    const { email, password } = req.body;
    // console.log(email,password);

    // validate the data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "Email and Password both feilds are required ",
      });
    }
    //Check for existing user
    let user = await User.findOne({ email: email })
      .populate("additionalDetails")
      .populate("products")
      .exec();
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `No Account found with this email id ${email} `,
      });
    }

    // match the password  if match maket the token
    if (await bcrypt.compare(password, user.password)) {
      let token = jwt.sign(
        {
          email: user.email,
          id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "40h",
        }
      );

      user = user.toObject();
      user.token = token;
      user.password = undefined;

      let options = {
        // cookie expires in 3 days
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      // also we have to send the cookie as a response
      return res.cookie("token", token, options).status(200).json({
        success: true,
        message: `Login Successfully`,
        token: token,
        user,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `Password is incorrect, Please enter Correct Password  `,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User can not be logged in, Due to Internal Server Problem",
      error: error.message,
    });
  }
};

// Forgot password  that means change from login or signup page directally by email link  2 step process

// step-1 Reset Password Token
exports.resetToken = async (req, res) => {
  // console.log("RESET TOKEN ");
  try {
    // step1 get the email id
    const { email } = req.body;
    // console.log("GOT EMAIL", email);
    // check user is register or not with this id
    const checkUserExist = await User.findOne({ email: email });
    // console.log("USER GOT WITH EMAIL", checkUserExist);
    if (!checkUserExist) {
      return res.status(404).json({
        success: false,
        message: `There is no Account found with this ${email} is , Please SignUp !!!`,
      });
    }

    // step 2 user has registered already so generate the token and update in db and set the expires time
    // generate the 20 character and change in hex form and make the string
    const token = crypto.randomBytes(20).toString("hex");
    // console.log("check token", token);
    await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        // token expires with in 10min
        resetPasswordExpires: Date.now() + 10 * 60 * 1000,
      },
      { new: true }
    ).exec();

    // console.log("Updated User DB ", userSchema);

    // make the url which is send in email by which user can change their password
    let url = `${process.env.ORIGIN}/change-password/${token}`;

    // send the email to the user
    await mailSender(
      email,
      "Password Reset Link !!! ",
      `We received a request to reset the password for your account \n. 
       If you made this request, please click the link below to reset your password.
      ${url}`
    );
    return res.status(200).json({
      success: true,
      message: "Reset Password Email sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Error occured while sending the reset Password link ",
    });
  }
};

// step-2 Reset Password
exports.resetPassword = async (req, res) => {
  // console.log("we are in reset password");
  try {
    // fetch the data/ we'll get 3 things
    // frontend put the token in body
    const { password, confirm_password, token } = req.body;
    // console.log("Confirm pass=>", confirm_password, "passwprd=>", password);
    // console.log("Token value ", token);
    // validation
    if (confirm_password !== password) {
      return res.status(403).json({
        success: false,
        message: "Password and confirm_Password value not match ",
      });
    }
    // find the user details from the db
    const userDetails = await User.findOne({ token: token });
    // console.log("Given user by given token", userDetails);

    if (!userDetails) {
      return res.status(403).json({
        success: false,
        message: `Token is invalid, Please regenerate the Reset Password link  `,
      });
    }

    // check the token time agar token kee validity end ho gai ho tab
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(403).json({
        success: false,
        message: `Token has expired, Please regenerate it.} `,
      });
    }
    // console.log("user email is ==>", userDetails.email);
    // if every thing ok now hash the password
    let hashPassword;
    try {
      hashPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Error occured while hashing the password ",
        error: error.message,
      });
    }

    // update the password
    const use = await User.findOneAndUpdate(
      { token: token },
      { password: hashPassword },
      { new: true }
    );
    // console.log("upadetd user is", use);

    // create the url for frent-end
    const url = `${process.env.ORIGIN}/login`;
    // console.log("user upfate=>>>>", use.email);
    await mailSender(
      `${use.email}`,
      "Password Reset Successfully",
      passwordUpdate(use.email, userDetails.firstName, url)
    );
    // return the response
    return res.status(200).json({
      success: true,
      message: " Password Reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: " Error occured while reseting Password  hjgdjasg. ",
    });
  }
};

//Logout
exports.logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "Logged Out Successfully.",
      });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        "Getting Errror while Logging Out, Due to some internal server .",
    });
  }
};

// All details of login user
// login user all data
exports.getUserInfo = async (req, res) => {
  try {
    const userid = req.user.id;
    const userData = await User.findById(userid)
      .populate("additionalDetails")
      .populate("products")
      .exec();
    return res.status(200).json({
      success: true,
      data: userData,
      message: "User Data fetched",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "No user found",
      error: error.message,
    });
  }
};
