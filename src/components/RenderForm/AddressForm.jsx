import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { setStep } from "../../redux/Slices/FormSlice";

function AddressForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const [addressFormData, setAddressFormData] = useState({
    fullName: "",
    phone: "",
    alterNativePhone: "",
    pincode: "",
    state: "",
    city: "",
    HouseNo_Building_Name: "",
    Road_Area: "",
    NearBy: "",
  });

  function formHandler(event) {
    event.preventDefault();
    setAddressFormData((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  }
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
  } = addressFormData;

  async function submitHandler(event) {
    event.preventDefault();
    // console.log(addressFormData);
    
    const toastId = toast.loading("creating");
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/address/add-address`,
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
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(res);
      dispatch(setStep(2));
      // navigate("/cart/order-details");
      toast.success(res?.data?.message);
    } catch (error) {
      // console.log(error);
      toast.error(error?.response?.data?.error);
      toast.dismiss(toastId);
    }
    toast.dismiss(toastId);
  }

  function gotoPrevios() {
    navigate("/cart");
    dispatch(setStep(1));
  }

  

  return (
    <div className="min-h-screen flex flex-col justify-center  sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-[1000px] sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Enter your address details
        </h2>
        <div className="mt-5 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form
            id="address-form"
            onSubmit={submitHandler}
            className="space-y-4 mb-4"
          >
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm md:text-base text-gray-600"
              >
                Full Name <span className="text-pink-500 text-xl">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter Full Name"
                value={addressFormData.fullName}
                onChange={formHandler}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm md:text-base text-gray-600 "
              >
                Phone <span className="text-pink-500 text-xl">*</span>
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Enter Phone Number"
                value={addressFormData.phone}
                onChange={formHandler}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="alterNativePhone"
                className="block text-sm md:text-base text-gray-600"
              >
                Alternative Phone
              </label>
              <input
                type="text"
                id="alterNativePhone"
                name="alterNativePhone"
                placeholder="Enter Alternative Phone Number"
                value={addressFormData.alterNativePhone}
                onChange={formHandler}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="pincode"
                className="block text-sm md:text-base text-gray-600"
              >
                Pincode <span className="text-pink-500 text-xl">*</span>
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                placeholder="Enter Pincode"
                value={addressFormData.pincode}
                onChange={formHandler}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-sm md:text-base text-gray-600"
              >
                State <span className="text-pink-500 text-xl">*</span>
              </label>
              <input
                type="text"
                id="state"
                name="state"
                placeholder="Enter State"
                value={addressFormData.state}
                onChange={formHandler}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm md:text-base text-gray-600"
              >
                City <span className="text-pink-500 text-xl">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="Enter City"
                value={addressFormData.city}
                onChange={formHandler}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="HouseNo_Building_Name"
                className="block text-sm md:text-base text-gray-600"
              >
                House No. or Building Name{" "}
                <span className="text-pink-500 text-xl">*</span>
              </label>
              <input
                type="text"
                id="HouseNo_Building_Name"
                name="HouseNo_Building_Name"
                placeholder="Enter House No."
                value={addressFormData.HouseNo_Building_Name}
                onChange={formHandler}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="Road_Area"
                className="block text-sm md:text-base text-gray-600 "
              >
                Road/Area/Colony{" "}
                <span className="text-pink-500 text-xl">*</span>
              </label>
              <input
                type="text"
                id="Road_Area"
                name="Road_Area"
                placeholder="Enter Road/Area/Colony Name"
                value={addressFormData.Road_Area}
                onChange={formHandler}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="NearBy"
                className="block text-sm md:text-base text-gray-600 "
              >
                Landmark (Nearby Shop/Mall)
              </label>
              <input
                type="text"
                id="NearBy"
                name="NearBy"
                placeholder="Enter Landmark"
                value={addressFormData.NearBy}
                onChange={formHandler}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => gotoPrevios()}
                className="w-full bg-indigo-600 text-white py-2 px-4 mt-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 mt-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddressForm;
