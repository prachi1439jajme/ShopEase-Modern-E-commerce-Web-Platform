const mongoose = require("mongoose");
const mailSender = require("../utility/mailSender");
const emailVerification = require("../mailTemplate/EmailVerification");
const otpSchema = new mongoose.Schema({
  email: {
    type: "String",
  },
  otp: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    // otp will expire within 10 minutes
    expires: 60 * 10,
  },
});

// when we user try to rigister or sign up in a website so we have to verify that user with their email id after we create the account

async function sendVerificationMail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email ",
      emailVerification(otp)
    );
    // console.log("Mail send successfully ", mailResponse);
  } catch (error) {
    // console.log("Error occured while sending email Yha fas gya ");
    throw error;
  }
}
/* pre middleware use  above code run before saving the entry in const {propertyName} = objectToDestruct;
 you can not pass doc as a parameter here bcs we did not save the entry in DB or doc entry save hone ke bad milta hai 
 we donot have doc bcs pre middleware we can use next as a parameter here 

 If you call `next()` with an argument, that argument is assumed to be
 an error.*/
otpSchema.pre("save", async function (next) {
  if (this.isNew) {
    console.log(`this is my email${this.email}`);
    await sendVerificationMail(this.email, this.otp);
  }
  next();
});

module.exports = mongoose.model("OTP", otpSchema);
