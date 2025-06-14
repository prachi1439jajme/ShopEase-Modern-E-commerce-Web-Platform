const { default: mongoose } = require("mongoose");
const Product = require("../models/Product");
const RatingAndReview = require("../models/RatingAndReview");
const User = require("../models/User");

// createRating and review
exports.createRatingAndReview = async (req, res) => {
  console.log("We are in create rating and review controller");
  try {
    // find the user who want to review
    const userId = req.user.id;
    // fetch the data from the body
    const { productId, rating, review } = req.body;

    // check if user is enrolled in course or not
    const productDetails = await Product.findOne({
      _id: productId,
      // studentEnrolled array ke anadar ye userId match hui to
      BuyUsers: { $elemMatch: { $eq: userId } },
    });

    if (!productDetails) {
      return res.status(404).json({
        success: false,
        message: "Student not enrolled in this course",
      });
    }

    // check a student is already review or not if already review we can not allow to student for again review to the course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      product: productId,
    });

    if (alreadyReviewed) {
      return res.status(500).json({
        success: false,
        message: "Student already reviewed this course ",
      });
    }

    // create the rating and review
    const newRatingAndReviews = await RatingAndReview.create({
      review,
      rating,
      course: courseId,
      user: userId,
    });

    // update the course schema bcs course schema contain rating and review array
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: productId },
      {
        $push: {
          ratingAndReviews: newRatingAndReviews._id,
        },
      },
      { new: true }
    );

    // console.log(updatedCourse);
    // return the response
    return res.status(201).json({
      success: true,
      message: "User has Reviewed  and rating succssfully",
      ratingAndReviews: newRatingAndReviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Can't create the rating and review, Internal server problem ",
      error: error.message,
    });
  }
};

// getAverageRating
exports.getAverageRating = async (req, res) => {
  console.log("we are in get average rating of each course ");
  try {
    // need course id that means kon se course me rate and review kar rhe ho
    const productId = req.body.courseId;
    // calculate the avarage rating

    // aggerate function se we get only single value averageRating from  line no.87 to 97
    const result = await RatingAndReview.aggregate([
      {
        // rating and review schema ke andar course name ke array me jakar ke check karo courseId present hai
        $match: {
          product: new mongoose.Types.ObjectId(productId),
        },
      },

      // agar courseid prsent hai to jitni id hai sab ko group kar do than unka average calculate kar do
      // and jo average result aae uska name averageRating de do
      {
        $group: {
          _id: null,
          averageRating: { $avg: "rating" },
        },
      },
    ]);

    console.log("result is ", result);
    // if  rating found return result
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }

    // if NO rating found return result

    return res.status(200).json({
      success: true,
      averageRating: 0,
      message: "Average Rating is 0, No rating and review found till now ",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Can't create the Average rating and review, Internal server problem ",
      error: error.message,
    });
  }
};

// get all the rating and reviews
exports.getAllRatingsAndReviews = async (req, res) => {
  console.log("We are in all rating and reviews controllers");
  try {
    const getAllRatingReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        // only rating and review contain below 5things
        select: "firstName lastName email image",
      })
      .populate({
        path: "product",
        // only the courseName need when you get all the review and ratings
        select: "productTitle",
      })
      .exec();

    // retun response
    return res.status(200).json({
      success: true,
      data: getAllRatingReviews,
      message: " All rating and reviews fetched ",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Can't get all Rating and review, Internal server problem ",
      error: error.message,
    });
  }
};
