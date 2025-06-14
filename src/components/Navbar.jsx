import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrClose } from "react-icons/gr";
import { LogoutUser } from "../services/Auth";
import toast from "react-hot-toast";
import axios from "axios";
import { FaTimes } from "react-icons/fa"; // Import the cross icon

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const [showMenu, setShowMenu] = useState(false);
  const [category, setCategory] = useState([]);
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  // console.log("cart me item", cart);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const toggleDropdown1 = () => {
    setIsOpen1(!isOpen1);
  };

  async function getAllCategory() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/category/getAllCatrgory`
      );
      // console.log("category response ", response);
      setCategory(response?.data?.data);
      setLoading(false);
    } catch (error) {
      // console.log(error);
      toast.error(error?.response?.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllCategory();
  }, []);
  // console.log("now we have in ca", category);

  function handleCloseDropdownCategory() {
    setIsOpen1(false);
  }
  function handleCloseDropdownProfile() {
    setIsOpen(false);
  }
  return (
    <div>
      <nav className="bg-gray-800 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center h-20">
            <div>
              <NavLink
                to="/"
                className="text-4xl font-bold 
              max-md:text-2xl
              max-sm:text-xl"
              >
                Shopping24
              </NavLink>
            </div>

            <div className="flex items-center space-x-4 md:hidden">
              <button
                onClick={toggleMenu}
                className="text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                {showMenu ? (
                  <GrClose size={20} />
                ) : (
                  <GiHamburgerMenu size={28} />
                )}
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <div className="relative ml-5">
                <button
                  onClick={toggleDropdown1}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md font-medium focus:outline-none focus:bg-gray-700 focus:text-white text-xl"
                >
                  category
                </button>
                {isOpen1 && (
                  <div className="relative">
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 text-xl">
                        {category.length <= 0 && <p>No Category Found</p>}
                        {category?.map((item) => (
                          <div
                            key={item._id}
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                          >
                            <Link
                              to={`/category/${item?.name}`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              {item?.name}
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Close button (cross icon) */}
                    <button
                      onClick={handleCloseDropdownCategory}
                      className="absolute top-0 right-0 mt-1 mr-2"
                    >
                      <FaTimes
                        size={28}
                        className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer"
                      />
                    </button>
                  </div>
                )}
              </div>

              <div
                className="flex items-center space-x-2"
                onClick={() => navigate("/search")}
              >
                <input
                  readOnly
                  placeholder="Search products..."
                  className="px-2 py-1 border rounded bg-gray-600 hover:bg-gray-700 focus:outline-none"
                />
                <button
                  onClick={() => navigate("/search")}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  <RiSearchLine className="text-gray-600" />
                </button>
              </div>
              <NavLink to="/cart" className="text-xl flex items-center">
                <FaShoppingCart className="text-xl" />
                {cart.length > 0 && (
                  <span className="ml-1 bg-green-600 text-xs w-5 h-5 flex justify-center items-center animate-bounce rounded-full text-white">
                    {cart.length}
                  </span>
                )}
              </NavLink>
              {!user && (
                <NavLink to="/login" className="text-xl">
                  Login
                </NavLink>
              )}

              {user && (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md  font-medium focus:outline-none focus:bg-gray-700 focus:text-white text-xl"
                  >
                    Profile
                    <Link to="/profile" />
                  </button>
                  {isOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 text-xl">
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          My Profile
                        </Link>

                        <div>
                          {user?.role === "user" && (
                            <Link
                              to={"/orders"}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              My Orders
                            </Link>
                          )}
                        </div>

                        <div>
                          {user?.role === "admin" && (
                            <Link
                              to="/myproducts"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              My Product
                            </Link>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={handleCloseDropdownProfile}
                        className="absolute top-0 right-0 mt-1 mr-2"
                      >
                        <FaTimes
                          size={28}
                          className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer"
                        />
                      </button>
                    </div>
                  )}
                </div>
              )}
              {user && (
                <div onClick={() => dispatch(LogoutUser(navigate))}>
                  <NavLink to="/" className="text-xl">
                    Logout
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* Responsive Menu */}
          <div className={`md:hidden ${showMenu ? "block" : "hidden"}`}>
            <div className="flex flex-col mt-4 space-y-4">
              <div className="relative">
                <button
                  onClick={toggleDropdown1}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md  font-medium focus:outline-none focus:bg-gray-700 focus:text-white text-xl"
                >
                  category
                </button>
                {isOpen1 && (
                  <div>
                    {loading ? (
                      <p>loading</p>
                    ) : (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 text-xl">
                        {category.length <= 0 && <p>No Category Found</p>}
                        {category?.map((item) => {
                          return (
                            <div
                              key={item._id}
                              className="py-1"
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="options-menu"
                            >
                              <Link
                                to={`/category/${item?.name}`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                {item?.name}
                              </Link>
                              <button
                                onClick={handleCloseDropdownCategory}
                                className="absolute top-0 right-0 mt-1 mr-2"
                              >
                                <FaTimes
                                  size={28}
                                  className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer"
                                />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div
                className="flex items-center space-x-2"
                onClick={() => navigate("/search")}
              >
                <input
                  readOnly
                  placeholder="Search products..."
                  className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-700 focus:outline-none"
                />
                <button
                  onClick={() => navigate("/search")}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  <RiSearchLine className="text-gray-600" />
                </button>
              </div>
              <NavLink to="/cart" className="text-xl flex items-center">
                <FaShoppingCart className="text-xl" />
                {cart.length > 0 && (
                  <span className="ml-1 bg-green-600 text-xs w-5 h-5 flex justify-center items-center animate-bounce rounded-full text-white">
                    {cart.length}
                  </span>
                )}
              </NavLink>
              {!user && (
                <NavLink to="/login" className="text-xl">
                  Login
                </NavLink>
              )}
              {user && (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="text-gray-300 hover:bg-slate-900 hover:text-white px-3 py-2 rounded-md font-medium focus:outline-none focus:bg-gray-700 focus:text-white text-xl"
                  >
                    Profile
                    <Link to="/profile" />
                  </button>
                  {isOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 text-xl">
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          My Profile
                        </Link>

                        <div>
                          {user?.role === "user" && (
                            <Link
                              to={"/orders"}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              My Orders
                            </Link>
                          )}
                        </div>

                        <div>
                          {user?.role === "admin" && (
                            <Link
                              to="/myproducts"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              My Product
                            </Link>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={handleCloseDropdownProfile}
                        className="absolute top-0 right-0 mt-1 mr-2"
                      >
                        <FaTimes
                          size={28}
                          className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer"
                        />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {user && (
                <div>
                  <NavLink
                    to="/"
                    className="text-xl"
                    onClick={() => dispatch(LogoutUser(navigate))}
                  >
                    Logout
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
