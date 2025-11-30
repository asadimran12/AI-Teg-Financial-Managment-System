import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

interface Teacher {
  id: number;
  name: string;
  pay?: number;
}

interface TeacherPay {
  id: number;
  name: string;
  pay: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teachersPay, setTeachersPay] = useState<TeacherPay[]>([]);
  const [form, setForm] = useState({
    name: "",
    pay: 0,
    status: "paid",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const [filterStatus, setFilterStatus] = useState(""); // filter for paid/unpaid
  const [filterMonth, setFilterMonth] = useState(""); // filter for month

  const apiUrl = import.meta.env.VITE_BACKEND;

  // Fetch teachers + teacherPay
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersRes, payRes] = await Promise.all([
          axios.get(`${apiUrl}/api/teachers`),
          axios.get(`${apiUrl}/api/teacherpay/all`),
        ]);

        setTeachers(teachersRes.data.data || teachersRes.data);
        setTeachersPay(payRes.data.data || payRes.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [apiUrl]);

  // Add or Update teacher Pay
  const handleSubmit = async () => {
    if (!form.name) return alert("Please select a teacher");

    try {
      if (editingId) {
        const res = await axios.put(
          `${apiUrl}/api/teacherpay/${editingId}`,
          form
        );
        setTeachersPay(
          teachersPay.map((t) => (t.id === editingId ? res.data.data : t))
        );
        setEditingId(null);
      } else {
        const res = await axios.post(`${apiUrl}/api/teacherpay/add`, form);
        setTeachersPay([...teachersPay, res.data.data]);
      }

      setForm({ name: "", pay: 0, status: "paid" });
    } catch (err) {
      console.log(err);
    }
  };

  // Delete Pay Record
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/api/teacherpay/${id}`);
      setTeachersPay(teachersPay.filter((t) => t.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // Edit Pay Record
  const handleEdit = (teacher: TeacherPay) => {
    setForm({
      name: teacher.name,
      pay: teacher.pay,
      status: teacher.status,
    });
    setEditingId(teacher.id);
  };

  // Filtered teacher pay list
  const filteredTeachersPay = teachersPay.filter((t) => {
    const statusMatch =
      filterStatus === "" ||
      t.status.toLowerCase() === filterStatus.toLowerCase();
    const monthMatch =
      filterMonth === "" || t.createdAt.startsWith(filterMonth);
    return statusMatch && monthMatch;
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        <h2 className="text-3xl font-bold text-[#04337B] mb-6">
          Teachers Payment Dashboard
        </h2>

        {/* Form */}
       <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
  <h3 className="text-xl font-semibold mb-4">
    {editingId ? "Update Teacher Pay" : "Add Teacher Pay"}
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

    {/* Teacher Selection */}
    <div>
      <label className="block text-sm font-semibold text-gray-600 mb-1">
        Teacher
      </label>
      <select
        className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
        value={form.name}
        onChange={(e) => {
          const selectedTeacher = teachers.find(
            (t) => t.name === e.target.value
          );
          setForm({
            ...form,
            name: e.target.value,
            pay: selectedTeacher?.pay || 0,
          });
        }}
      >
        <option value="">Select Teacher</option>
        {teachers.map((t) => (
          <option key={t.id} value={t.name}>
            {t.name}
          </option>
        ))}
      </select>
    </div>

    {/* Pay */}
    <div>
      <label className="block text-sm font-semibold text-gray-600 mb-1">
        Pay
      </label>
      <input
        type="number"
        className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
        placeholder="Pay"
        value={form.pay}
        readOnly
      />
    </div>

    {/* Status */}
    <div>
      <label className="block text-sm font-semibold text-gray-600 mb-1">
        Status
      </label>
      <select
        className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      >
        <option value="paid">Paid</option>
        <option value="unpaid">Unpaid</option>
      </select>
    </div>

    {/* Submit Button */}
    <button
      className="bg-[#03C0C8] cursor-pointer text-white font-semibold px-4 py-2 rounded-lg mt-2 md:col-span-3"
      onClick={handleSubmit}
    >
      {editingId ? "Update Record" : "Add Record"}
    </button>
  </div>
</div>


        {/* Filter Bar */}
        <div className="bg-white p-3 rounded-xl shadow-md flex flex-wrap items-center gap-4 mb-6">
          <select
            className="border rounded-lg px-3 py-2 w-40"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>

          <input
            type="month"
            className="border rounded-lg px-3 py-2 w-40"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          />

          <button
            className="bg-[#03C0C8] cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-[#04337B]"
            onClick={() => {
              setFilterStatus("");
              setFilterMonth("");
            }}
          >
            Clear
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#03C0C8] text-white">
              <tr>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Pay</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTeachersPay.length > 0 ? (
                filteredTeachersPay.map((t) => (
                  <tr key={t.id} className="border-b">
                    <td className="py-3 px-6">{t.name}</td>
                    <td className="py-3 px-6">{t.pay}</td>
                    <td className="py-3 px-6">
                      <span
                        className={
                          t.status === "paid"
                            ? "text-green-600 font-bold"
                            : "text-red-600 font-bold"
                        }
                      >
                        {t.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-6">{t.updatedAt?.split("T")[0]}</td>
                    <td className="py-3 px-6 flex gap-2">
                      <button
                        className="bg-yellow-500 cursor-pointer text-white px-3 py-1 rounded"
                        onClick={() => handleEdit(t)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 cursor-pointer text-white px-3 py-1 rounded"
                        onClick={() => handleDelete(t.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    No records found.
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

export default Teachers;
