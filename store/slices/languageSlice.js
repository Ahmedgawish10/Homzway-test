import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import {Api} from "@/api/AxiosInterceptors"; // Ensure this is your API handler
import { GET_LANGUAGE } from "@/api/apiCalling"; // Adjust the path

const initialState = {
  language: "en",
  translatedData: null,
  loading: false,
  error: null
};

// Async thunk for fetching language data
export const fetchDefaultLanguage = createAsyncThunk(
  "language/fetchLanguage",
  async ({ language_code, type }, { rejectWithValue }) => {
    try {
      const response = await Api.get(GET_LANGUAGE, {
        params: { language_code:"en", type:"web" }
      });      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setCurrentLanguage: (state, action) => {
      state.language = action.payload;
    },
    setTranslatedData: (state, action) => {
      state.translatedData = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDefaultLanguage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDefaultLanguage.fulfilled, (state, action) => {
        state.loading = false;
        console.log("gh",action.payload);
        
        state.translatedData = action.payload;
      })
      .addCase(fetchDefaultLanguage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default languageSlice.reducer;
export const { setCurrentLanguage, setTranslatedData } = languageSlice.actions;

export const CurrentLanguageData = createSelector(
  (state) => state.language,
  (languageState) => languageState?.language
);
