import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

interface Teacher {
  id: number;
  name: string;
  courses: string[];
  Phone_number: string;
  email: string;
  pay: number;
  pay_status: "paid";
}

interface Course {
  id: number;
  name: string;
  fee: number;
}

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState({
    name: "",
    courses: [] as string[],
    Phone_number: "",
    email: "",
    pay: 0,
    pay_status: "paid",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const apiUrl = import.meta.env.VITE_BACKEND;

  // Fetch teachers & courses on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersRes, coursesRes] = await Promise.all([
          axios.get(`${apiUrl}/api/teachers`),
          axios.get(`${apiUrl}/api/courses`),
        ]);
        setTeachers(teachersRes.data);
        setCourses(coursesRes.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [apiUrl]);

  // Add or Update teacher
  const handleSubmit = async () => {
    if (!form.name || form.courses.length === 0) return;

    try {
      if (editingId) {
        const res = await axios.put(
          `${apiUrl}/api/teachers/${editingId}`,
          form
        );
        setTeachers(teachers.map((t) => (t.id === editingId ? res.data : t)));
        setEditingId(null);
      } else {
        const res = await axios.post(`${apiUrl}/api/teachers`, form);
        setTeachers([...teachers, res.data]);
      }

      setForm({
        name: "",
        courses: [],
        Phone_number: "",
        email: "",
        pay: 0,
        pay_status: "unpaid",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Delete teacher
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/api/teachers/${id}`);
      setTeachers(teachers.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Edit teacher
  const handleEdit = (teacher: Teacher) => {
    setForm({
      name: teacher.name,
      courses: teacher.courses,
      Phone_number: teacher.Phone_number,
      email: teacher.email,
      pay: teacher.pay,
      pay_status: teacher.pay_status,
    });
    setEditingId(teacher.id);
  };

  // Handle course select/remove
  const handleCourseSelect = (courseName: string) => {
    if (!form.courses.includes(courseName)) {
      setForm({ ...form, courses: [...form.courses, courseName] });
    }
  };

  const handleCourseRemove = (courseName: string) => {
    setForm({ ...form, courses: form.courses.filter((c) => c !== courseName) });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        <h2 className="text-3xl font-bold text-[#04337B] mb-6">
          Teachers Dashboard
        </h2>

        {/* Add / Edit Teacher Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-[#04337B] mb-4">
            {editingId ? "Update Teacher" : "Add New Teacher"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Name
              </label>
              <input
                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Phone
              </label>
              <input
                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
                placeholder="Phone"
                value={form.Phone_number}
                onChange={(e) =>
                  setForm({ ...form, Phone_number: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Email
              </label>
              <input
                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
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
                onChange={(e) => setForm({ ...form, pay: +e.target.value })}
              />
            </div>

            {/* Courses Multi-select */}
            <div className="col-span-full">
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Courses
              </label>
              <div className="border rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-[#03C0C8] shadow-sm">
                <div className="flex flex-wrap gap-1 mb-2">
                  {form.courses.map((c) => (
                    <span
                      key={c}
                      className="bg-[#03C0C8] text-white px-2 py-1 rounded-full flex items-center gap-1"
                    >
                      {c}
                      <button
                        type="button"
                        onClick={() => handleCourseRemove(c)}
                        className="text-white font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  className="w-full border-none focus:ring-0 outline-none"
                  value=""
                  onChange={(e) => handleCourseSelect(e.target.value)}
                >
                  <option value="">Select course</option>
                  {courses
                    .filter((c) => !form.courses.includes(c.name))
                    .map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="bg-[#03C0C8] cursor-pointer text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#04337B] transition shadow col-span-full"
              onClick={handleSubmit}
            >
              {editingId ? "Update Teacher" : "Add Teacher"}
            </button>
          </div>
        </div>

        {/* Teachers Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#03C0C8] text-white">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Courses</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Pay</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {teachers.length > 0 ? (
                teachers.map((t, idx) => (
                  <tr
                    key={t.id}
                    className={
                      idx % 2 === 0
                        ? "bg-gray-50 hover:bg-gray-100 transition"
                        : "hover:bg-gray-100 transition"
                    }
                  >
                    <td className="py-3 px-6 font-medium text-[#04337B]">
                      {t.name}
                    </td>
                    <td className="py-3 px-6">{t.courses.join(", ")}</td>
                    <td className="py-3 px-6">{t.Phone_number}</td>
                    <td className="py-3 px-6">{t.email}</td>
                    <td className="py-3 px-6 font-semibold text-[#03C0C8]">
                      {t.pay}
                    </td>
                    <td className="py-3 px-6 flex gap-2">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition shadow cursor-pointer"
                        onClick={() => handleEdit(t)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition shadow cursor-pointer"
                        onClick={() => handleDelete(t.id)}
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
