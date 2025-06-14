const { createSlice } = require("@reduxjs/toolkit");
const initialState = {
  step: 1,
  form: null,
  product: null,
  editProduct: false,
  editForm: false,
  paymentLoading: false,
};
export const FormSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setStep(state, action) {
      state.step = action.payload;
    },

    setForm(state, action) {
      state.form = action.payload;
    },
    setEditForm(state, action) {
      state.editForm = action.payload;
    },
    setPaymentLoading(state, action) {
      state.paymentLoading = action.payload;
    },
    resetFormState(state, action) {
      state.step = 1;
      state.form = null;
      state.editForm = false;
    },
    setProduct(state, action) {
      state.product = action.payload;
    },
    setEditProduct(state, action) {
      state.editProduct = action.payload;
    },
  },
});

export const {
  setStep,
  setForm,
  setEditForm,
  setPaymentLoading,
  resetFormState,
  setProduct,
  setEditProduct,
} = FormSlice.actions;
export default FormSlice.reducer;
