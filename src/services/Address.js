import toast from "react-hot-toast";
import { Connector } from "./Connector";
export function Address(
  fullName,
  phone,
  alterNativePhone,
  pincode,
  state,
  city,
  HouseNo_Building_Name,
  Road_Area,
  NearBy,
  token
) {
  // console.log("Date in address services #############################################3",
  //   fullName,
  //   phone,
  //   alterNativePhone,
  //   pincode,
  //   state,
  //   city,
  //   HouseNo_Building_Name,
  //   Road_Area,
  //   NearBy
  // );
  return async (dispatch) => {
    const toastId = toast.loading("loading");
    try {
      const response = await Connector(
        "POST",
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

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      // console.log(response, "Address  api", response);
      toast.success("Account Created Successfully");
      dispatch();
      //   navigate("/cart/order-details");
    } catch (error) {
      toast.error("Address can not created");
      toast.error(error?.response?.data?.message);

      //   navigate("/signup");
      // console.log("@@@@@@@@@@@", error, error.message);
      toast.dismiss(toastId);
    }
    toast.dismiss(toastId);
  };
}
