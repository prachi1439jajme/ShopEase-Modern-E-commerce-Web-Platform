
const { createSlice } = require("@reduxjs/toolkit");
const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
  signupData: null,
  isEmailSent: false,
};
export const UserSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setSignupData: (state, action) => {
      state.signupData = action.payload;
    },
    setEmailSent: (state, action) => {
      state.isEmailSent = action.payload;
    },
  },
});

export const { setUser, setToken, setSignupData,setEmailSent } = UserSlice.actions;
export default UserSlice.reducer;
