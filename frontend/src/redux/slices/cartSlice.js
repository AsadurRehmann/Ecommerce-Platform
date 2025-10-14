import { createslice, createAsyncThunk } from '@reduxjs/toolkit';
import axio from "axios";

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
        const respose = await axios.post(`$${import.meta.env.VITE_BACKEND_URL}/api/cart`,
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
