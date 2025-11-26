import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

interface DailyExpense {
  id: number;
  expense_by: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export const DailyExpenses: React.FC = () => {
  const [expenses, setExpenses] = useState<DailyExpense[]>([]);
  const [form, setForm] = useState({
    expense_by: "",
    amount: 0,
    category: "",
    description: "",
    date: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const apiUrl = import.meta.env.VITE_BACKEND;

  // Fetch expenses on mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/daily-expenses`);
        setExpenses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchExpenses();
  }, []);

  // Add or update expense
  const handleSubmit = async () => {
    if (!form.expense_by || form.amount <= 0) return;

    try {
      if (editingId) {
        const res = await axios.put(`${apiUrl}/api/daily-expenses/${editingId}`, form);
        setExpenses(expenses.map(e => (e.id === editingId ? res.data : e)));
        setEditingId(null);
      } else {
        const res = await axios.post(`${apiUrl}/api/daily-expenses`, form);
        setExpenses([...expenses, res.data]);
      }
      setForm({ expense_by: "", amount: 0, category: "", description: "", date: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // Edit expense
  const handleEdit = (expense: DailyExpense) => {
    setForm({
      expense_by: expense.expense_by,
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    });
    setEditingId(expense.id);
  };

  // Delete expense
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/api/daily-expenses/${id}`);
      setExpenses(expenses.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <h2 className="text-3xl font-bold text-[#04337B] mb-6">Daily Expenses</h2>

        {/* Add / Edit Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-[#04337B] mb-4">
            {editingId ? "Update Expense" : "Add New Expense"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Expense By"
              value={form.expense_by}
              onChange={e => setForm({ ...form, expense_by: e.target.value })}
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
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            />
            <input
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
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
              {editingId ? "Update Expense" : "Add Expense"}
            </button>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#03C0C8] text-white">
              <tr>
                <th className="py-3 px-6 text-left">Expense By</th>
                <th className="py-3 px-6 text-left">Amount</th>
                <th className="py-3 px-6 text-left">Category</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.length > 0 ? (
                expenses.map((e, idx) => (
                  <tr key={e.id} className={idx % 2 === 0 ? "bg-gray-50 hover:bg-gray-100 transition" : "hover:bg-gray-100 transition"}>
                    <td className="py-3 px-6 font-medium text-[#04337B]">{e.expense_by}</td>
                    <td className="py-3 px-6">{e.amount}</td>
                    <td className="py-3 px-6">{e.category}</td>
                    <td className="py-3 px-6">{e.description}</td>
                    <td className="py-3 px-6">{e.date}</td>
                    <td className="py-3 px-6 flex gap-2">
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition shadow" onClick={() => handleEdit(e)}>Edit</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition shadow" onClick={() => handleDelete(e.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">No expenses added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
