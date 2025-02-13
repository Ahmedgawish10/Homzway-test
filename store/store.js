// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from "redux-logger";
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import settingSlice from "@/store/slices/settingSlice";
import sliderSlice from '@/store/slices/sliderSlice';
import categorySlice from '@/store/slices/categorySlice'
import productsSlice from './slices/productsSlice';
import authSlice from '@/store/slices/authSlice';
import breadCrumbSlice from '@/store/slices/breadCrumbSlice';
import languageSlice from '@/store/slices/languageSlice'
import locationSlice from '@/store/slices/locationSlice';
import offerSlice from '@/store/slices/offerSlice';
import searchSlice from "@/store/slices/searchSlice"
import globalStateSlice from '@/store/slices/globalStateSlice';
import filterSlice from '@/store/slices/filterSlice';
import SeoJsonLdSlice from './slices/SeoJsonLdSlice';
import {thunk} from "redux-thunk"; 

// all slicess
const rootReducer = combineReducers({
        Settings: settingSlice,
        Slider: sliderSlice,
        Category: categorySlice,
        Products:productsSlice,
        Auth: authSlice,
        Breadcrumb: breadCrumbSlice,
        Language: languageSlice,
        Location: locationSlice,
        Offer: offerSlice,
        Search: searchSlice,
        GlobalState: globalStateSlice,
        Filter: filterSlice,
        JsonLd:SeoJsonLdSlice,
});

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  // whitelist: ['language']
};


// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Persistor 
export const persistor = persistStore(store);