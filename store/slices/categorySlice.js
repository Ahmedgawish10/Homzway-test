//  import { categoryApi } from '@/config/apiCalling'; // Import categoryApi
// features/categorySlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';


// Async thunk to fetch categories
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}get-categories`,
        { params: { page } }
      );      
      
      return response?.data?.data || [];
    } catch (error) {
      console.error('Error fetching Categories Data:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch categories');
    }
  }
);

const initialState = {
    cateData: [],
    totalCatItems: 0,
    catLastPage: 1,
    catCurrentPage: 1,
    categoryView: 'grid',
    SingleCatItem: [],
    SingleCatCurrentPage: 1,
    SingleCatLastPage: 1,
    treeData: [],
    subCategoryPages: {},
    loading: false,
    error: null,
  };
  
  export const categorySlice = createSlice({
    name: 'Category',
    initialState,
    reducers: {
      setCateData: (state, action) => {
        state.cateData = action.payload;
      },
      setTotalCatItems: (state, action) => {
        state.totalCatItems = action.payload;
      },
      resetCateData: (state) => {
        return initialState;
      },
      replaceAllCateData: (state, action) => {
        state.cateData = action.payload;
      },
      setCatLastPage: (state, action) => {
        state.catLastPage = action.payload;
      },
      setCatCurrentPage: (state, action) => {
        state.catCurrentPage = action.payload;
      },
      setSingleCatCurrentPage: (state, action) => {
        state.SingleCatCurrentPage = action.payload;
      },
      setSingleCatLastPage: (state, action) => {
        state.SingleCatLastPage = action.payload;
      },
      setCategoryView: (state, action) => {
        state.categoryView = action.payload;
      },
      setSingleCatItem: (state, action) => {
        state.SingleCatItem = action.payload;
      },
      setTreeData: (state, action) => {
        state.treeData = action.payload;
      },
      setSubCategoryPages: (state, action) => {
        state.subCategoryPages = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchCategories.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchCategories.fulfilled, (state, action) => {
          state.loading = false;
           state.cateData = action.payload.data;
           state.totalCatItems = action.payload.total;
           state.catLastPage=  action.payload.last_page;
           state.catCurrentPage=  action.payload.current_page;
          //  console.log("o",action.payload);
        })
        .addCase(fetchCategories.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to fetch categories';
        });
    },
  });
  
  export default categorySlice.reducer;
  export const {   setCateData, resetCateData, replaceAllCateData, setCatLastPage, setCatCurrentPage,  setCategoryView,
    setSingleCatItem, setSingleCatCurrentPage, setSingleCatLastPage, setTreeData, setTotalCatItems, setSubCategoryPages,
      } = categorySlice.actions;
  
  // Selectors
  export const CategoryData = createSelector(
    (state) => state.Category,
    (Category) => Category.cateData
  );

  export const LastPage = createSelector(
    (state) => state.Category,
    (Category) => Category.catLastPage
  );
  export const CurrentPage = createSelector(
    (state) => state.Category,
    (Category) => Category.catCurrentPage
  );
  export const SingleCurrentPage = createSelector(
    (state) => state.Category,
    (Category) => Category.SingleCatCurrentPage
  );
  export const SingleLastPage = createSelector(
    (state) => state.Category,
    (Category) => Category.SingleCatLastPage
  );
  export const ViewCategory = createSelector(
    (state) => state.Category,
    (Category) => Category.categoryView
  );
  export const TotalCategoriesItems = createSelector(
    (state) => state.Category,
    (Category) => Category.totalCatItems
  );
  export const FullTreeData = createSelector(
    (state) => state.Category,
    (Category) => Category.treeData
  );
  export const getSubCategoryPages = createSelector(
    (state) => state.Category,
    (Category) => Category.subCategoryPages
  );
  export const CatItems = createSelector(
    (state) => state.Category,
    (Category) => Category.SingleCatItem
  );
  export const LoadingState = createSelector(
    (state) => state.Category,
    (Category) => Category.loading
  );
  export const ErrorState = createSelector(
    (state) => state.Category,
    (Category) => Category.error
  );