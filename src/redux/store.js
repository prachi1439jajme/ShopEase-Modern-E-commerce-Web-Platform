import { configureStore } from "@reduxjs/toolkit";
import { CartSlice } from "./Slices/CartSlice";
import { UserSlice } from "./Slices/UserSlice";
import { FormSlice } from "./Slices/FormSlice";
const store = configureStore({
  reducer: {
    cart: CartSlice.reducer,
    user: UserSlice.reducer,
    form: FormSlice.reducer,
  },
});

export default store;
