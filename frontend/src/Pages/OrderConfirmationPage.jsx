import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentCheckout, clearCheckout } from "../redux/slices/checkoutSlice";

function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCheckout } = useSelector((state) => state.checkout);

  const order = location.state?.checkout || currentCheckout;

  useEffect(() => {
    if (location.state?.checkout) {
      dispatch(setCurrentCheckout(location.state.checkout));
    }

    return () => {
      dispatch(clearCheckout());
    };
  }, [location.state, dispatch]);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

 useEffect(() => {
    if (!order) {
      navigate("/");
    }
  }, [order, navigate]);

  if (!order) return null;

  // Use orderItems instead of checkoutItems
  const items = order.orderItems || [];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You for Your Order
      </h1>

      <div className="p-6 rounded-lg border">
        <div className="flex justify-between mb-20">
          <div>
            <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
            <p className="text-gray-500">
              Order Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-emerald-700 text-sm">
              Estimated Delivery: {calculateEstimatedDelivery(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="mb-20">
          {items.map((item, index) => (
            <div key={index} className="flex items-center mb-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md mr-4"
              />
              <div>
                <h4 className="text-md font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-500">
                  {item.color} | {item.size}
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-md">${item.price}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-2">Payment</h4>
            <p className="text-gray-600">{order.paymentMethod}</p>
            <p className={`text-sm ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
              Status: {order.paymentStatus}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Delivery</h4>
            <p className="text-gray-600">{order.shippingAddress?.address}</p>
            <p className="text-gray-600">
              {order.shippingAddress?.city}, {order.shippingAddress?.country}
            </p>
            <p className="text-gray-600">Phone: {order.shippingAddress?.phone}</p>
          </div>
        </div>

        {/* Order Total */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex justify-between items-center text-lg font-semibold">
            <p>Order Total:</p>
            <p>${order.totalPrice?.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;