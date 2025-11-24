import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

interface Teacher {
  id: number;
  name: string;
  course: string;
  phone: string;
  email: string;
  pay: number;
  status: "Paid" | "Unpaid";
}

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [form, setForm] = useState({
    name: "",
    course: "",
    phone: "",
    email: "",
    pay: 0,
  });

  const handleAdd = () => {
    if (!form.name || !form.course) return; // simple validation
    const newTeacher: Teacher = {
      id: Date.now(),
      ...form,
      status: form.pay > 0 ? "Paid" : "Unpaid",
    };
    setTeachers([...teachers, newTeacher]);
    setForm({ name: "", course: "", phone: "", email: "", pay: 0 });
  };

  const handleDelete = (id: number) => {
    setTeachers(teachers.filter(teacher => teacher.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <h2 className="text-3xl font-bold text-[#04337B] mb-6">Teachers Dashboard</h2>

        {/* Add Teacher Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-[#04337B] mb-4">Add New Teacher</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Course"
              value={form.course}
              onChange={e => setForm({ ...form, course: e.target.value })}
            />
            <input
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Phone"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
            <input
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="number"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Pay"
              value={form.pay}
              onChange={e => setForm({ ...form, pay: +e.target.value })}
            />
            <button
              className="bg-[#03C0C8] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#04337B] transition shadow col-span-full"
              onClick={handleAdd}
            >
              Add Teacher
            </button>
          </div>
        </div>

        {/* Teachers List Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#03C0C8] text-white">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Course</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Pay</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {teachers.length > 0 ? (
                teachers.map((teacher, idx) => (
                  <tr
                    key={teacher.id}
                    className={idx % 2 === 0 ? "bg-gray-50 hover:bg-gray-100 transition" : "hover:bg-gray-100 transition"}
                  >
                    <td className="py-3 px-6 font-medium text-[#04337B]">{teacher.name}</td>
                    <td className="py-3 px-6">{teacher.course}</td>
                    <td className="py-3 px-6">{teacher.phone}</td>
                    <td className="py-3 px-6">{teacher.email}</td>
                    <td className="py-3 px-6 font-semibold text-[#03C0C8]">{teacher.pay}</td>
                    <td className={`py-3 px-6 font-semibold ${teacher.status === "Paid" ? "text-green-600" : "text-red-600"}`}>
                      {teacher.status}
                    </td>
                    <td className="py-3 px-6">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition shadow"
                        onClick={() => handleDelete(teacher.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No teachers added yet.
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
