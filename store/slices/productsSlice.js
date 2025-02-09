import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch products
export const fetchAllProducts = createAsyncThunk(
  'products/fetchAllProducts',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}get-item`,
        { params: { page } }
      );

      return response?.data?.data || [];
    } catch (error) {
      console.error('Error fetching Products Data:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch products');
    }
  }
);
// Async thunk to fetch featured sections(all products that approved)
export const fetchFeaturedSections = createAsyncThunk(
  'products/fetchFeaturedSections',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}get-featured-section`
      );      
      return response?.data?.data || [];
    } catch (error) {
      console.error('Error fetching Featured sections Data:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch featured sections');
    }
  }
);

const initialState = {
  productsData: [], 
  totalProducts: 0, 
  lastPage: 1,
  currentPage: 1, 
  productView: 'grid', 
  singleProduct: {},
  productsLoading: false, 
  productsError: null, 
  featuredSections: [], // New state for featured sections
  featuredSectionsLoading: false, // Loading state for featured sections
  featuredSectionsError: null, // Error state for featured sections
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProductsData: (state, action) => {
      state.productsData = action.payload;
    },
    setTotalProducts: (state, action) => {
      state.totalProducts = action.payload;
    },
    resetProductsData: (state) => {
      return initialState;
    },
    replaceAllProductsData: (state, action) => {
      state.productsData = action.payload;
    },
    setLastPage: (state, action) => {
      state.lastPage = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setProductView: (state, action) => {
      state.productView = action.payload;
    },
    setSingleProduct: (state, action) => {
      state.singleProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Products
      .addCase(fetchAllProducts.pending, (state) => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.productsData = action.payload.data; // Update products data
        state.totalProducts = action.payload.total; // Update total products
        state.lastPage = action.payload.last_page; // Update last page
        state.currentPage = action.payload.current_page; // Update current page
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload || 'Failed to fetch products';
      })
      // Fetch Featured Sections
      .addCase(fetchFeaturedSections.pending, (state) => {
        state.featuredSectionsLoading = true;
        state.featuredSectionsError = null;
      })
      .addCase(fetchFeaturedSections.fulfilled, (state, action) => {
        state.featuredSectionsLoading = false;
        state.featuredSections = action.payload[0].section_data;
        //  console.log(action.payload[0].section_data);
      })
      .addCase(fetchFeaturedSections.rejected, (state, action) => {
        state.featuredSectionsLoading = false;
        state.featuredSectionsError = action.payload || 'Failed to fetch featured sections';
      });
  },
});

// Export actions
export const {
  setProductsData,
  resetProductsData,
  replaceAllProductsData,
  setLastPage,
  setCurrentPage,
  setProductView,
  setSingleProduct,
  setTotalProducts,
} = productSlice.actions;

// Export selectors
export const ProductsData = createSelector(
  (state) => state.products,
  (products) => products.productsData
);

export const TotalProducts = createSelector(
  (state) => state.products,
  (products) => products.totalProducts
);

export const LastPage = createSelector(
  (state) => state.products,
  (products) => products.lastPage
);

export const CurrentPage = createSelector(
  (state) => state.products,
  (products) => products.currentPage
);

export const ProductView = createSelector(
  (state) => state.products,
  (products) => products.productView
);

export const SingleProduct = createSelector(
  (state) => state.products,
  (products) => products.singleProduct
);

export const LoadingState = createSelector(
  (state) => state.products,
  (products) => products.productsLoading
);

export const ErrorState = createSelector(
  (state) => state.products,
  (products) => products.productsError
);

// New selectors for featured sections
export const FeaturedSections = createSelector(
  (state) => state.products,
  (products) => products.featuredSections
);

export const FeaturedSectionsLoading = createSelector(
  (state) => state.products,
  (products) => products.featuredSectionsLoading
);

export const FeaturedSectionsError = createSelector(
  (state) => state.products,
  (products) => products.featuredSectionsError
);

export default productSlice.reducer;