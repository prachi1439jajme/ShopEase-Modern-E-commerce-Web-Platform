const express = require("express");
const router = express.Router();
const { Verify, isAdmin } = require("../middlerwares/Verify");
const { createCategory, getAllCategory,categoryPageDetails } = require("../controllers/Category");
router.post("/create-category", Verify, isAdmin, createCategory);
router.get("/getAllCatrgory", getAllCategory);
router.post("/category-info", categoryPageDetails);
module.exports = router;
