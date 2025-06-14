import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
function EditProductInfo() {
  const [productInfo, setPrpductInfo] = useState(null);
  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let ProductId = useParams();
  ProductId = ProductId.id;
  // console.log("Product kee id hai ", ProductId);

  async function getProductInfo(productId) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/product/product-info`,
        { productId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setPrpductInfo(response?.data?.data);
    } catch (error) {
      // console.log(error);
      toast.error(error?.response?.data?.message);
    }
  }

  const categoryArr = ["Cloths", "Electronics", "Jewellery"];

  useEffect(() => {
    getProductInfo(ProductId);
  }, []);

  async function handleSubmitFormData(data) {
    // console.log("edit form me data ", data);
    const { productDescription, price, productTitle } = data;
    const toastId = toast.loading("updating ");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/product/edit-product/${ProductId}`,

        {
          productDescription,
          price,
          productTitle,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("updated Product data response is ", response);
      toast.success(response?.data?.message);
      navigate("/myproducts");
      toast.dismiss(toastId);
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
              <h2 className="text-3xl font-bold mb-1">Edit Product Details</h2>
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
                    defaultValue={productInfo?.productTitle}
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
                    defaultValue={productInfo?.productDescription}
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
                  defaultValue={productInfo?.price}
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
                  defaultValue={productInfo?.category}
                >
                  {categoryArr.map((ele, i) => (
                    <option key={i} value={ele}>
                      {ele}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className="text-[12px] text-pink-600">
                    Please select the Category
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
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProductInfo;
