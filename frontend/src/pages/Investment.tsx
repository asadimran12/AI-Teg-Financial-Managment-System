import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

interface Investment {
  id: number;
  Invested_by: string;
  amount: number;
  Category: string;
  Quantity: number;
  date: string;
}

export const Investment: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [form, setForm] = useState({
    Invested_by: "",
    amount: 0,
    Category: "",
    date: "",
    Quantity: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const apiUrl = import.meta.env.VITE_BACKEND;

  // Fetch investments on mount
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/investment`);
        setInvestments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInvestments();
  }, []);

  // Add or Update investment
  const handleSubmit = async () => {
    if (!form.Invested_by || form.amount <= 0 || form.Quantity <= 0) return;

    try {
      if (editingId) {
        const res = await axios.put(`${apiUrl}/api/investment/${editingId}`, form);
        setInvestments(investments.map(i => (i.id === editingId ? res.data : i)));
        setEditingId(null);
      } else {
        const res = await axios.post(`${apiUrl}/api/investment`, form);
        setInvestments([...investments, res.data]);
      }
      setForm({ Invested_by: "", amount: 0, Category: "", date: "", Quantity: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  // Delete investment
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/api/investment/${id}`);
      setInvestments(investments.filter(i => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Edit investment
  const handleEdit = (investment: Investment) => {
    setForm({
      Invested_by: investment.Invested_by,
      amount: investment.amount,
      Category: investment.Category,
      date: investment.date,
      Quantity: investment.Quantity,
    });
    setEditingId(investment.id);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        <h2 className="text-3xl font-bold text-[#04337B] mb-6">Investment Dashboard</h2>

        {/* Add / Edit Investment Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-[#04337B] mb-4">
            {editingId ? "Update Investment" : "Add New Investment"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Invested By"
              value={form.Invested_by}
              onChange={e => setForm({ ...form, Invested_by: e.target.value })}
            />
            <input
              type="number"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Amount"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: +e.target.value })}
            />
            <input
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Category"
              value={form.Category}
              onChange={e => setForm({ ...form, Category: e.target.value })}
            />
            <input
              type="number"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Quantity"
              value={form.Quantity}
              onChange={e => setForm({ ...form, Quantity: +e.target.value })}
            />
            <input
              type="date"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />

            <button
              className="bg-[#03C0C8] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#04337B] transition shadow col-span-full"
              onClick={handleSubmit}
            >
              {editingId ? "Update Investment" : "Add Investment"}
            </button>
          </div>
        </div>

        {/* Investments Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#03C0C8] text-white">
              <tr>
                <th className="py-3 px-6 text-left">Invested By</th>
                <th className="py-3 px-6 text-left">Amount</th>
                <th className="py-3 px-6 text-left">Category</th>
                <th className="py-3 px-6 text-left">Quantity</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {investments.length > 0 ? (
                investments.map((i, idx) => (
                  <tr key={i.id} className={idx % 2 === 0 ? "bg-gray-50 hover:bg-gray-100 transition" : "hover:bg-gray-100 transition"}>
                    <td className="py-3 px-6 font-medium text-[#04337B]">{i.Invested_by}</td>
                    <td className="py-3 px-6">Rs.{i.amount}</td>
                    <td className="py-3 px-6">{i.Category}</td>
                    <td className="py-3 px-6">{i.Quantity}</td>
                    <td className="py-3 px-6">{i.date}</td>
                    <td className="py-3 px-6 flex gap-2">
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition shadow" onClick={() => handleEdit(i)}>Edit</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition shadow" onClick={() => handleDelete(i.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">No investments added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
