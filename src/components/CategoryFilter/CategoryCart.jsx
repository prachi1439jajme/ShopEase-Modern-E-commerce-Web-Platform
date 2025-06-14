import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addItem, removeItem } from "../../redux/Slices/CartSlice";
import toast from "react-hot-toast";
function CategoryCart({ item }) {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // this function add the item inside the card
  function addToCart() {
    dispatch(addItem(item));
    toast.success("Item Added successfully");
  }

  // this function remove the item from the card
  function removeFromCard() {
    // kisi ek post ko hee me delete karunga
    dispatch(removeItem(item._id));
    toast.error("Item Remove from Cart");
  }
  return (
    <div
      className=" max-w-[280px] w-[300px] rounded overflow-hidden shadow-lg m-4  flex flex-col items-center justify-between
  hover:scale-105 transition duration-300 ease-in gap-2 p-4 mt-10 ml-8 border-[3px] hover:shadow-3xl"
    >
      <div>
        <p className="text-gray-700 font-semibold text-lg text-left truncate w-40 mt-1">
          {item?.productTitle}
        </p>
      </div>
      <div className="h-[160px]">
        <img
          src={item?.thumbnail}
          alt="loading"
          loading="lazy"
          className="h-full w-full "
        />
      </div>
      <div>
        {/* <p className="w-30 text-gray-400 font-normal text-[20px] text-left">
            {item?.productDescription?.split(" ").slice(0, 10).join(" ")}
          </p> */}
      </div>
      <div className="flex justify-between gap-12 items-center w-full mt-5">
        <div>
          <p className="text-green-600 font-semibold">₹ {item?.price} </p>
        </div>
        {cart.some((Singleitem) => Singleitem._id === item._id) ? (
          <button
            className="text-gray-700 border-2 border-gray-700 rounded-full font-semibold 
            text-[12px] p-1 px-3 uppercase 
            hover:bg-gray-700
            hover:text-white transition duration-300 ease-in"
            onClick={removeFromCard}
          >
            Remove Item
          </button>
        ) : (
          <button
            className="text-gray-700 border-2 border-gray-700 rounded-full font-semibold 
            text-[12px] p-1 px-3 uppercase 
            hover:bg-gray-700
            hover:text-white transition duration-300 ease-in"
            onClick={addToCart}
          >
            Add Item
          </button>
        )}
      </div>
    </div>
  );
}

export default CategoryCart;
