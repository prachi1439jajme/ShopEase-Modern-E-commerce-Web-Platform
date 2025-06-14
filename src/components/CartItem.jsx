import { AiFillDelete } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { removeItem, changeQuantity } from "../redux/Slices/CartSlice";

import toast from "react-hot-toast";
const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  function removeFromCard() {
    dispatch(removeItem(item._id));
    toast.success("Item Removed Successfully");
  }

  return (
    <div className="flex items-center p-2 md:p-5 justify-between   mt-2 mb-2 md:mx-5 ">
      <div className="flex flex-col md:flex-row p-0 md:p-3 gap-5 items-center">
        <div className="w-[40%]">
          <img
            src={item?.thumbnail}
            alt="loading"
            loading="lazy"
            className="object-cover "
          />
        </div>

        <div className="md:ml-10 self-start space-y-5 w-[100%] md:w-[70%]">
          <h1 className="text-xl text-slate-700 font-semibold">
            {item?.productTitle}
          </h1>
          {/* we have to add readmore which give the complete info of Items only single card  */}
          <h1 className="text-base text-slate-700 font-medium">
            {item?.productDescription?.split(" ").slice(0, 15).join(" ") + "..."}
          </h1>

          <div className="flex items-center justify-between">
            <p className="font-bold text-lg text-green-600">{`₹ ${
              (item.price * item.quantity).toFixed(3)
            }`}</p>
            <div className="flex gap-2 justify-center items-center max-w-4">
              <p
                className="text-red-400 font-semibold cursor-pointer text-2xl "
                onClick={() =>
                  dispatch(
                    changeQuantity({
                      id: item?._id,
                      quantity: item?.quantity + 1,
                    })
                  )
                }
              >
                +
              </p>
              <p className="text-green-600 font-semibold">{item?.quantity}</p>
              <p
                className="text-red-400 font-semibold cursor-pointer text-2xl"
                onClick={() =>
                  dispatch(
                    changeQuantity({
                      id: item?._id,
                      quantity: item?.quantity - 1,
                    })
                  )
                }
              >
                -
              </p>
            </div>
            <div
              className="text-red-800  bg-red-200 group hover:bg-red-400 transition-transform duration-300 cursor-pointer rounded-full p-3 mr-3"
              onClick={removeFromCard}
            >
              <AiFillDelete className="text-3xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
