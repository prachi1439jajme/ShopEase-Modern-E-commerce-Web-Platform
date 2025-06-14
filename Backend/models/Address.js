const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      // required: true,
    },
    phone: {
      type: Number,
      trim: true,
      // required: true,
    },

    alterNativePhone: {
      type: Number,
      // trim: true,
    },

    pincode: {
      type: String,
      // required: true,
    },

    state: {
      type: String,
      // required: true,
    },

    city: {
      type: String,
      // required: true,
    },

    HouseNo_Building_Name: {
      type: String,
      // required: true,
    },

    Road_Area: {
      type: String,
      // required: true,
    },

    NearBy: {
      type: String,
      // required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
