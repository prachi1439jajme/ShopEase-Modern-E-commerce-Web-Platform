const express = require("express");
const router = express.Router();
const { Verify, isUser } = require("../middlerwares/Verify");
const { createAddress, editAddress, deleteAddress,getAllAddress } = require("../controllers/Address");
router.post("/add-address", Verify, isUser, createAddress);
router.post("/edit-address", Verify, isUser, editAddress);
router.post("/delete-address",Verify,isUser,deleteAddress)
router.get("/all-addresses",Verify,isUser,getAllAddress)


module.exports = router;
