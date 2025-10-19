import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch products by filters
export const fetchProductsByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async (filters) => {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit
    } = filters;

    const query = new URLSearchParams();
    if (collection && collection !== 'all') query.append('collection', collection);
    if (size && size !== 'all') query.append('size', size);
    if (color && color !== 'all') query.append('color', color);
    if (gender && gender !== 'all') {
      // Ensure gender is properly capitalized to match your database
      const formattedGender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
      query.append('gender', formattedGender);
    }
    if (minPrice) query.append('minPrice', minPrice);
    if (maxPrice) query.append('maxPrice', maxPrice);
    if (sortBy && sortBy !== 'default') query.append('sortBy', sortBy);
    if (search) query.append('search', search);
    if (category && category !== 'all') query.append('category', category);
    if (material && material !== 'all') query.append('material', material);
    if (brand && brand !== 'all') query.append('brand', brand);
    if (limit) query.append('limit', limit);

    const url = `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`;

    const response = await axios.get(url);
    return response.data;
  }
);

// Fetch a single product by ID
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
    return response.data;
  }
);

// Update a product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      }
    );
    return response.data;
  }
);

// Fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async ({ id }) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`);
    return response.data;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    productDetails: null,
    similarProducts: [],
    loading: false,
    error: null,
    filters: {
      category: "",
      size: "",
      color: "",
      gender: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
      search: "",
      material: "",
      collection: "",
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: "",
        size: "",
        color: "",
        gender: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
        material: "",
        collection: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetching products by filters
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Handle fetching single product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload; 
        state.productDetails = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Handle updating a product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;
        const index = state.products.findIndex(product => product._id === updatedProduct._id);
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Handle fetching similar products
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setFilters, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
