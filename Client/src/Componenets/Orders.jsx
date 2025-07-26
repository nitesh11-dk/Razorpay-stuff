import { useContext, useEffect } from "react";
import AppContext from "../context/AppContext";


const Orders = () => {
  const { orders, fetchUserOrders, token } = useContext(AppContext);

  useEffect(() => {
    if (token) {
      fetchUserOrders();
    }
  }, [token]);

  useEffect(() => {
    console.log("Orders:", orders);
  }, [orders]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>

      {orders && orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table w-full border border-gray-800">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-4 py-2 border">#</th>
                {/* <th className="px-4 py-2 border">Order ID</th> */}
                <th className="px-4 py-2 border">Created At</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Amount</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id} className="text-center">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  {/* <td className="px-4 py-2 border">{order.orderId}</td> */}
                  <td className="px-4 py-2 border">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border capitalize">{order.status}</td>
                  <td className="px-4 py-2 border">₹{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};


export default Orders;
