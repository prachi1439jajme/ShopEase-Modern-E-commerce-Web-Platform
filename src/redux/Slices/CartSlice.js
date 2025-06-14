const { createSlice } = require("@reduxjs/toolkit");
const initialState = {
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  myOrder: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
};
export const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const product = action.payload;

      // findindex method give -1 if not fount so -1 kee help se we can create the property qunatity that why we use find it give undefined by which we can create
      // const isAlreadyAdded = state.cart.findIndex(
      //   (item) => item.id === product.id
      // );
      const isAlreadyAdded = state.cart.find(
        (item) => item._id === product._id
      );

      if (isAlreadyAdded) {
        isAlreadyAdded.quantity += 1;
      } else {
        state.cart.push({ ...product, quantity: 1 });
      }

      // // this means item already in cart
      // if (isAlreadyAdded >= 0) {
      //   return;
      // }
      // // set the product in cart
      // state.cart.push(product);

      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    removeItem: (state, action) => {
      const itemId = action.payload;
      const index = state.cart.findIndex((item) => item._id === itemId);
      // console.log("for checking",index);
      if (index >= 0) {
        state.cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },

    changeQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      // quantity by default should be one cant be minus
      if (quantity <= 0) {
        return;
      }

      const product = state.cart.find((item) => item._id === id);
      if (product) {
        product.quantity = quantity;
      }
    },
    resetCart: (state) => {
      state.cart = [];
      // Update to localstorage
      localStorage.removeItem("cart");
    },
    setMyOrder: (state, action) => {
      state.myOrder = action.payload;
    },
  },
});

export const { addItem, removeItem, changeQuantity, resetCart, setMyOrder } =
  CartSlice.actions;
export default CartSlice.reducer;
