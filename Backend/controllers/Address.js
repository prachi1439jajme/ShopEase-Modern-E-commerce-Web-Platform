const Address = require("../models/Address");
exports.createAddress = async (req, res) => {
  try {
    // get the address data from req.body

    console.log("create address controller");
    const {
      fullName,
      phone,
      alterNativePhone,
      pincode,
      state,
      city,
      HouseNo_Building_Name,
      Road_Area,
      NearBy,
    } = req.body;
    if (
      !fullName ||
      !phone ||
      !pincode ||
      !state ||
      !city ||
      !HouseNo_Building_Name ||
      !Road_Area
    ) {
      return res.status(403).json({
        success: false,
        message: "All feilds are mandetory",
      });
    }

    console.log(
      fullName,
      phone,
      alterNativePhone,
      pincode,
      state,
      city,
      HouseNo_Building_Name,
      Road_Area,
      NearBy
    );
    // all things good check the

    // i can create maximum 3 address if address value is 3 so i have to return latest address and their is option
    // of edit , delete if address value 0 so we have to show the add address

    // const totalAddress = await Address.find();
    // console.log("Total address", totalAddress);
    // if (totalAddress.length >= 0) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Can't create the address",
    //   });
    // }

    const address = await Address.create({
      fullName,
      phone,
      alterNativePhone,
      pincode,
      state,
      city,
      HouseNo_Building_Name,
      Road_Area,
      NearBy,
    });

    // return the successfull response
    return res.status(201).json({
      success: true,
      message: "Address Added Successfully",
      data: address,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while creating the address",
      error: error.message,
      logg: error,
    });
  }
};
exports.editAddress = async (req, res) => {
  try {
    const { addressId } = req.body;
    // get the address data from req.body
    console.log("edit address controller");
    const {
      fullName,
      phone,
      alterNativePhone,
      pincode,
      state,
      city,
      HouseNo_Building_Name,
      Road_Area,
      NearBy,
    } = req.body;
    console.log("i am here");
    console.log(
      fullName,
      phone,
      alterNativePhone,
      pincode,
      state,
      city,
      HouseNo_Building_Name,
      Road_Area,
      NearBy
    );
    const getaddress = await Address.findById(addressId);
    console.log("address data ", getaddress);
    if (!getaddress) {
      return res.status(404).json({
        success: false,
        message: `Address info not found with id ${addressId} `,
      });
    }

    // remember the syntex {} eske andar id pass karne me update nhi ho rha tha so ek bar syntex check kar le {}
    // enke andar hee value pass kare jo bhi update karna hai agar nhi karoge to old value automatically le lega
    const address = await Address.findByIdAndUpdate(
      addressId,
      {
        fullName,
        phone,
        alterNativePhone,
        pincode,
        state,
        city,
        HouseNo_Building_Name,
        Road_Area,
        NearBy,
      },
      { new: true }
    ).exec();

    console.log("updated address data", address);
    // return the successfull response
    return res.status(201).json({
      success: true,
      message: "Address Updated Successfully",
      data: address,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while updating the address the address",
      error: error.message,
      logg: error,
    });
  }
};

exports.deleteAddress = async (req, res) => {
  console.log("Delete address controller");

  try {
    const { addressId } = req.body;
    // get the address data from req.body
    console.log("addressId", addressId);

    const address = await Address.findById(addressId);
    console.log("address data ", address);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: `Address info not found with id ${addressId} `,
      });
    }
    await Address.findByIdAndDelete({ _id: addressId }).exec();
    // return the successfull response
    return res.status(201).json({
      success: true,
      message: "Address Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while Deleting the address the address",
      error: error.message,
      logg: error,
    });
  }
};
exports.getAllAddress = async (req, res) => {
  console.log("all address controller");

  try {
    const address = await Address.find();
    console.log("address data ", address);
    if (address.length <= 0) {
      return res.status(404).json({
        success: false,
        message: `There is no address found `,
      });
    }

    //  i want the latest address which i want to shopon shipping address

    const latestAddress = await Address.find().sort({ created_at: -1 });
    const recent = latestAddress[latestAddress.length - 1];
    console.log(latestAddress);
    return res.status(201).json({
      success: true,
      message: "Addresses are fetched Successfully",
      data: address,
      recent_Address: recent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while Deleting the address the address",
      error: error.message,
      logg: error,
    });
  }
};
