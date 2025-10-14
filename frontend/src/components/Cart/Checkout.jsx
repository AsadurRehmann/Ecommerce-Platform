import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout, clearError } from "../../redux/slices/checkoutSlice";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, currentCheckout } = useSelector((state) => state.checkout);
  const { cart } = useSelector((state) => state.cart); // Get cart from Redux store

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const handleCreateCheckout = async (e) => {
    e.preventDefault();

    // Clear any previous errors
    dispatch(clearError());

    const checkoutData = {
      checkoutItems: cart.products.map(item => ({
        productId: item.productId,
        name: item.name,
        size: item.size,
        color: item.color,
        price: item.price,
        image: item.image,
        quantity: item.quantity
      })),
      shippingAddress,
      paymentMethod: "Cash on Delivery",
      totalPrice: cart.totalPrice || calculateTotal(cart.products),
    };

    try {
      const result = await dispatch(createCheckout(checkoutData)).unwrap();
      console.log("Checkout created:", result);
      // Navigate to confirmation page with checkout data
      navigate("/order-confirmation", { state: { checkout: result } });
    } catch (error) {
      console.error("Checkout failed:", error);
      // Error is already set in Redux state, no need for alert
    }
  };

  const calculateTotal = (products) => {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* Error Display */}
      {error && (
        <div className="col-span-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <p>Processing your order...</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          {/* Your existing form JSX */}
          {/* ... */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-black text-white py-3 rounded mt-4 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
            }`}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>
        <div className="border-t py-4 mb-4">
          {cart.products.map((product, index) => (
            <div key={index} className="flex items-start justify-between py-2 border-b">
              <div className="flex items-start">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24 object-cover mr-4"
                />
                <div>
                  <h3 className="text-md">{product.name}</h3>
                  <p className="text-gray-500">Size: {product.size}</p>
                  <p className="text-gray-500">Color: {product.color}</p>
                  <p className="text-gray-500">Qty: {product.quantity}</p>
                </div>
              </div>
              <p className="text-xl">${(product.price * product.quantity)?.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p>${calculateTotal(cart.products)?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p>Total</p>
          <p>${calculateTotal(cart.products)?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default Checkout;