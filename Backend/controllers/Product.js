const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadImageThumbnail } = require("../utility/uploadImageThumbnail");

// create the Product

exports.createProduct = async (req, res) => {
  try {
    console.log("we are in create Product controller");
    // step-3 check for admin at the product creation we need admin  id so admin can create the product
    const userId = req.user.id;
    console.log("User id is ", userId);

    //step-1 fetch the Product data from the body
    const { productTitle, productDescription, price, category } = req.body;
    console.log(
      "title====>",
      productTitle,
      "discription========",
      productDescription,
      "price=======",
      price,
      "categoryId===================>",
      category
    );
    // get the image thumbnail from req.files
    // thumbnail is the key in post when you uplaod the data from the postman form data
    const thumbnailImage = req.files.thumbnail;

    console.log("image getting", thumbnailImage);

    // console.log("thumbnail", thumbnailImage);
    // step-2 validate the data
    if (!productTitle || !productDescription || !price || !category) {
      return res.status(403).json({
        success: false,
        message: "All feilds are required for the creation  of Product ",
      });
    }

    const adminDetails = await User.findById(userId)
      .populate("additionalDetails")
      .exec();
    console.log("admin details ", adminDetails);

    //step-4 Validate the instructor details
    if (!adminDetails) {
      return res.status(404).json({
        success: false,
        message: "Admin details are not found ",
      });
    }

    const categoryDetails = await Category.findById(category)
      .populate("products")
      .exec();
    console.log("category details", categoryDetails);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "category details are not found ",
      });
    }

    //step-6 upload img to cloudinary

    const uplaodImage = await uploadImageThumbnail(
      thumbnailImage,
      process.env.FOLDER_NAME
    );
    // console.log("upload image ",uplaodImage);
    // console.log("Uploading image contain this data =>", uplaodImage);

    //step-7 if all things are good so we create a Product
    const newProduct = await Product.create({
      productTitle,
      productDescription,
      admin: adminDetails._id,
      price,
      category: categoryDetails._id,
      thumbnail: uplaodImage.secure_url,
    });

    console.log("new product is ", newProduct);
    //step-9 add the new Product to the user schema of user
    await User.findByIdAndUpdate(
      { _id: adminDetails._id },
      {
        $push: {
          // Products array ke andar we insert the newproductId  in user schema Product array
          products: newProduct._id,
        },
      },
      {
        new: true,
      }
    );

    const categoriesAllInfo = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          // Tag schema ke andar Product ka array hai vha par bhe created Product kee id dal do
          products: newProduct._id,
        },
      },
      {
        new: true,
      }
    ).populate("products");

    // console.log("categoris schema after updating ", categoriesAllInfo);
    // step-11 return the response
    res.status(201).json({
      success: true,
      data: newProduct,
      message: "Product Created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to create a Product ,Internal server Issue",
    });
  }
};

// get all the Product

exports.getAllProduct = async (req, res) => {
  console.log("all product controller");
  try {
    // when you fetch the product so the product must have productTitle,productDescription,price,thumbnail
    const allProduct = await Product.find().exec();
    return res.status(200).json({
      success: true,
      AllProduct: allProduct,
      message: "All Products are fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to fetch all products, Internal server Issue",
    });
  }
};

// getAllDetailsOfProducts
exports.getProductDetails = async (req, res) => {
  console.log("all info of single product ");
  try {
    // need productId so, productId we get from the request body
    const { productId } = req.body;
    console.log("product id is ", productId);
    if (!productId) {
      return res.status(404).json({
        success: false,
        message: "Product id not found",
      });
    }
    console.log("I am here");

    const productDetails = await Product.findOne({ _id: productId })
      .populate({
        path: "admin",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      // .populate("ratingAndReviews")
      .exec();

    console.log("details ", productDetails);
    // validate the Product details
    if (!productDetails) {
      return res.status(400).json({
        success: false,
        message: `Product details not found corresponding to this productId ${productId}`,
      });
    }

    // return the response
    return res.status(200).json({
      success: true,
      message: "All the Details of the Products are fetched ",
      data: productDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Failed to get all the details of the Product, Internal server problem",
      error: error.message,
    });
  }
};

// Delete the Product
exports.deleteProduct = async (req, res) => {
  console.log("inside delete");
  console.log("we are deleting single Product by their product id controller");
  try {
    const productId = req.body.id;
    console.log("product id", productId);
    const userId = req.user.id;

    // console.log("This is Product id", productId);
    // Find the Product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "product not found",
      });
    }

    console.log("info ", product);

    // find the category so also delete the Product from the category
    const categoryInfo = await Category.findById({ _id: product.category });
    // console.log("This Product belong to ", categoryInfo._id);
    // console.log("category schema before Product delete ", categoryInfo);

    // Unenroll students from the Product
    const studentsEnrolled = product.BuyUsers;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { products: productId },
      });
    }
    console.log(studentsEnrolled);

    // user scehema ke andar products hai so vha se bhi delete karke hee final product ke delete kare
    const updateUserProduct = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $pull: { products: productId },
      }
    ).exec();

    console.log("now user have this product", updateUserProduct);

    // Delete the Product
    await Product.findByIdAndDelete(productId);

    // update the category schema bcs vha par bhi Product kee id hai so vha se Product kee id delete kar denge
    const updateCat = await Category.findByIdAndUpdate(
      { _id: categoryInfo._id },
      {
        $pull: { products: productId },
      }
    ).exec();
    // console.log("category schema after Product delete ", updateCat);
    console.log("my updated product list are", updateCat);
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      Data: updateUserProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

// Edit Product Details
exports.editProduct = async (req, res) => {
  console.log("we are edit Product by their productId controller");
  const userid = req.user.id;
  console.log("user id is ", userid);
  try {
    const productId = req.params.id;

    console.log("product id is", productId);
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update");
      const thumbnail = req.files.thumbnail;
      const thumbnailImage = await uploadImageThumbnail(
        thumbnail,
        process.env.FOLDER_NAME
      );
      Product.thumbnail = thumbnailImage.secure_url;
    }

    // if we you get wanna change the title,price, discription
    const { productTitle, productDescription, price } = req.body;
    console.log(productTitle, productDescription, price);

    await product.save();

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { productTitle, productDescription, price },
      { new: true }
    )
      .populate({
        path: "admin",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      // .populate("ratingAndReviews")
      .exec();

    return res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
