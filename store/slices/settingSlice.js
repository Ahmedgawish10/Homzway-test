import { store } from "@/store/store";
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch categories
export const fetchSystemSettings = createAsyncThunk(
  "settings/fetchSystemSettings",
  async (type = "", { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}get-system-settings`,
        {params:{type}}
      );

      return response?.data?.data || [];
    } catch (error) {
      console.error("Error fetching get-system-settings Data:", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch get-system-settings"
      );
    }
  }
);

const initialState = {
  data: null,
  lastFetch: null,
  loading: false,
  error: null,
  fcmToken: null
};

export const settingsSlice = createSlice({
  name: "Settings",
  initialState,
  reducers: {
    settingsRequested: (settings) => {
      settings.loading = true;
    },
    settingsSucess: (settings, action) => {
      let { data } = action.payload;
      settings.data = data;
      settings.loading = false;
      settings.lastFetch = Date.now();
    },
    settingsFailure: (settings) => {
      settings.loading = false;
    },
    getToken: (settings, action) => {
      settings.fcmToken = action.payload.data;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemSettings.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystemSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        //  console.log(action.payload);
      })
      .addCase(fetchSystemSettings.rejected, (state, action) => {
        state.loading = false;
        state.data = action.payload || "Failed to fetch system settings";
      });
  },
});

export const { settingsRequested, settingsSucess, settingsFailure, getToken } =
  settingsSlice.actions;
export default settingsSlice.reducer;

// Action to store token
export const getFcmToken = (data) => {
  store.dispatch(getToken({ data }));
};

// Selectors
export const settingsData = createSelector(
  (state) => state.Settings,
  (settings) => settings.data
);
export const isFreeAdListing = createSelector(
  (state) => state.Settings,
  (settings) => settings?.data?.data?.free_ad_listing
);

export const Fcmtoken = createSelector(
  (state) => state.Settings,
  (settings) => settings?.fcmToken
);
