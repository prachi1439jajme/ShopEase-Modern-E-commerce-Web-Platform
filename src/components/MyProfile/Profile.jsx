import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { setUser, setToken } from "../../redux/Slices/UserSlice";
export default function Profile() {
  const { user, token } = useSelector((state) => state.user);
  const { myOrder } = useSelector((state) => state.cart);
  // console.log("in profile order", myOrder);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEdit = () => {
    navigate("/edit-profile");
  };
  const handleDelete = async () => {
    const toastId = toast.loading("deleting");
    try {
      // me record ko delte kar rha hu so i have to axios.delete karna padega but me axios.post kar rha hu to vah token ko verify nhi kar rha hai
      // backend me agar post method se delete kar rhe ho to frontend me delete hamesa axops.delete se hoga agar axios use kar rhe ho
      // axios se post se vo token ko verify nhi karega and unautherize show karega
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/profile/delete-account`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.dismiss(toastId);
      toast.success(response?.data?.message);
      dispatch(setUser(null));
      dispatch(setToken(null));
      navigate("/login");

      // console.log(response);
    } catch (error) {
      // console.log(error, error.message, error.logs);
      toast.error(error.response.data.message);
      toast.dismiss(toastId);
    }
    toast.dismiss(toastId);
  };
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center  py-10 px-4">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-4xl w-full">
          <div className="bg-gray-700 p-6 text-white">
            <div className="flex justify-around max-sm:flex-wrap">
              <div>
                <h2 className="text-3xl font-bold mb-1">{`${user?.firstName} ${user?.lastName}`}</h2>
                <p className="text-sm">{user?.email}</p>
              </div>
              <div>
                <img
                  src={user?.image}
                  alt="profile"
                  className="h-[50px] w-[50px] rounded-full"
                />
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Profile Information
                </h3>
                <p className="text-gray-700">
                  <strong>Contact:</strong> {user?.additionalDetails?.contact}
                </p>

                <p className="text-gray-700">
                  <strong>Date of Birth:</strong>{" "}
                  {user?.additionalDetails?.dateOfBirth}
                </p>
                <p className="text-gray-700">
                  <strong>Gender:</strong> {user?.additionalDetails?.gender}
                </p>
              </div>
              <div>
                {user.role === "user" ? (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Order History
                    </h3>

                    <div className="text-gray-700 mb-2">
                      {user?.products?.length <= 0 ? (
                        <p className="text-2xl font-semibold">
                          You did'nt buy anything yet!!!
                        </p>
                      ) : (
                        <div>
                          <p>
                            <b>Product Name</b>:
                            <span>{user?.products[0]?.productTitle}</span>
                          </p>
                          <p>
                            <b>Price Name</b>:
                            <span>{user?.products[0]?.price}</span>
                          </p>
                          <p>
                            <b>Purchase Date</b>:
                            <span>{user?.products[0]?.createdAt}</span>
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-10">
                      <button
                        onClick={() => navigate("/orders")}
                        className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                      >
                        <span className="mr-2">View All Orders</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      My Created Product
                    </h3>

                    <div className="text-gray-700 mb-2">
                      {user?.products?.length <= 0 ? (
                        <p className="text-2xl font-semibold">
                          You did'nt create any product yet!!!
                        </p>
                      ) : (
                        <div>
                          <p>
                            <b>Product Name</b>:
                            <span>{user?.products[0]?.productTitle}</span>
                          </p>
                          <p>
                            <b>Price Name</b>:
                            <span>{user?.products[0]?.price}</span>
                          </p>
                          <p>
                            <b>Purchase Date</b>:
                            <span>{user?.products[0]?.createdAt}</span>
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-10">
                      {user?.role === "user" && (
                        <button
                          onClick={() => navigate("/orders")}
                          className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                        >
                          <span className="mr-2">View My Orders</span>
                        </button>
                      )}

                      {user?.role === "admin" && (
                        <button
                          onClick={() => navigate("/myproducts")}
                          className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                        >
                          <span className="mr-2">View My Product</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-6 max-sm: flex-wrap max-sm:gap-3 max-sm:mt3">
              <button
                onClick={handleEdit}
                className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
