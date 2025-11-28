import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Asset {
  id: number;
  name: string;
  category: string;
  purchase_date: string;
  value: number;
  quantity: number;
  location: string;
}

export const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    purchase_date: "",
    value: 0,
    quantity: 0,
    location: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterMonth, setFilterMonth] = useState("");

  const apiUrl = import.meta.env.VITE_BACKEND;

  // 🔥 Get token from localStorage
  const token = localStorage.getItem("aiteg_token");

  // Fetch assets on mount
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/assets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssets(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssets();
  }, [apiUrl, token]);

  // Add or Update asset
  const handleSubmit = async () => {
    if (!form.name || !form.category || form.value <= 0 || form.quantity <= 0)
      return;

    try {
      if (editingId) {
        const res = await axios.put(
          `${apiUrl}/api/assets/${editingId}`,
          form,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAssets(assets.map((a) => (a.id === editingId ? res.data : a)));
        setEditingId(null);
      } else {
        const res = await axios.post(`${apiUrl}/api/assets`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssets([...assets, res.data]);
      }
      setForm({
        name: "",
        category: "",
        purchase_date: "",
        value: 0,
        quantity: 0,
        location: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Delete asset
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/api/assets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssets(assets.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Edit asset
  const handleEdit = (asset: Asset) => {
    setForm({
      name: asset.name,
      category: asset.category,
      purchase_date: asset.purchase_date,
      value: asset.value,
      quantity: asset.quantity,
      location: asset.location,
    });
    setEditingId(asset.id);
  };

  // Filtered by month
  const filteredAssets = assets.filter(
    (a) => filterMonth === "" || a.purchase_date.startsWith(filterMonth)
  );

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Assets Report", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [
        ["Name", "Category", "Purchase Date", "Value", "Quantity", "Location"],
      ],
      body: filteredAssets.map((a) => [
        a.name,
        a.category,
        a.purchase_date,
        a.value,
        a.quantity,
        a.location,
      ]),
    });

    doc.save("Assets_Report.pdf");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        <h2 className="text-3xl font-bold text-[#04337B] mb-6">
          Assets Dashboard
        </h2>

        {/* Add / Edit Asset Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-[#04337B] mb-4">
            {editingId ? "Update Asset" : "Add New Asset"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <input
              type="date"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              value={form.purchase_date}
              onChange={(e) =>
                setForm({ ...form, purchase_date: e.target.value })
              }
            />
            <input
              type="number"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Value"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: +e.target.value })}
            />
            <input
              type="number"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Quantity"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: +e.target.value })}
            />
            <input
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />

            <button
              className="bg-[#03C0C8] cursor-pointer text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#04337B] transition shadow col-span-full"
              onClick={handleSubmit}
            >
              {editingId ? "Update Asset" : "Add Asset"}
            </button>
          </div>
        </div>

        {/* Filter & Export */}
        <div className="flex gap-4 items-center mb-4">
          <input
            type="month"
            className="border rounded-lg px-3 py-2"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          />
          <button
            className="bg-[#03C0C8] text-white px-4 py-2 rounded-lg hover:bg-[#04337B]"
            onClick={exportPDF}
          >
            Export PDF
          </button>
        </div>

        {/* Assets Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#03C0C8] text-white">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Category</th>
                <th className="py-3 px-6 text-left">Purchase Date</th>
                <th className="py-3 px-6 text-left">Value</th>
                <th className="py-3 px-6 text-left">Quantity</th>
                <th className="py-3 px-6 text-left">Location</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAssets.length > 0 ? (
                filteredAssets.map((a, idx) => (
                  <tr
                    key={a.id}
                    className={
                      idx % 2 === 0
                        ? "bg-gray-50 hover:bg-gray-100 transition"
                        : "hover:bg-gray-100 transition"
                    }
                  >
                    <td className="py-3 px-6 font-medium text-[#04337B]">
                      {a.name}
                    </td>
                    <td className="py-3 px-6">{a.category}</td>
                    <td className="py-3 px-6">{a.purchase_date}</td>
                    <td className="py-3 px-6">Rs.{a.value}</td>
                    <td className="py-3 px-6">{a.quantity}</td>
                    <td className="py-3 px-6">{a.location}</td>
                    <td className="py-3 px-6 flex gap-2">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        onClick={() => handleEdit(a)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDelete(a.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No assets found for this month.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
