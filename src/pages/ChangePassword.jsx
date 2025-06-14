import React, { useState } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmshowPassword, setConfirmshowPassword] = useState(false);
  const { token } = useParams();
  // console.log("token value is ", token);
  const navigate = useNavigate();
  const [chnagePassForm, setchnagePassFormData] = useState({
    password: "",
    confirm_password: "",
  });

  function formHandler(event) {
    event.preventDefault();
    setchnagePassFormData((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function submitHandler(event) {
    event.preventDefault();
    if (chnagePassForm.password !== chnagePassForm.confirm_password) {
      toast.error("Password and confirm password value not match ");
      return;
    }
    const { password, confirm_password } = chnagePassForm;
    const toastId = toast.loading("reseting");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/reset-password`,

        { password, confirm_password, token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response?.data?.message);
      toast.dismiss(toastId);
      navigate("/login");
    } catch (error) {
      // console.log(error);
      toast.error(error?.response?.data?.message);
      toast.dismiss(toastId);
    }
    toast.dismiss(toastId);
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-lg bg-gradient-to-r from-gray-100 to-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-transform transform hover:-translate-y-1  flex flex-col justify-center items-center">
        <h1 className="text-2xl md:text-4xl text-gray-800 font-semibold text-center">
          Choose new password
        </h1>
        <p className="mt-4 text-gray-500 text-base md:text-lg leading-6 text-center">
          Almost done. Enter your new password and you're all set.
        </p>
        <form
          onSubmit={submitHandler}
          className="flex flex-col w-full gap-y-4 mt-6"
        >
          <label className="relative w-full">
            <p className="text-sm md:text-base text-gray-800 mb-1 leading-tight">
              Create New Password <sup className="text-pink-500">*</sup>
            </p>

            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={chnagePassForm.password}
              onChange={formHandler}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
            />

            <span
              className="absolute right-4 top-9 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiOutlineEye fontSize={20} />
              ) : (
                <AiOutlineEyeInvisible fontSize={22} />
              )}
            </span>
          </label>

          <label className="relative w-full">
            <p className="text-sm md:text-base text-gray-800 mb-1 leading-tight">
              Confirm New Password <sup className="text-pink-500">*</sup>
            </p>

            <input
              type={confirmshowPassword ? "text" : "password"}
              id="confirm_password"
              name="confirm_password"
              value={chnagePassForm.confirm_password}
              onChange={formHandler}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
            />
            <span
              className="absolute right-4 top-9 cursor-pointer"
              onClick={() => setConfirmshowPassword(!confirmshowPassword)}
            >
              {confirmshowPassword ? (
                <AiOutlineEye fontSize={20} />
              ) : (
                <AiOutlineEyeInvisible fontSize={22} />
              )}
            </span>
          </label>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-lg font-medium py-2 mt-4 hover:bg-blue-600 transition duration-300"
          >
            Reset Password
          </button>
        </form>
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center text-gray-800 gap-3">
            <FaArrowLeftLong />
            <button
              onClick={() => navigate("/login")}
              className="underline hover:text-blue-500 transition duration-300"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
