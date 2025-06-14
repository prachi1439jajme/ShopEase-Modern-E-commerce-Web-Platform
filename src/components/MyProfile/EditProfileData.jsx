import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/Slices/UserSlice";
function EditProfileData() {
  const { user, token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const genders = [
    "Male",
    "Female",
    "Transgender",
    "Prefer not to say",
    "Other",
  ];

  async function handleSumitFormData(formData) {
    const toastId = toast.loading("updating profile");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/profile/update-profile`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Update Profile data api response is ", response);
      toast.success(response?.data?.message);
      toast.dismiss(toastId);
      dispatch(setUser(response?.data?.date));
      navigate("/profile");
    } catch (error) {
      // console.log("getting error while updating the profile info", error);
      toast.error(error?.response?.message);
      toast.dismiss(toastId);
    }
    toast.dismiss(toastId);
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-4xl w-full">
        <div className="bg-gray-700 p-6 text-white">
          <h2 className="text-3xl font-bold mb-1">Edit Profile Information</h2>
        </div>
        <div className="p-8">
          <form className="w-full" onSubmit={handleSubmit(handleSumitFormData)}>
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <p className="block text-gray-700 mb-1">First Name</p>
                  <p className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none">
                    {user?.firstName}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="block text-gray-700 mb-1">Last Name</p>
                  <p className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none">
                    {user?.lastName}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <p className="block text-gray-700 mb-1">Email</p>
                <p className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none">
                  {user?.email}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-gray-700 mb-1"
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                    {...register("dateOfBirth", {
                      required: {
                        value: true,
                        message: "Please enter your Date of Birth.",
                      },
                      max: {
                        value: new Date().toISOString().split("T")[0],
                        message: "Date of Birth cannot be in the future.",
                      },
                    })}
                    defaultValue={user?.additionalDetails?.dateOfBirth}
                  />
                  {errors.dateOfBirth && (
                    <span className="-mt-1 text-[12px] text-pink-600">
                      {errors.dateOfBirth.message}
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="gender" className="block text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    id="gender"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                    {...register("gender", { required: true })}
                    defaultValue={user?.additionalDetails?.gender}
                  >
                    {genders.map((ele, i) => (
                      <option key={i} value={ele}>
                        {ele}
                      </option>
                    ))}
                  </select>
                  {errors.gender && (
                    <span className="-mt-1 text-[12px] text-pink-600">
                      Please enter your gender.
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="contact" className="block text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    id="contact"
                    placeholder="Enter Contact Number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                    {...register("contact", {
                      required: {
                        value: true,
                        message: "Please enter your Contact Number.",
                      },
                      maxLength: {
                        value: 12,
                        message: "Invalid Contact Number",
                      },
                      minLength: {
                        value: 10,
                        message: "Invalid Contact Number",
                      },
                    })}
                    defaultValue={user?.additionalDetails?.contact}
                  />
                  {errors.contact && (
                    <span className="-mt-1 text-[12px] text-pink-600">
                      {errors.contact.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => navigate("/profile")}
                className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfileData;
