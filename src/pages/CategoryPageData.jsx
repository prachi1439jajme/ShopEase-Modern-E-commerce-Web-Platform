import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import CategoryCart from "../components/CategoryFilter/CategoryCart";
export default function CategoryPageData() {
  const [catlogPageData, setCatalogPageData] = useState(null);
  const [catName, setCatName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  // remember jo bhi app.js url me dunamic parameter ka name ho usi se etract karege useParams() hook se
  // example / category/:categoryName se yha par categoryName se hee value url se niklegi or kisi name se nhi
  const { categoryName } = useParams();

  // get all the category which is availble now
  const getCategories = async () => {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/category/getAllCatrgory`
    );

    const category_id = result?.data?.data?.filter((ct) => {
      return ct.name === categoryName;
    })[0]._id;

    setCategoryId(category_id);

    if (categoryId) {
      getCategoryPageInfo();
    }
  };
  useEffect(() => {
    getCategories();
  }, [categoryName, categoryId]);

  const getCategoryPageInfo = async () => {
    const toastId = toast.loading("loading");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/category/category-info`,
        { categoryId }
      );
      // console.log("Category ke andar courses : ", response);
      setCatalogPageData(response);
      // console.log("catelaog page data in fun", catlogPageData);
      toast.dismiss(toastId);
    } catch (error) {
      // console.log(error);
      toast.error(error?.response?.data?.message);
      setCatName(error?.response?.data?.Name);
      toast.dismiss(toastId);
    }
    toast.dismiss(toastId);
  };

  return (
    <div className="py-8">
      <div className="box-content bg-white shadow-lg rounded-lg px-6 py-8 mx-auto flex min-h-[260px] max-w-7xl flex-col justify-center gap-6 lg:px-8">
        <p className="text-gray-600 text-lg">
          {`Home / Category / `}
          {catlogPageData?.data?.data?.selectedCategory.products.length > 0 ? (
            <span className="text-yellow-500 font-semibold">
              {catlogPageData?.data?.data?.selectedCategory?.name}
            </span>
          ) : (
            <span className="text-yellow-500 font-semibold">{catName}</span>
          )}
        </p>
        <p className="text-4xl text-gray-800 font-bold">
          Top Items Of{" "}
          {catlogPageData?.data?.data?.selectedCategory.products.length > 0 ? (
            <span className="text-pink-500">
              {catlogPageData?.data?.data?.selectedCategory?.name}
            </span>
          ) : (
            <span className="text-pink-500">{catName}</span>
          )}
        </p>
        <p className="max-w-[870px] text-gray-600 text-lg leading-relaxed">
          {catlogPageData?.data?.data?.selectedCategory?.description}
        </p>

        <div className="py-8">
          {catlogPageData?.data?.data?.selectedCategory?.products?.length ===
            undefined ||
          catlogPageData?.data?.data?.selectedCategory?.products?.length <=
            0 ? (
            <div className="flex items-center justify-center text-4xl font-semibold text-gray-600 ">
              <p className="mt-40">NO data Found</p>
            </div>
          ) : (
            <div className="w-[90%] flex items-center justify-center mx-auto flex-wrap">
              {catlogPageData?.data?.data?.selectedCategory?.products?.map(
                (item, index) => (
                  <div key={index}>
                    <CategoryCart item={item} key={item._id} />
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/*  section3 some other products */}

        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
          <div className="section_heading">
            <p className="text-4xl text-gray-800 font-bold">
              Other Top Avaiable Items{" "}
            </p>
            <div className="py-8">
              {catlogPageData?.data?.data?.selectedCategory?.products.length <=
              0 ? (
                <p>NO data Found</p>
              ) : (
                <div className="w-[90%] flex items-center justify-center mx-auto flex-wrap">
                  {catlogPageData?.data?.data?.mostSellingProducts?.map(
                    (item, index) => (
                      <div key={index}>
                        <CategoryCart item={item} key={item._id} />
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
