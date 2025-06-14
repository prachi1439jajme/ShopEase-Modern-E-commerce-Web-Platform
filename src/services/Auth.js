import toast from "react-hot-toast";
import { Connector } from "./Connector";
import { setUser, setToken, setEmailSent } from "../redux/Slices/UserSlice";
import { setStep } from "../redux/Slices/FormSlice";
import { setMyOrder } from "../redux/Slices/CartSlice";
export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("loading");
    try {
      const response = await Connector(
        "POST",
        `${process.env.REACT_APP_BASE_URL}/auth/sendotp`,
        { email }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      console.log("response in otp", response);
      toast.success("OTP sent successfully");
      navigate("/verify-email");
      toast.dismiss(toastId);
    } catch (error) {
      toast.error(error.response.data.message);
      toast.dismiss(toastId);
    }
    toast.dismiss(toastId);
  };
}

export function SignUp(
  firstName,
  lastName,
  email,
  password,
  confirm_password,
  otp,
  navigate
) {
  // console.log(firstName, lastName, email, password, confirm_password, otp);
  return async (dispatch) => {
    const toastId = toast.loading("loading");
    try {
      const response = await Connector(
        "POST",
        `${process.env.REACT_APP_BASE_URL}/auth/signup `,
        {
          firstName,
          lastName,
          email,
          password,
          confirm_password,
          otp,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      // console.log(response, "sign up api");
      toast.success("Account Created Successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Signup Failed");
      toast.error(error?.response?.data?.message);

      navigate("/signup");
      toast.dismiss(toastId);
    }
    toast.dismiss(toastId);
  };
}

export function LoginUser(email, password, navigate) {
  console.log(process.env.REACT_APP_BASE_URL);
  return async (dispatch) => {
    // console.log(process.env?.REACT_APP_BASE_URL);
    const toastId = toast.loading("loading");
    try {
      const response = await Connector(
        "POST",
        `${process.env.REACT_APP_BASE_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      // console.log("Login", response);
      if (!response.data.success) {
        throw new Error(" Error Occured while loging ", response.data.message);
      }
      toast.success("Login successfully");

      dispatch(setToken(response.data.token));
      navigate("/");
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
      dispatch(setUser({ ...response.data.user, image: userImage }));
      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.dismiss(toastId);
    } catch (error) {
      // console.log(error);
      toast.error(error.response?.data?.message);
      toast.dismiss(toastId);
      navigate("/login");
    }
    toast.dismiss(toastId);
  };
}

export function LogoutUser(navigate) {
  // console.log("Service i am here ");
  return (dispatch) => {
    const toastId = toast.loading("loading");
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(setStep(1));
    dispatch(setMyOrder([]));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/login");
    toast.dismiss(toastId);
  };
}
export function resetPasswordToken(email) {
  return async (dispatch) => {
    const toastId = toast.loading("loading");
    try {
      const response = await Connector(
        "POST",
        `${process.env.REACT_APP_BASE_URL}/auth/reset-password-token`,
        { email }
      );
      // console.log("response is", response);
      toast.success(response?.data?.message);

      dispatch(setEmailSent(true));
    } catch (error) {
      // console.log(error);
      toast.error(error.response?.data?.message);
      toast.dismiss(toastId);
    }
    toast.dismiss(toastId);
  };
}
