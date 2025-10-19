import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks for User Management
export const getAllUsers = createAsyncThunk(
  'admin/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching users'
      );
    }
  }
);

export const createUser = createAsyncThunk(
  'admin/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      return rejectWithValue(
        error.response?.data?.message || 'Error creating user'
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${userId}`,
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      return rejectWithValue(
        error.response?.data?.message || 'Error updating user'
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return userId; // Return the deleted user ID
    } catch (error) {
      console.error("Error deleting user:", error);
      return rejectWithValue(
        error.response?.data?.message || 'Error deleting user'
      );
    }
  }
);

// Async thunks for Product Management
export const getAllProducts = createAsyncThunk(
  'admin/getAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching products'
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  'admin/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`,
        productData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      return rejectWithValue(
        error.response?.data?.message || 'Error creating product'
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`,
        productData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      return rejectWithValue(
        error.response?.data?.message || 'Error updating product'
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return productId; // Return the deleted product ID
    } catch (error) {
      console.error("Error deleting product:", error);
      return rejectWithValue(
        error.response?.data?.message || 'Error deleting product'
      );
    }
  }
);

// Initial state
const initialState = {
  // User Management
  users: [],
  currentUser: null,

  // Product Management
  products: [],
  currentProduct: null,

  // Common states
  loading: false,
  error: null,
  success: false,
  operation: null, // Tracks which operation is being performed
};

// Admin slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminData: (state) => {
      state.currentUser = null;
      state.currentProduct = null;
      state.success = false;
      state.error = null;
      state.operation = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.operation = null;
    },
    resetAdminState: (state) => {
      state.users = [];
      state.currentUser = null;
      state.products = [];
      state.currentProduct = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.operation = null;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = 'fetching_users';
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
        state.operation = null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      })
      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = 'creating_user';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Note: The backend returns only a message, not the user object
        // You might want to refetch users or handle this differently
        state.error = null;
        state.operation = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = 'updating_user';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update user in users array
        state.users = state.users.map(user =>
          user._id === action.payload.user._id ? action.payload.user : user
        );
        // Update currentUser if it's the one being updated
        if (state.currentUser && state.currentUser._id === action.payload.user._id) {
          state.currentUser = action.payload.user;
        }
        state.error = null;
        state.operation = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = 'deleting_user';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Remove user from users array
        state.users = state.users.filter(user => user._id !== action.payload);
        // Clear currentUser if it's the one being deleted
        if (state.currentUser && state.currentUser._id === action.payload) {
          state.currentUser = null;
        }
        state.operation = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      })
      // Get All Products
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = 'fetching_products';
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
        state.operation = null;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = 'creating_product';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Add new product to products array
        state.products.push(action.payload);
        state.error = null;
        state.operation = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = 'updating_product';
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update product in products array
        state.products = state.products.map(product =>
          product._id === action.payload._id ? action.payload : product
        );
        // Update currentProduct if it's the one being updated
        if (state.currentProduct && state.currentProduct._id === action.payload._id) {
          state.currentProduct = action.payload;
        }
        state.error = null;
        state.operation = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = 'deleting_product';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Remove product from products array
        state.products = state.products.filter(product => product._id !== action.payload);
        // Clear currentProduct if it's the one being deleted
        if (state.currentProduct && state.currentProduct._id === action.payload) {
          state.currentProduct = null;
        }
        state.operation = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      });
  },
});

// Export actions and reducer
export const {
  clearAdminData,
  clearError,
  clearSuccess,
  resetAdminState,
  setCurrentProduct,
  setCurrentUser
} = adminSlice.actions;

export default adminSlice.reducer;