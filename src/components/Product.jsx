import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem } from "../redux/Slices/CartSlice.js";
const Product = ({ item }) => {
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
      className="flex flex-col items-center justify-between
  hover:scale-110 transition duration-300 ease-in gap-2 p-4 mt-10 ml-8 rounded-xl border-[3px] hover:shadow-2xl"
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
        {/* space ke basis me 10 word show */}
        <p className="w-30 text-gray-400 font-normal text-[20px] text-left">
          {item?.productDescription?.split(" ").slice(0, 10).join(" ")}
        </p>
      </div>

      <div className="flex justify-between gap-12 items-center w-full mt-5">
        <div>
          <p className="text-green-600 font-semibold"> {`₹ ${item.price}`}</p>
        </div>

        {/* cart me agar item added hai to remove ka button show
    karo agar item added nhi hai to add to cart ka button show
    karo
    eske leaye we need cart */}

        {
          /* we use some methos here for check item id is prsent or not
        The some() method in JavaScript is used to check if at 
        least one element in an array passes a test. The test is implemented
        by a callback function. The callback function is passed
        each element in the array as an argument. 
        If the callback function returns true for any element
        in the array, the some() method returns true. Otherwise,
        the some() method returns false.*/
          // these button do some task

          cart.some((Singleitem) => Singleitem._id === item._id) ? (
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
          )
        }
      </div>
    </div>
  );
};

export default Product;
