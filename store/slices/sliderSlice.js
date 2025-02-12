import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch the main slider data
export const fetchMainSlider = createAsyncThunk(
    "mainSlider/fetchMainSlider",
    async (type = "web", { rejectWithValue }) => {
        try {
            
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}get-slider` );
            // console.log(response?.data?.data);

            return response?.data?.data || [];
        } catch (error) {
            console.error("Error fetching get-system-settings Data:", error);
            return rejectWithValue(
                error.response?.data || "Failed to fetch get-system-settings"
            );
        }
    }
);

// Initial state
const initialState = {
    slider: [],
    loading: false,
    error: null,
};

// Redux slice
export const sliderSlice = createSlice({
    name: "MainSlider",
    initialState,
    reducers: {
        setSlider: (state, action) => {
            state.slider = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMainSlider.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMainSlider.fulfilled, (state, action) => {
                state.loading = false;
                state.slider = action.payload;
            })
            .addCase(fetchMainSlider.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// // Selectors
// export const SliderData = createSelector(
//     (state) => state.MainSlider,
//     (MainSlider) => MainSlider.slider
// );

// // Exports
export default sliderSlice.reducer;
 export const { setSlider } = sliderSlice.actions;
