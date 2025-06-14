import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordToken } from "../services/Auth";
import { setEmailSent } from "../redux/Slices/UserSlice";
function ForgotPassword() {
  const { isEmailSent } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const naviagate = useNavigate();

  function goToLogin(event) {
    event.preventDefault();
    naviagate("/login");
    dispatch(setEmailSent(false));
  }

  function sumbitHandler(event) {
    event.preventDefault();
    if (email === "") {
      toast.error("Please enter email id");
      return;
    }
    setLoading(true);
    dispatch(resetPasswordToken(email));
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {loading ? (
        <div className="flex items-center justify-center mt-36">Loading</div>
      ) : (
        <div className="w-full max-w-md  shadow-lg rounded-lg p-6 hover:shadow-xl transition-transform transform hover:-translate-y-1">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl text-gray-800 font-semibold">
              {!isEmailSent ? "Reset Your Password" : "Check Your Email"}
            </h1>
            <p className="mt-4 text-gray-600 text-sm md:text-lg leading-6">
              {!isEmailSent
                ? "Have no fear. We’ll email you instructions to reset your password. If you don't have access to your email we can try account recovery."
                : `We have sent the reset email to ${email}`}
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={sumbitHandler} className="space-y-6">
              {!isEmailSent && (
                <div>
                  <label className="block text-sm md:text-base text-gray-800 mb-1">
                    Email address <sup className="text-pink-500">*</sup>
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={email}
                    placeholder="Enter email"
                    className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm "
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white text-sm md:text-base px-6 py-3 rounded-lg font-bold shadow-md hover:scale-95 transition-transform duration-200"
                >
                  {!isEmailSent ? "Send Reset Password Link" : "Resend email"}
                </button>
              </div>

              <div className="mt-4 text-indigo-600 flex items-center justify-center gap-3">
                <FaArrowLeftLong size={20} />
                <button
                  type="button"
                  onClick={goToLogin}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Back to login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
