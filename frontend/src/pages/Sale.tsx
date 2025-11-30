import Sidebar from "../components/Sidebar";
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Sale {
  id: number;
  item: string;
  customer_name: string;
  quantity: number;
  price: number;
  updatedAt?: string;
  discount?: number;
  priceafterdiscount?: number;
}

export const Sale: React.FC = () => {
  const apiUrl = import.meta.env.VITE_BACKEND;
  const token = localStorage.getItem("aiteg_token") || "";

  const [filterItem, setFilterItem] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [form, setForm] = useState({
    id: 0,
    item: "",
    customer_name: "",
    quantity: 0,
    price: 0,
    updatedAt: "",
    discount: 0,
    priceafterdiscount: 0,
  });

  const fetchSales = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/sales`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSales(data);
    } catch (error) {
      console.error("Failed to fetch sales:", error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [apiUrl, token]);

  const handleAddOrUpdate = async () => {
    if (!form.item || !form.customer_name) return;

    try {
      const url = isEditing
        ? `${apiUrl}/api/sales/${form.id}`
        : `${apiUrl}/api/sales`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to add or update sale");

      await fetchSales();
      setIsEditing(false);
      setForm({
        id: 0,
        item: "",
        customer_name: "",
        quantity: 0,
        price: 0,
        updatedAt: "",
        discount: 0,
        priceafterdiscount: 0,
      });
    } catch (error) {
      console.error("Error adding or updating sale:", error);
    }
  };

  const handleEdit = (sale: Sale) => {
    setForm({
      ...sale,
      updatedAt: sale.updatedAt || "",
      discount: sale.discount || 0,
      priceafterdiscount: sale.priceafterdiscount || 0,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${apiUrl}/api/sales/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSales(sales.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete sale:", error);
    }
  };

  const filteredSales = sales.filter((s) => {
    const byItem =
      filterItem === "" ||
      s.item.toLowerCase().includes(filterItem.toLowerCase());
    const byCustomer =
      filterCustomer === "" ||
      s.customer_name.toLowerCase().includes(filterCustomer.toLowerCase());
    const byDate =
      filterDate === "" || (s.updatedAt && s.updatedAt.startsWith(filterDate));
    return byItem && byCustomer && byDate;
  });

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Report", 14, 16);

    const tableColumn = [
      "Item",
      "Customer",
      "Quantity",
      "Price",
      "Discount",
      "Price After Discount",
      "Date",
    ];

    const tableRows = filteredSales.map((sale) => [
      sale.item,
      sale.customer_name,
      sale.quantity,
      `Rs ${sale.price}`,
      `${sale.discount || 0}%`,
      `Rs ${sale.priceafterdiscount || sale.price}`,
      sale.updatedAt ? sale.updatedAt.split("T")[0] : "",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [4, 51, 123] }, // match header color
    });

    doc.save("sales_report.pdf");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <div className="h-full overflow-y-auto">
        <Sidebar />
      </div>
      <main className="flex-1 p-4 md:p-6 h-full overflow-y-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#04337B] mb-6">
          Sales Management
        </h1>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6">
          <h3 className="text-lg md:text-xl font-semibold text-[#04337B] mb-4">
            {isEditing ? "Update Sale" : "Add New Sale"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/** Item */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Item
              </label>
              <input
                type="text"
                placeholder="Enter Item"
                value={form.item}
                className="border rounded-lg px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-[#03C0C8]"
                onChange={(e) => setForm({ ...form, item: e.target.value })}
              />
            </div>

            {/** Customer */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Customer
              </label>
              <input
                type="text"
                placeholder="Customer Name"
                value={form.customer_name}
                className="border rounded-lg px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-[#03C0C8]"
                onChange={(e) =>
                  setForm({ ...form, customer_name: e.target.value })
                }
              />
            </div>

            {/** Quantity */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Quantity
              </label>
              <input
                type="number"
                placeholder="Quantity"
                value={form.quantity}
                className="border rounded-lg px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-[#03C0C8]"
                onChange={(e) =>
                  setForm({ ...form, quantity: +e.target.value })
                }
              />
            </div>

            {/** Price */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Price
              </label>
              <input
                type="number"
                placeholder="Price"
                value={form.price}
                className="border rounded-lg px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-[#03C0C8]"
                onChange={(e) => setForm({ ...form, price: +e.target.value })}
              />
            </div>

            {/** Discount */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Discount (%)
              </label>
              <input
                type="number"
                placeholder="Discount"
                value={form.discount}
                className="border rounded-lg px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-[#03C0C8]"
                onChange={(e) => {
                  const newDiscount = +e.target.value;
                  const priceafterdiscount =
                    form.price - (form.price * newDiscount) / 100;
                  setForm({
                    ...form,
                    discount: newDiscount,
                    priceafterdiscount,
                  });
                }}
              />
            </div>

            {/** Price After Discount */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Price After Discount
              </label>
              <input
                type="number"
                placeholder="Final Price"
                value={form.priceafterdiscount}
                readOnly
                className="border rounded-lg px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-[#03C0C8]"
              />
            </div>

            {/** Submit */}
            <button
              onClick={handleAddOrUpdate}
              className="bg-[#03C0C8] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#04337B] transition col-span-full"
            >
              {isEditing ? "Update Sale" : "Add Sale"}
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-3 rounded-xl shadow-md flex flex-wrap items-center justify-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Filter by Item"
            value={filterItem}
            className="border rounded-lg px-3 py-2 w-40"
            onChange={(e) => setFilterItem(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Customer"
            value={filterCustomer}
            className="border rounded-lg px-3 py-2 w-40"
            onChange={(e) => setFilterCustomer(e.target.value)}
          />
          <input
            type="date"
            value={filterDate}
            className="border rounded-lg px-3 py-2 w-40"
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <button
            className="bg-[#03C0C8] text-white px-4 py-2 rounded-lg hover:bg-[#04337B]"
            onClick={() => {
              setFilterItem("");
              setFilterCustomer("");
              setFilterDate("");
            }}
          >
            Clear
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            onClick={generatePDF}
          >
            Download PDF
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#03C0C8] text-white">
              <tr>
                <th className="py-3 px-3 sm:px-6 text-left">Item</th>
                <th className="py-3 px-3 sm:px-6 text-left">Customer</th>
                <th className="py-3 px-3 sm:px-6 text-left">Quantity</th>
                <th className="py-3 px-3 sm:px-6 text-left">Price</th>
                <th className="py-3 px-3 sm:px-6 text-left">Discount</th>
                <th className="py-3 px-3 sm:px-6 text-left">
                  Price After Discount
                </th>
                <th className="py-3 px-3 sm:px-6 text-left">Date</th>
                <th className="py-3 px-3 sm:px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSales.length > 0 ? (
                filteredSales.map((sale, idx) => (
                  <tr
                    key={sale.id}
                    className={`transition-all ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="py-2 px-2 sm:px-6">{sale.item}</td>
                    <td className="py-2 px-2 sm:px-6">{sale.customer_name}</td>
                    <td className="py-2 px-2 sm:px-6">{sale.quantity}</td>
                    <td className="py-2 px-2 sm:px-6">Rs {sale.price}</td>
                    <td className="py-2 px-2 sm:px-6">{sale.discount}%</td>
                    <td className="py-2 px-2 sm:px-6">
                      Rs {sale.priceafterdiscount}
                    </td>
                    <td className="py-2 px-2 sm:px-6">
                      {sale.updatedAt?.split("T")[0]}
                    </td>
                    <td className="py-2 px-2 sm:px-6 flex gap-2 flex-wrap">
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600 text-sm"
                        onClick={() => handleEdit(sale)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 text-sm"
                        onClick={() => handleDelete(sale.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No sales found.
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
