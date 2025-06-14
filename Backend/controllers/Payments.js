const { instance } = require("../configuration/razorpayConfig");
const Product = require("../models/Product");
const crypto = require("crypto");
const User = require("../models/User");
const mailSender = require("../utility/mailSender");
const {
  productBuySuccessfully,
} = require("../mailTemplate/productBuySuccessfully");
const { default: mongoose, Mongoose } = require("mongoose");
const { paymentSuccessEmail } = require("../mailTemplate/paymentSuccessEmail");
const { log } = require("console");

exports.capturePayment = async (req, res) => {
  // whatever course i need to buy so we need courses id thats why we use here
  const { products } = req.body;
  console.log("coming products are", products);
  // jis user ko course buy karna hai us user ke userId bhi need hogi
  const userId = req.user.id;
  console.log("coming userid is", userId);

  // check courses is present or not
  if (products.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Please provide Product id",
    });
  }
  let totalAmount = 0;
  for (const product_id of products) {
    let product;
    try {
      product = await Product.findById(product_id);
      // if no course found so return the response
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `No product found curresponding to this  product_id ${product_id}`,
        });
      }
      // check user is aleready buy the course or not
      const uid = new mongoose.Types.ObjectId(userId);
      if (product.BuyUsers.includes(uid)) {
        return res.status(403).json({
          success: false,
          message: "User Already bought this Product ",
        });
      }

      // if all thing is ok so calculate the total amount
      totalAmount += product.price;
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  const options = {
    amount: totalAmount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  };

  // so option ka use karke order create karte hai
  try {
    console.log("a", options);
    //await is must
    const paymentResponse =await  instance.orders.create(options);
    console.log("yha ");
    return res
      .status(201)
      .json({ success: true, message: paymentResponse, log: "Order Created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "can not create the order",
    });
  }
};

// ####THIS IS USED TO FOR VERIFY THE PAYMENT
// if payment success so we assign the course
exports.verifySignature = async (req, res) => {
  // yha mujhe orderId, paymentId and signature ka need hoga so we have to import it
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;

  console.log(
    "All the iD's are",
    "Rozorpay orderid ",
    razorpay_order_id,
    "Rozorpay payment id",
    razorpay_payment_id,
    "Rojorpay signature",
    razorpay_signature
  );
  // find all the courses
  const products = req.body?.products;
  // get the user id
  const userId = req.user.id;
  console.log("user id is ", userId);

  // validate all the above data should be required for buy the course
  // if anyone is not valid so payment is failed
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !products ||
    !userId
  ) {
    return res.status(500).json({
      success: false,
      message: "Payment Failed all data is required",
    });
  }

  // yha par koi logic nhi hai accrding to rezorpay method we do same thing
  let body = razorpay_order_id + "|" + razorpay_payment_id;

  // this is steps we have to follow
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  // match the signatures
  if (expectedSignature === razorpay_signature) {
    // enroll the student in course after signature of payment is made
    await enrollBuyUser(products, userId, res);
    // return the response
    return res.status(200).json({
      success: true,
      message: "Payment Verified",
    });
  }
  return res.status(501).json({
    success: false,
    message: "Payment failed due to mismatch signature",
  });
};

// Enroll the student in courses
const enrollBuyUser = async (products, userId, res) => {
  // es function se courses ke array me traverse karunaga and
  // courses ke modal ke andar enrollStudent ke array me userid ko dalunga and same user modal
  //  ke andar enrollCourses ka array hai usme courses kee id insert karunga

  // step1 validate data
  if (!products || !userId) {
    return res.status(403).json({
      success: false,
      message: "Please provide courses id and userId",
    });
  }

  // st1p2 wo we have multiple course so har ek course me user ko enroll karna padega
  for (const productId of products) {
    try {
      // find the course and enroll the student
      const enrollProduct = await Product.findOneAndUpdate(
        { _id: productId },
        {
          $push: {
            BuyUsers: userId,
          },
        },
        { new: true }
      );

      if (!enrollProduct) {
        return res.status(501).json({
          success: false,
          message: "Courses not found",
        });
      }
      console.log("Updated product: ", enrollProduct);

      // find the student and add the buy products in products array in user modal
      const enrollUser = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            products: productId,
          },
        },
        { new: true }
      );
      console.log("Enroll student is =====>", enrollUser);

      const UpdatedUser = await User.findById(userId)
        .populate("products")
        .exec();
      console.log("updates user schema is ", UpdatedUser);
      const length = UpdatedUser.products.length;
      console.log(
        "Buy Product name ",
        UpdatedUser.products[length - 1].productTitle
      );

      // step 3 send the mail to the user for buy the course successfully

      const emailResponse = await mailSender(
        enrollUser.email,
        `Successfully You Buy ${UpdatedUser.products[length - 1].productTitle}`,
        productBuySuccessfully(
          UpdatedUser.products[length - 1].productTitle,
          `${enrollUser.firstName} ${enrollUser.lastName}`
        )
      );
      console.log("Email sent successfully: ", emailResponse.response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal server issue",
      });
    }
  }
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  // 3no ko body se send kar dunga
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;
  if (!userId || !orderId || !paymentId || !amount) {
    return res.status(403).json({
      success: false,
      message:
        "all details are required such as userId, paymentId, orderId and amount",
    });
  }

  // send the successful but first get the user first by which you get the email and firstName and lastName of the user

  try {
    // enroll student
    const userDetails = await User.findById(userId);
    console.log("Enrolled User Details are", userDetails.email);
    await mailSender(
      userDetails.email,
      `Payment Received `,
      paymentSuccessEmail(
        `${userDetails.firstName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    console.log("Error sending email");
    res.status(500).json({
      success: false,
      message: "Could not send email, Internal server issue",
    });
  }
};
