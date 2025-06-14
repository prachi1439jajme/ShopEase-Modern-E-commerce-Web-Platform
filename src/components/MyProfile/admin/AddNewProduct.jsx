import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
function AddNewProduct() {
  const { token } = useSelector((state) => state.user);
  const { product, editProduct } = useSelector((state) => state.form);
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (editProduct) {
      setValue("productTitle", product.productTitle);
      setValue("productDescription", product.productDescription);
      setValue("price", product.price);
      setValue("category", product.category);
      setValue("thumbnail", product.thumbnail);
    }
  }, []);

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

  async function handleSubmitFormData(data) {
    // console.log("data", data);
    const formData = new FormData();
    formData.append("productTitle", data.productTitle);
    formData.append("productDescription", data.productDescription);
    formData.append("price", data.price);
    formData.append("category", data.category);
    // please check it once  i was passing data.thumnail so it is not reading but now i passed data.thumnail[0] so it read file which in 0th index
    formData.append("thumbnail", data.thumbnail[0]);
    const toastId = toast.loading("posting");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/product/create-product`,
        formData,

        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("api response is ", response);
      toast.success(response?.data?.message);
      toast.dismiss(toastId);
      navigate("/myproducts");
    } catch (error) {
      // console.log(error);
      toast.error(error?.response?.data?.message);
      toast.dismiss(toastId);
    }
    toast.dismiss(toastId);
  }
  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-4xl w-full">
        <div className="bg-gray-700 p-6 text-white">
          <div className="flex justify-around max-sm:flex-wrap">
            <div>
              <h2 className="text-3xl font-bold mb-1">Add New Product</h2>
            </div>
          </div>
        </div>
        <div className="p-8">
          <form
            className="w-full"
            onSubmit={handleSubmit(handleSubmitFormData)}
          >
            <div className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label
                    htmlFor="productTitle"
                    className="block text-gray-700 mb-1"
                  >
                    Product Title
                  </label>
                  <input
                    type="text"
                    id="productTitle"
                    name="productTitle"
                    placeholder="Enter the Product Title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                    {...register("productTitle", { required: true })}
                  />
                  {errors.productTitle && (
                    <span className="text-[12px] text-pink-600">
                      Please enter Product Title
                    </span>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="productDescription"
                    className="block text-gray-700 mb-1"
                  >
                    Product Description
                  </label>
                  <input
                    type="text"
                    id="productDescription"
                    name="productDescription"
                    placeholder="Enter Product Description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                    {...register("productDescription", { required: true })}
                  />
                  {errors.productDescription && (
                    <span className="text-[12px] text-pink-600">
                      Please enter the Product Description
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="price" className="block text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="text"
                  name="price"
                  id="price"
                  placeholder="Enter Product Price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                  {...register("price", { required: true })}
                />
                {errors.price && (
                  <span className="text-[12px] text-pink-600">
                    Please enter Product Price
                  </span>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="category" className="block text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  id="category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                  {...register("category", { required: true })}
                >
                  <option value={" "} disabled>
                    Choose Category
                  </option>

                  {!loading &&
                    category.map((category, index) => (
                      <option key={index} value={category._id}>
                        {category?.name}
                      </option>
                    ))}
                  {errors.category && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                      Product Category is required
                    </span>
                  )}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="thumbnail"
                  className="text-sm font-bold text-gray-600"
                >
                  Select Product Image
                </label>
                <input
                  type="file"
                  name="thumbnail"
                  id="thumbnail"
                  className="p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  {...register("thumbnail", { required: true })}
                />
                {errors.thumbnail && (
                  <span className="text-[12px] text-pink-600">
                    Please select the Product Thumbnail
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-6 max-sm:flex-wrap max-sm:gap-3 max-sm:mt-3">
              <button
                onClick={() => navigate("/myproducts")}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default AddNewProduct;
