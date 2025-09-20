import React from "react";

function OrderManagment() {
  const orders = [
    {
      _id: 123,
      user: {
        name: "Jhon Doe",
      },
      totalPrice: 100,
      status: "Processing",
    },
  ];

  const handleStatusChange = (orderid, status) => {
    console.log({ id: orderid, status });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Order Managment</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="uppercase bg-gray-100 text-xs text-gray-700">
            <th className="py-3 px-4">Order ID</th>
            <th className="py-3 px-4">Customer</th>
            <th className="py-3 px-4">Total Price</th>
            <th className="py-3 px-4">Status</th>
          </thead>
          <tbody>
            {orders.length > 0
              ? orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                      #{order._id}
                    </td>
                    <td className="py-3 px-4">{order.user.name}</td>
                    <td className="py-3 px-4">{order.totalPrice}</td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                         focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Canceled">Canceled</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() =>
                          handleStatusChange(order._id, "Delivered")
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded "
                      >Mark as Delivered</button>
                    </td>
                  </tr>
                ))
              : (
                <tr>
                    <td className="p-4 text-center text-gray-500" colSpan={4}>No Orders Found.</td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderManagment;
