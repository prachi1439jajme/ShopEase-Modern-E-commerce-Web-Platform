const express = require("express");
const router = express.Router();
const { Verify } = require("../middlerwares/Verify");
const { updateProfile, deleteAccouunt } = require("../controllers/User");
router.post("/update-profile", Verify, updateProfile);
router.delete("/delete-account", Verify, deleteAccouunt);


module.exports = router;
