import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ customer_name: "", product: "", quantity: 1, amount: 0, status: "pending" });
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const res = await axios.get("/orders");
    setOrders(res.data);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editing) {
      await axios.put(`/orders/${editing.id}`, form);
      setEditing(null);
    } else {
      await axios.post("/orders", form);
    }
    setForm({ customer_name: "", product: "", quantity: 1, amount: 0, status: "pending" });
    load();
  };

  const edit = (order) => {
    setEditing(order);
    setForm({ customer_name: order.customer_name, product: order.product, quantity: order.quantity, amount: order.amount, status: order.status });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete order?")) return;
    await axios.delete(`/orders/${id}`);
    load();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">{editing ? "Edit Order" : "Create Order"}</h3>
        <div className="grid grid-cols-2 gap-4">
          <input className="border rounded p-2" placeholder="Customer name" value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} />
          <input className="border rounded p-2" placeholder="Product" value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} />
          <input type="number" className="border rounded p-2" placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} min="1" />
          <input type="number" className="border rounded p-2" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} min="0" step="0.01" />
          <select className="border rounded p-2" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={save}>{editing ? "Update" : "Create"}</button>
          {editing && <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => { setEditing(null); setForm({ customer_name: "", product: "", quantity: 1, amount: 0, status: "pending" }); }}>Cancel</button>}
        </div>
      </div>

      <table className="min-w-full bg-white rounded shadow overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">ID</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Product</th>
            <th className="p-3">Qty</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} className="border-t">
              <td className="p-3">{order.id}</td>
              <td className="p-3">{order.customer_name}</td>
              <td className="p-3">{order.product}</td>
              <td className="p-3">{order.quantity}</td>
              <td className="p-3">{order.amount}</td>
              <td className="p-3">{order.status}</td>
              <td className="p-3 space-x-2">
                <button className="bg-yellow-300 px-2 py-1 rounded" onClick={() => edit(order)}>Edit</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => remove(order.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
