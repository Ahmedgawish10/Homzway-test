import { createSlice, createAsyncThunk ,createSelector} from '@reduxjs/toolkit';
import axios from 'axios';
import { store } from "@/store/store";


// Async thunk to fetch data from the API
export const fetchSystemSettings = createAsyncThunk(
  'systemSettings/fetchSystemSettings',
  async () => {
    try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}get-system-settings`,
        //   { params: { page } }
        );      
        
        // console.log(response?.data?.data);
        return response?.data?.data || [];
        
      } catch (error) {
        console.error('Error fetching Categories Data:', error);
        return rejectWithValue(error.response?.data || 'Failed to fetch categories');
      }
  }
);
const initialState = {
    data: null,
    lastFetch: null,
    loading: false,
    error:null,
    fcmToken: null,
};
const systemSettingsSlice = createSlice({
    name: "Settings1",
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
        },
        
    },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystemSettings.fulfilled, (state, action) => {
        state.loading = false;      
          console.log(action.payload);

        state.data = action.payload;
      })
      .addCase(fetchSystemSettings.rejected, (state, action) => {
        state.loading = false;
        
        state.error = action.error.message;
      });
  },
});
export const { settingsRequested, settingsSucess, settingsFailure, getToken } = systemSettingsSlice.actions;

export default systemSettingsSlice.reducer;
// Action to store token 
export const getFcmToken = (data) => {
    store.dispatch(getToken({ data }));
}


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
    state => state.Settings,
    settings => settings?.fcmToken
);

