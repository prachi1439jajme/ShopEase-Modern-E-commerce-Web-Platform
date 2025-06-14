import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { setMyOrder } from "../../../redux/Slices/CartSlice";
function MyOrders() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const [User, setUser] = useState([]);
  const dispatch = useDispatch();
  async function getUserDataAll() {
    const toastId = toast.loading("fetching");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/auth/user-info`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("we Get the user info", response.data.data.products);
      setUser(response?.data?.data?.products);
      dispatch(setMyOrder(response?.data?.data?.products));
      toast.dismiss(toastId);
    } catch (error) {
      // console.log(error);
      toast.error(error?.response?.data?.message);

      toast.dismiss(toastId);
    }
    toast.dismiss(toastId);
  }

  useEffect(() => {
    getUserDataAll();
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center  py-10 px-4">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-4xl w-full">
        <div className="bg-gray-700 p-6 text-white flex justify-evenly ">
          <div>
            <h2 className="text-3xl font-bold mb-1">Order Information</h2>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <div>
                {User?.length <= 0 ? (
                  <p className="text-gray-700 mb-2 text-2xl font-semibold">
                      You did'nt buy anything yet!!!
                      </p>
                ) : (
                  <>
                    {User?.map((order, index) => (
                      <div className="text-gray-700 mb-2" key={order._id}>
                        <div
                          key={index}
                          className="flex items-center justify-center mx-auto"
                        >
                          <div>
                            <p>
                              <b>Product Name</b>:
                              <span>{order?.productTitle}</span>
                            </p>
                            <p>
                              <b>Price Name</b>:<span>{order?.price}</span>
                            </p>
                            <p>
                              <b>Purchase Date</b>:
                              <span>{order?.createdAt}</span>
                            </p>
                          </div>
                          <div className="w-[150px]  mt-4">
                            <img src={order?.thumbnail} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className="mt-3">
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                >
                  <span className="mr-2">Go to Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MyOrders;
