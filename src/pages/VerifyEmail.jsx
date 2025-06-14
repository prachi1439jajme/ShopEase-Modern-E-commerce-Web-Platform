import React, { useState } from "react";
import OTPInput from "react-otp-input";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { RxCountdownTimer } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { SignUp } from "../services/Auth";
import { sendOtp } from "../services/Auth";
function VerifyEmail() {
  const { signupData } = useSelector((state) => state.user);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // console.log("data in signup page ", signupData);
  const { firstName, lastName, email, password, confirm_password } = signupData;
  function veriFyEmail(event) {
    event.preventDefault();
    setLoading(true);
    dispatch(
      SignUp(
        firstName,
        lastName,
        email,
        password,
        confirm_password,
        otp,
        navigate
      )
    );
    setLoading(false);
  }
  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
      {loading ? (
        <p>Loding</p>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">
            Verify Email
          </h1>
          <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">
            A verification code has been sent to you. Enter the code below
          </p>
          <form onSubmit={veriFyEmail}>
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-[48px] lg:w-[60px] border-0 bg-blue-950 rounded-[0.5rem]  text-white aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 mt-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
            >
              Verify Email
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between">
            <Link to="/signup">
              <p className=" flex items-center gap-x-2 font-medium text-indigo-600 hover:text-indigo-500">
                <FaArrowLeftLong size={20} /> Back To Signup
              </p>
            </Link>
            <button
              className="flex items-center  gap-x-2 font-medium text-indigo-600 hover:text-indigo-500"
              onClick={() => dispatch(sendOtp(signupData.email, navigate))}
            >
              <RxCountdownTimer />
              Resend it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;
