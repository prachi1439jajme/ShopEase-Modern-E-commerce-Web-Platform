import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPaymentLoading, setStep } from "../../redux/Slices/FormSlice";
import { resetCart } from "../../redux/Slices/CartSlice";
import axios from "axios";
import toast from "react-hot-toast";
function PaymentForm() {
  const { cart } = useSelector((state) => state.cart);
  const { user, token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function gotoPrevios() {
    dispatch(setStep(2));
  }

  // step -1
  function loadScript(src) {
    // on the basis ko success our handler call otherwise not
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  // step-2
  async function buyItem(token, products, userDetails, navigate, dispatch) {
    const toastId = toast.loading("loading");
    try {
      //   load the script first  so call loadScript() function
      // copy below url from razorpay
      const response = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      //   check valid or not
      if (!response) {
        toast.error("RazorPay SDK failed to load");
        return;
      }

      // initiate the order by capture function  which is in controller
      // order initialize capture payment karta hai
      const orderResponse = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/payment/capturePayment`,
        { products },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!orderResponse?.data.success) {
        throw new Error(
          "Got error while create order",
          orderResponse?.data.message
        );
      }

      // console.log("PRINTING orderResponse", orderResponse);

      // make the options->go razorpay website there you can see
      // what parameter need to give inside options

      const options = {
        // sab .env file se mil jayga
        // try karo jo response aa rha use form se nikalo orderResponse.data.message
        // always cross check kis form me data return ho rha hai
        key: process.env.RAZORPAY_KEY_ID,
        currency: orderResponse.data.message.currency,
        amount: `${orderResponse.data.message.amount}`,
        order_id: orderResponse.data.message.id,
        name: "Shopping24",
        description: "Thank You for Purchasing the items",
        //   image: rzpLogo,
        prefill: {
          name: `${userDetails.firstName}`,
          email: userDetails.email,
        },
        handler: function (response) {
          //send successful wala mail
          sendPaymentSuccessEmail(
            response,
            orderResponse.data.message.amount,
            token
          );
          //verifyPayment
          verifyPayment({ ...response, products }, token, navigate, dispatch);
        },
      };

      // create the razorpay window modal
      const paymentObject = new window.Razorpay(options);
      // open the diler box of rezorpay
      paymentObject.open();
      // give some info also by this
      paymentObject.on("payment.failed", function (response) {
        toast.error("Opps!!! Payment Failed");
        // console.log(response.error);
      });
    } catch (error) {
      // console.log("PAYMENT API ERROR.....", error);
      // console.log(error?.response?.data?.message);
      toast.error(
        "Could not make payment because " + error?.response?.data?.message
      );
    }
    toast.dismiss(toastId);
  }

  // send the course buy successful email
  // token use bcs we do authorization
  async function sendPaymentSuccessEmail(response, amount, token) {
    try {
      // call the backend emailsend payment function/controller
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/payment/sendPaymentSuccessEmail`,
        {
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      // console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
      toast.error(error?.response?.data?.message);
    }
  }

  async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment....");
    //   slice ke setPayment loading vale flag ko true kar do
    dispatch(setPaymentLoading(true));
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/payment/verifySignature`,
        bodyData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error("Mismatch signature ", response.data.message);
      }
      toast.success("payment Successful, your item added to myorders");

      // goto your enrolled courses
      await navigate("/orders");
      // you did all things in card so reset the card so code is added
      dispatch(setStep(1));
      dispatch(resetCart());
    } catch (error) {
      // console.log("PAYMENT VERIFY ERROR....", error);
      toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    //   mark the setPayment flag false bcs ya to payment ho gayi hai ya failed ho gai hai
    dispatch(setPaymentLoading(false));
  }

  function handleBuyCourse() {
    const courses = cart.map((course) => course._id);
    // console.log("our courses id are", courses);
    // h/w payment integration gateway

    buyItem(token, courses, user, navigate, dispatch);
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 mt-1">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Payment
        </h2>
        <div className="mt-8 max-w-sm mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-6 mb-[10rem]">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {" "}
              Total Amount :{" "}
            </h3>
            <div className="text-lg font-semibold text-gray-700">
              ₹
              {cart
                .reduce(
                  (total, product) =>
                    total + product?.price * product?.quantity,
                  0
                )
                .toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => gotoPrevios()}
          className="w-full bg-indigo-600 text-white py-2 px-4 mt-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
        >
          Back
        </button>
        <button
          onClick={handleBuyCourse}
          className="w-full bg-indigo-600 text-white py-2 px-4 mt-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}

export default PaymentForm;
