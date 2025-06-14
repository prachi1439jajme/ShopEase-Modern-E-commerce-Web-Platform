import React from "react";
const SearchResult = ({ item }) => {
  return (
    <div
      className="flex flex-col items-center justify-between
  hover:scale-110 transition duration-300 ease-in gap-2 p-4 mt-10 ml-8 rounded-xl border-[3px] hover:shadow-2xl"
    >
      <div>
        <p className="text-gray-700 font-semibold text-lg text-left truncate w-40 mt-1">
          {item?.title}
        </p>
      </div>

      <div className="h-[160px]">
        <img
          src={item?.image}
          alt="loading"
          loading="lazy"
          className="h-full w-full "
        />
      </div>
      <div>
        {/* space ke basis me 10 word show */}
        <p className="w-30 text-gray-400 font-normal text-[20px] text-left">
          {item?.description?.split(" ").slice(0, 10).join(" ")}
        </p>
      </div>
    </div>
  );
};

export default SearchResult;
