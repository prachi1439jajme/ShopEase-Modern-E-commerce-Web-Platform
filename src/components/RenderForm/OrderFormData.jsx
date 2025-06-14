import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { setStep } from "../../redux/Slices/FormSlice";
import { useDispatch, useSelector } from "react-redux";
import { AiFillDelete } from "react-icons/ai";
import { RiEditFill } from "react-icons/ri";
function OrderFormData() {
  const { cart } = useSelector((state) => state.cart);
  const { token, } = useSelector((state) => state.user);
  const [address, setAddress] = useState(null);
  const dispatch = useDispatch();

  async function getAddress() {
    const toastId = toast.loading("loading");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/address/all-addresses`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("My addresses", res);
      setAddress(res?.data?.recent_Address);
      dispatch(setStep(2));
      // toast.success(res?.data?.message);
    } catch (error) {
      // console.log(error);
      toast.error(error?.response?.data?.error);
      toast.dismiss(toastId);
    }
    toast.dismiss(toastId);
  }
  useEffect(() => {
    getAddress();
  }, []);

  function gotoPrevios() {
    dispatch(setStep(1));
  }

  function gotoNext(){
    dispatch(setStep(3));
  }



  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 mt-14">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl lg:mt-[-4rem]">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Order Summary
        </h2>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* User Address Section */}
          <div>
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Shipping Address
              </h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Full Name:</strong>
                  {address?.fullName}
                </p>
                <p>
                  <strong>Phone:</strong> {address?.phone}
                </p>

                <p>
                  <strong>Address:</strong>
                  {address?.HouseNo_Building_Name},{address?.Road_Area},
                </p>
                <p>
                  <strong>State & City:</strong>
                  {address?.city} {address?.state}
                  {address?.pincode}
                </p>
              </div>
              <div className="flex gap-4">
                <button className=" text-slate-900">
                  <RiEditFill size={24} />
                </button>
                <div className="text-red-600   group transition-transform duration-300 cursor-pointer rounded-full p-3 mr-3">
                  <AiFillDelete className="text-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Product Information Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Products</h3>
            <div className="space-y-4">
              {cart.map((product, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={product?.thumbnail}
                      alt={product.thumbnail}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {product?.productTitle}
                      </h4>
                      <p className="text-gray-600">
                        Quantity: {product?.quantity}
                      </p>
                      <p className="text-gray-600">Price: ₹ {product?.price}</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    ₹ {product?.price * product?.quantity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Order Total
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
        <div className="flex gap-4">
          <button
            onClick={() => gotoPrevios()}
            className="w-full bg-indigo-600 text-white py-2 px-4 mt-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
          >
            Back
          </button>
          <button
            onClick={() => gotoNext()}
            className="w-full bg-indigo-600 text-white py-2 px-4 mt-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderFormData;
