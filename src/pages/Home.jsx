import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import Product from "../components/Product";
import toast from "react-hot-toast";
const Home = () => {
  const API_URL = `${process.env.REACT_APP_BASE_URL}/product/all-product`;

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  async function fetchProductData() {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const finalData = await response.json();
      setItems(finalData?.AllProduct);
      // console.log(finalData?.AllProduct);
    } catch (error) {
      // console.log("Some Thing wrong !!!.....");
      toast.error(error?.response?.data?.message);

      setItems([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProductData();
  }, []);

  return (
    <div>
      {loading ? (
        <div className=" mb-[30rem]">
          <Spinner />
        </div>
      ) : items?.length > 0 ? (
        <div className="grid  xs:grid cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl p-2 mx-auto space-y-10 space-x-5 min-h-[80vh]">
          {items?.map((item) => {
            return <Product key={item._id} item={item} />;
          })}
        </div>
      ) : (
        <div className="flex justify-center items-center text-3xl font-semibold mt-[205px] mb-32">
          No Data Found
        </div>
      )}
    </div>
  );
};

export default Home;
