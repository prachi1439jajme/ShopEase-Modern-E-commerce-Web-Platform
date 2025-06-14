import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { sendOtp } from "../services/Auth";
import { setSignupData } from "../redux/Slices/UserSlice";
const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [viewPassword, setViewPassword] = useState(true);
  const [viewConfirmPassword, setViewConfirmPassword] = useState(true);
  const [signupForm, setSignUpFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  function formHandler(event) {
    event.preventDefault();
    setSignUpFormData((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  }

  function submitHandler(event) {
    event.preventDefault();
    if (signupForm.password !== signupForm.confirm_password) {
      toast.error("Password and confirm password value not match ");
      return;
    }
    // console.log("SignUP Data=>", signupForm);
    dispatch(setSignupData(signupForm));
    dispatch(sendOtp(signupForm.email, navigate));
  }

  return (
    <div className="min-h-screen  flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form
            id="signup-form"
            onSubmit={submitHandler}
            className="space-y-1 mb-4"
          >
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm md:text-base text-gray-600 mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Enter FirstName"
                value={signupForm.firstName}
                onChange={formHandler}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm md:text-base text-gray-600 mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Enter LastName"
                value={signupForm.lastName}
                onChange={formHandler}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm md:text-base text-gray-600 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter Email"
                value={signupForm.email}
                onChange={formHandler}
                required
                className="w-full px-4 py-2 border  rounded-md focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm md:text-base text-gray-600 mb-2"
              >
                Password
              </label>
              <input
                type={viewPassword ? "password" : "text"}
                id="password"
                name="password"
                placeholder="Enter Password "
                value={signupForm.password}
                onChange={formHandler}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              />
              <span
                className="absolute top-[37px] right-3 cursor-pointer bg-blue-500 text-white rounded-full p-2"
                onClick={() => setViewPassword(!viewPassword)}
              >
                {viewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            <div className="relative">
              <label
                htmlFor="confirm_password"
                className="block text-sm md:text-base text-gray-600 mb-2"
              >
                Confirm Password
              </label>
              <input
                type={viewConfirmPassword ? "password" : "text"}
                id="confirm_password"
                name="confirm_password"
                value={signupForm.confirm_password}
                placeholder="Re Enter password"
                onChange={formHandler}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              />
              <span
                className="absolute top-[37px] right-3 cursor-pointer bg-blue-500 text-white rounded-full p-2"
                onClick={() => setViewConfirmPassword(!viewConfirmPassword)}
              >
                {viewConfirmPassword ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )}
              </span>
            </div>
            <div className="text-center">
              <Link to="/login" className="ml-2 block text-sm text-gray-900">
                Already have an account?
                <span className="font-medium text-indigo-600 hover:text-indigo-500">
                  Login
                </span>
              </Link>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 mt-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
