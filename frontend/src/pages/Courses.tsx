import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

interface Course {
  id: number;
  name: string;
  fee: number;
  duration: string;
  description: string;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState({
    name: "",
    fee: 0,
    duration: "",
    description: "",
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleAdd = async () => {
    if (!form.name || !form.duration) return;

    // Create a new course object locally
    const newCourse: Course = { id: Date.now(), ...form };

    try {
      const response = await axios.post(`${apiUrl}api/courses`, newCourse);

      const savedCourse = response.data;
      setCourses([...courses, savedCourse]);

      setForm({ name: "", fee: 0, duration: "", description: "" });
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const handleDelete = (id: number) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <h2 className="text-3xl font-bold text-[#04337B] mb-6">
          Courses Dashboard
        </h2>

        {/* Add Course Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-[#04337B] mb-4">
            Add New Course
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Course Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="number"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Fee"
              value={form.fee}
              onChange={(e) => setForm({ ...form, fee: +e.target.value })}
            />
            <input
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Duration (e.g., 2 Months)"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />
            <input
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm col-span-full"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <button
              className="bg-[#03C0C8] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#04337B] transition shadow"
              onClick={handleAdd}
            >
              Add Course
            </button>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#03C0C8] text-white">
              <tr>
                <th className="py-3 px-6 text-left">Course Name</th>
                <th className="py-3 px-6 text-left">Fee</th>
                <th className="py-3 px-6 text-left">Duration</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.length > 0 ? (
                courses.map((course, idx) => (
                  <tr
                    key={course.id}
                    className={
                      idx % 2 === 0
                        ? "bg-gray-50 hover:bg-gray-100 transition"
                        : "hover:bg-gray-100 transition"
                    }
                  >
                    <td className="py-3 px-6 font-medium text-[#04337B]">
                      {course.name}
                    </td>
                    <td className="py-3 px-6 font-semibold text-[#03C0C8]">
                      ${course.fee}
                    </td>
                    <td className="py-3 px-6">{course.duration}</td>
                    <td className="py-3 px-6">{course.description}</td>
                    <td className="py-3 px-6">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition shadow"
                        onClick={() => handleDelete(course.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No courses added yet.
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

export default Courses;
