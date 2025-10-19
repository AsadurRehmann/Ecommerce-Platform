import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout, clearError } from "../../redux/slices/checkoutSlice";
import { clearCart } from "@/redux/slices/cartSlice";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // Ensure cart is loaded before proceeding
  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();

    // Clear any previous errors
    dispatch(clearError());

    // Validate required fields
    if (!shippingAddress.firstName || !shippingAddress.lastName ||
        !shippingAddress.address || !shippingAddress.city ||
        !shippingAddress.postalCode || !shippingAddress.country ||
        !shippingAddress.phone) {
      dispatch(clearError());
      return;
    }

    const checkoutData = {
      checkoutItems: cart.products.map((item) => ({
        productId: item.productId,
        name: item.name,
        size: item.size,
        color: item.color,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      })),
      shippingAddress,
      paymentMethod: "Cash on Delivery",
      totalPrice: cart.totalPrice || calculateTotal(cart.products),
    };

    try {
      const result = await dispatch(createCheckout(checkoutData)).unwrap();
      console.log("Checkout created:", result);
      dispatch(clearCart());//clear the cart
      // Navigate to confirmation page with checkout data
      navigate("/order-confirmation", { state: { checkout: result } });
    } catch (error) {
      console.error("Checkout failed:", error);
    
    }
  };

  const calculateTotal = (products) => {
    return products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
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
          <h3 className="text-lg mb-3">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={user ? user.email : ""}
              className="w-full p-2 rounded border"
              disabled
            />
          </div>
          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                className="w-full p-2 rounded border"
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                className="w-full p-2 rounded border"
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="w-full p-2 rounded border"
              required
            />
          </div>
          <div className="gap-4 mb-4 grid grid-cols-2">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                className="w-full p-2 rounded border"
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                className="w-full p-2 rounded border"
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className="w-full p-2 rounded border"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              className="w-full p-2 rounded border"
              required
            />
          </div>

          <div className="mt-6">
            <h3 className="text-lg mb-4">Payment Method</h3>
            <div className="flex items-center space-x-2 mb-4">
              <input type="radio" name="payment" value="COD" defaultChecked readOnly />
              <span>Cash on Delivery</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-black text-white py-3 rounded mt-4 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
              }`}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>
        <div className="border-t py-4 mb-4">
          {cart && cart.products && cart.products.map((product, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-2 border-b"
            >
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
              <p className="text-xl">
                ${(product.price * product.quantity)?.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p>${cart ? calculateTotal(cart.products)?.toLocaleString() : "0"}</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p>Total</p>
          <p>${cart ? calculateTotal(cart.products)?.toLocaleString() : "0"}</p>
        </div>
      </div>
    </div>
  );
}

export default Checkout;