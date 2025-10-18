import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";

//helper function to load cart from local storage
const loadCartFromStorage = () => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : { products: [] };
}

//helper function to save cart to local storage
const saveCartToStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
}

//add cart for a user or a guest
export const fetchCart = createAsyncThunk("cart/fetchCart",
    async ({ userId, guestId }, { rejectWithValue }) => {
        try {
            const respose = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                {
                    params: { userId, guestId },
                }
            );
            return respose.data;
        } catch (error) {
            console.error("Error fetching cart:", error);
            return rejectWithValue(error.response.data);
        }
    }
)

//add an item to the cart for an user or a guest
export const addToCart = createAsyncThunk("cart/addToCart", async ({ productId, quantity, size, color, guestId, userId },
    { rejectWithValue }) => {
    try {
        const respose = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`,
            {
                productId,
                quantity,
                size,
                color,
                guestId,
                userId,
            }
        )
        return respose.data;
    } catch (error) {
        console.error("Error adding to cart:", error);
        return rejectWithValue(error.response.data);
    }
})

//update the quantity of an item in the cart
export const updateCartItemQuantity = createAsyncThunk("cart/updateCartItemQuantity",
    async ({ productId, quantity, guestId, userId, size, color }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                {
                    productId,
                    quantity,
                    guestId, userId,
                    size,
                    color,
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating cart item quantity:", error);
            return rejectWithValue(error.response.data);
        }
    }
);

//remove from cart
export const removeFromCart = createAsyncThunk("cart/removeFromCart",
     async ({ productId, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
        const response = await axios({
            method:"DELETE",
            url:`${import.meta.env.VITE_BACKEND_URL}/api/cart`,
            data: {
                productId,
                guestId,
                userId,
                size,
                color,
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error removing from cart:", error);
        return rejectWithValue(error.response?.data || error.message);
    }
});

//merge guest cart into user cart
export const mergeCart=createAsyncThunk("cart/mergeCarts",async({guestId,user},{rejectWithValue})=>{
    try {
        const response=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
            {guestId,user},
            {
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("userToken")}`
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error merging carts:", error);
        return rejectWithValue(error.response.data);
    }
})

const cartSlice=createSlice({
    name:"cart",
    initialState:{
        cart:loadCartFromStorage(),
        loading:false,
        error:null,
    },
    reducers:{
        clearCart:(state)=>{
            state.cart={products:[]};
            localStorage.removeItem("cart");
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchCart.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchCart.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=action.payload;
            saveCartToStorage(action.payload);
        })
        .addCase(fetchCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.error.message || "Failed to fetch cart";
        })
        .addCase(addToCart.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(addToCart.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=action.payload;
            saveCartToStorage(action.payload);
        })
        .addCase(addToCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || "Failed to add to cart";
        })
        .addCase(updateCartItemQuantity.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(updateCartItemQuantity.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=action.payload;
            saveCartToStorage(action.payload);
        })
        .addCase(updateCartItemQuantity.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || "Failed to update item quantity";
        })
        .addCase(removeFromCart.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(removeFromCart.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=action.payload;
            saveCartToStorage(action.payload);
        })
        .addCase(removeFromCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || "Failed to remove item";
        })
        .addCase(mergeCart.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(mergeCart.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=action.payload;
            saveCartToStorage(action.payload);
        })
        .addCase(mergeCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || "Failed to merge cart";
        });
    }
});

export const {clearCart}=cartSlice.actions;
export default cartSlice.reducer;
