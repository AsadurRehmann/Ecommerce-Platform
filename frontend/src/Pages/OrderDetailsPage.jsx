import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, clearError, clearOrder } from "../redux/slices/orderSlice";

function OrderDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetails(id));
    }

    return () => {
      dispatch(clearOrder());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="text-center py-8">
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <p>No order details found.</p>
        <Link to="/my-orders" className="text-blue-500 hover:underline">
          Back to my Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="p-4 sm:p-6 rounded-lg border">
        {/* Order Info */}
        <div className="flex flex-col sm:flex-row justify-between mb-8">
          <div>
            <h3 className="text-lg md:text-xl font-semibold">
              Order ID: #{currentOrder._id}
            </h3>
            <p className="text-gray-600">
              {new Date(currentOrder.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
            <span
              className={`${
                currentOrder.isPaid
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              } px-3 py-1 rounded-full text-sm font-medium mb-2`}
            >
              {currentOrder.isPaid ? "Approved" : "Pending"}
            </span>
            <span
              className={`${
                currentOrder.isDelivered
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              } px-3 py-1 rounded-full text-sm font-medium mb-2`}
            >
              {currentOrder.isDelivered ? "Delivered" : currentOrder.status}
            </span>
          </div>
        </div>

        {/* Customer, Payment, Shipping Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
            <p>Payment Method: {currentOrder.paymentMethod}</p>
            <p>Status: {currentOrder.isPaid ? "Paid" : "Unpaid"}</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
            <p>Status: {currentOrder.status}</p>
            <p>
              Address:{" "}
              {`${currentOrder.shippingAddress.city}, ${currentOrder.shippingAddress.country}`}
            </p>
          </div>
        </div>

        {/* Product list */}
        <div className="overflow-x-auto">
          <h4 className="text-lg font-semibold mb-4">Products</h4>
          <table className="min-w-full text-gray-600 mb-4">
            <thead className="text-gray-600">
              <tr>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Unit Price</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {currentOrder.orderItems.map((item) => (
                <tr key={item.productId} className="border-b">
                  <td className="py-2 px-4 flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg mr-4"
                    />
                    <Link
                      to={`/product/${item.productId}`}
                      className="text-blue-500 hover:underline"
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td className="py-2 px-4">${item.price}</td>
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4">${item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Price */}
        <div className="flex justify-end mt-4">
          <div className="text-lg font-semibold">
            Total: ${currentOrder.totalPrice}
          </div>
        </div>

        {/* Back to my orders link */}
        <Link to="/my-orders" className="text-blue-500 hover:underline mt-4 inline-block">
          Back to my Orders
        </Link>
      </div>
    </div>
  );
}

export default OrderDetailsPage;