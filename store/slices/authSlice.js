import { createSelector, createSlice } from "@reduxjs/toolkit";
import { store } from "../store";  // Ensure this import path is correct

const initialState = {
    data: null,
    loading: false,
    userVerfied:null
};

export const authSlice = createSlice({
    name: "UserSignup",
    initialState,
    reducers: {
     
        updateDataSuccess: (usersignup, action) => {
            usersignup.data = action.payload;
        },
        userUpdateData: (usersignup, action) => {
            usersignup.data.data = action.payload.data;
        },
        userLogout: (usersignup) => {
            usersignup.data = null; 
        },
        setUserVerfied: (state,action) => {
            state.userVerfied = action.payload; 
        }
    },
});

export const { updateDataSuccess, userUpdateData, userLogout,setUserVerfied } = authSlice.actions;
export default authSlice.reducer;

export const loadUpdateData = (data) => {
    store.dispatch(updateDataSuccess(data));
};
export const loadUpdateUserData = (data) => {
    store.dispatch(userUpdateData({ data }));
};
export const logoutSuccess = () => {
    store.dispatch(userLogout());
};

export const rootSignupData = createSelector(
    (state) => state.UserSignup,
    (UserSignup) => UserSignup
)

export const userSignUpData = createSelector(
    (state) => state.UserSignup,
    (UserSignup) => UserSignup?.data?.data
);


