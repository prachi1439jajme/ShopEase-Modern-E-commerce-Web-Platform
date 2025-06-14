import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import SignUp from "./pages/SignUp";
import AddInformation from "./pages/AddInformation";
import OpenRoute from "./ProtectPage/OpenRoute";
import PrivateRoute from "./ProtectPage/PrivateRoute";
import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./components/MyProfile/Profile";
import MyOrders from "./components/MyProfile/user/MyOrders";
import Footer from "./components/Footer";
import ChangePassword from "./pages/ChangePassword";
import EditProfile from "./components/MyProfile/EditProfile";
import CategoryPageData from "./pages/CategoryPageData";
import CategoryCart from "./components/CategoryFilter/CategoryCart";
import SeachProduct from "./pages/SeachProduct";
import MyCreatedProduct from "./components/MyProfile/admin/MyCreatedProduct";
import EditProductInfo from "./components/MyProfile/admin/EditProductInfo";
import AddNewProduct from "./components/MyProfile/admin/AddNewProduct";
const App = () => {
  return (
    <div>
      <div className="bg-slate-900">
        <Navbar />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <OpenRoute>
              <SignUp />
            </OpenRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route path="/change-password/:token" element={<ChangePassword />} />
        <Route
          path="/verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        <Route path="/search" element={<SeachProduct />} />
        <Route path="/category/:categoryName" element={<CategoryPageData />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <MyOrders />
            </PrivateRoute>
          }
        />
        <Route
          path="/myproducts"
          element={
            <PrivateRoute>
              <MyCreatedProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-product/:id"
          element={
            <PrivateRoute>
              <EditProductInfo />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-Product"
          element={
            <PrivateRoute>
              <AddNewProduct />
            </PrivateRoute>
          }
        />

        <Route
          path="/search"
          element={
            <PrivateRoute>
              <SeachProduct />
            </PrivateRoute>
          }
        />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/cart/address"
          element={
            <PrivateRoute>
              <AddInformation />
            </PrivateRoute>
          }
        />

        <Route path="/mycart" element={<CategoryCart />} />
      </Routes>

      <div className="mt-5 sticky">
        <Footer />
      </div>
    </div>
  );
};

export default App;
