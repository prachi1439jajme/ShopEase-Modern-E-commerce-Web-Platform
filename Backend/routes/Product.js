const express = require("express");
const router = express.Router();
const { Verify, isAdmin } = require("../middlerwares/Verify");
const { createProduct, getAllProduct,getProductDetails,deleteProduct,editProduct } = require("../controllers/Product");
router.post("/create-product", Verify, isAdmin, createProduct);
router.get("/all-product", getAllProduct);
router.post("/product-info", getProductDetails);
router.post("/edit-product/:id",Verify,isAdmin,editProduct );
router.post("/delete-product",Verify,isAdmin,deleteProduct );




module.exports = router;
