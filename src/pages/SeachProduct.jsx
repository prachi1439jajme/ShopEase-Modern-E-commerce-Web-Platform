import React, { useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import SearchResult from "../components/SearchResult";
import toast from "react-hot-toast";
function SeachProduct() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://fakestoreapi.com/products?search=${query}`
      );
      setResults(response);
      setLoading(false);
      setQuery(" ");
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setResults([]);
      setLoading(false);
    }
  };
  return (
    <div className="App container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search and Cart Example</h1>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for something..."
          className="border border-gray-300 p-2 rounded mr-2 flex-grow"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Search
        </button>
      </div>
      <div>
        {loading ? (
          <div className=" mb-[30rem]">
            <Spinner />
          </div>
        ) : results?.data?.length > 0 ? (
          <div className="grid  xs:grid cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl p-2 mx-auto space-y-10 space-x-5 min-h-[80vh]">
            {results?.data?.map((item) => {
              return <SearchResult key={item.id} item={item} />;
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center text-3xl font-semibold mt-[205px] mb-32">
            No Data Found
          </div>
        )}
      </div>
    </div>
  );
}

export default SeachProduct;
