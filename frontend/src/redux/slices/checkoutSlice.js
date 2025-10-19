import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const createCheckout = createAsyncThunk(
  'checkout/createCheckout',
  async (checkoutData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
        checkoutData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating checkout:", error);
      return rejectWithValue(
        error.response?.data?.message || 'Error creating checkout'
      );
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'checkout/updatePaymentStatus',
  async ({ checkoutId, paymentStatus, paymentDetails }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}`,
        { paymentStatus, paymentDetails },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating payment status:", error);
      return rejectWithValue(
        error.response?.data?.message || 'Error updating payment status'
      );
    }
  }
);

export const getAllOrders = createAsyncThunk(
  'checkout/getAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching all orders:", error);
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching orders'
      );
    }
  }
);

export const getMyOrders = createAsyncThunk(
  'checkout/getMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/myorders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user orders:", error);
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching user orders'
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'checkout/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${orderId}/status`,
        { status },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      return rejectWithValue(
        error.response?.data?.message || 'Error updating order status'
      );
    }
  }
);

// Initial state
const initialState = {
  checkoutItems: [],
  currentCheckout: null,
  orders: [], // All orders (for admin)
  myOrders: [], // User's own orders
  loading: false,
  error: null,
  success: false,
};

// Checkout slice
const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    clearCheckout: (state) => {
      state.currentCheckout = null;
      state.success = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetCheckoutState: (state) => {
      state.checkoutItems = [];
      state.currentCheckout = null;
      state.orders = [];
      state.myOrders = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    // Action to set current checkout from navigation state
    setCurrentCheckout: (state, action) => {
      state.currentCheckout = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Checkout
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentCheckout = action.payload;
        state.error = null;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update Payment Status
      .addCase(updatePaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update the specific checkout in orders or myOrders if it exists
        state.orders = state.orders.map(order =>
          order._id === action.payload._id ? action.payload : order
        );
        state.myOrders = state.myOrders.map(order =>
          order._id === action.payload._id ? action.payload : order
        );
        if (state.currentCheckout && state.currentCheckout._id === action.payload._id) {
          state.currentCheckout = action.payload;
        }
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All Orders
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get My Orders
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
        state.error = null;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update the order in both orders and myOrders arrays
        state.orders = state.orders.map(order =>
          order._id === action.payload._id ? action.payload : order
        );
        state.myOrders = state.myOrders.map(order =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const {
  clearCheckout,
  clearError,
  clearSuccess,
  resetCheckoutState,
  setCurrentCheckout
} = checkoutSlice.actions;

export default checkoutSlice.reducer;