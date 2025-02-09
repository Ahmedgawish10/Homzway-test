import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jsonLdData: null, 
};

const jsonLdSlice = createSlice({
  name: "jsonLd",
  initialState,
  reducers: {
    setJsonLdData: (state, action) => {
      state.jsonLdData = action.payload;
    },
  },
});

export const { setJsonLdData } = jsonLdSlice.actions;
export default jsonLdSlice.reducer;
