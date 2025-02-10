import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
    language:"en",
    translatedData:null
};

export const languageSlice = createSlice({
    name: "CurrentLanguage",
    initialState,
    reducers: {
        setCurrentLanguage: (state, action) => {
            state.language = action.payload;
        },
        setTranslatedData: (state, action) => {
            state.translatedData = action.payload;
            console.log(action.payload?.file_name);
            
        },
    },
});

export default languageSlice.reducer;
export const { setCurrentLanguage,setTranslatedData } = languageSlice.actions;

export const CurrentLanguageData = createSelector(
    (state) => state.CurrentLanguage,
    (CurrentLanguage) => CurrentLanguage?.language
);
