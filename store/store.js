// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from "redux-logger";
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';

import settingsReducer from "@/store/slices/settingSlice";
import sliderReducer from '@/store/slices/sliderSlice';
import categoryReducer from '@/store/slices/categorySlice'
import productsSlice from './slices/productsSlice';
import authReducer from '@/store/slices/authSlice';
import breadCrumbSlice from '@/store/slices/breadCrumbSlice';
import languageReducer from '@/store/slices/languageSlice'
import locationReducer from '@/store/slices/locationSlice';
import offerReducer from '@/store/slices/offerSlice';
import searchReducer from "@/store/slices/searchSlice"
import globalStateReducer from '@/store/slices/globalStateSlice';
import filterReducer from '@/store/slices/filterSlice';
import SeoJsonLdSlice from './slices/SeoJsonLdSlice';
import SsdSlice from './slices/SsdSlice';
import {thunk} from "redux-thunk"; 


const rootReducer = combineReducers({
        Settings: settingsReducer,
        Slider: sliderReducer,
        Category: categoryReducer,
        Products:productsSlice,
        Auth: authReducer,
        Breadcrumb: breadCrumbSlice,
        Language: languageReducer,
        Location: locationReducer,
        Offer: offerReducer,
        Search: searchReducer,
        GlobalState: globalStateReducer,
        Filter: filterReducer,
        JsonLd:SeoJsonLdSlice,
        Ssd:SsdSlice
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
      serializableCheck: false, // Disable warnings for non-serializable state
    }),
});

// Persistor
export const persistor = persistStore(store);