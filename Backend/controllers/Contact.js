const { contactEmail } = require("../mailTemplate/contactEmail");
const { contactOwner } = require("../mailTemplate/contactOwner");
const mailSender = require("../utility/mailSender");
exports.ContactControoler = async (req, res) => {
  console.log("We are in contact controller ");
  try {
    const { firstName, lastName, email, message, phone, countrycode } =
      req.body;
    // console.log("body data ", req.body);
    if (!firstName || !email || !message || !countrycode || !phone) {
      return res.status(403).json({
        success: false,
        message: "All feilds are required ",
      });
    }

    // this is used for website owner who will take the customer query
    await mailSender(
      "jagmohanrai082@gmail.com",
      "User Inquiry About Some Assistance",
      contactOwner(phone, firstName, lastName, message, countrycode)
    );

    // this is for user that means you sent your msg to website owner successfully
    await mailSender(
      email,
      "Message sent successfully",
      contactEmail(email, phone, firstName, lastName, message)
    );
    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Can not send mail, Something went wrong",
      error: error.message,
    });
  }
};
