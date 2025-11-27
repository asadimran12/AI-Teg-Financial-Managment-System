import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

interface Course {
  id: number;
  name: string;
  fee: number;
  duration: string;
  description: string;
  createdAt?: string; // added so date filter works
}

const apiUrl = import.meta.env.VITE_BACKEND;

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState({
    id: 0,
    name: "",
    fee: 0,
    duration: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Filters
  const [filterCourse, setFilterCourse] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/courses`);
        setCourses(res.data.data || []);
      } catch (error) {
        console.log("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Filtered list
  const filteredCourses = courses.filter((c) => {
    const byCourse =
      filterCourse === "" ||
      c.name.toLowerCase() === filterCourse.toLowerCase();

    const byDate =
      filterDate === "" || (c.createdAt && c.createdAt.startsWith(filterDate));

    return byCourse && byDate;
  });

  // Add or Update course
  const handleAddOrUpdate = async () => {
    if (!form.name || !form.duration) return;

    try {
      if (isEditing) {
        const res = await axios.put(`${apiUrl}/api/courses/${form.id}`, form);
        setCourses(courses.map((c) => (c.id === form.id ? res.data.data : c)));
      } else {
        const res = await axios.post(`${apiUrl}/api/courses`, form);
        setCourses([...courses, res.data.data]);
      }

      setForm({ id: 0, name: "", fee: 0, duration: "", description: "" });
      setIsEditing(false);
    } catch (error) {
      console.log("Error adding/updating course:", error);
    }
  };

  // Edit
  const handleEdit = (course: Course) => {
    setForm({
      id: course.id,
      name: course.name,
      fee: course.fee,
      duration: course.duration,
      description: course.description,
    });
    setIsEditing(true);
  };

  // Delete
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/api/courses/${id}`);
      setCourses(courses.filter((c) => c.id !== id));
    } catch (error) {
      console.log("Error deleting course:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        <h2 className="text-3xl font-bold text-[#04337B] mb-6">
          Courses Dashboard
        </h2>

        {/* Add / Update Course Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-[#04337B] mb-4">
            {isEditing ? "Update Course" : "Add New Course"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              className="border rounded-lg px-4 py-2 shadow-sm"
              placeholder="Course Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="number"
              className="border rounded-lg px-4 py-2 shadow-sm"
              placeholder="Fee"
              value={form.fee}
              onChange={(e) => setForm({ ...form, fee: +e.target.value })}
            />

            <input
              className="border rounded-lg px-4 py-2 shadow-sm"
              placeholder="Duration"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />

            <input
              className="border rounded-lg px-4 py-2 shadow-sm col-span-full"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <button
              className="bg-[#03C0C8] cursor-pointer text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#04337B] col-span-full"
              onClick={handleAddOrUpdate}
            >
              {isEditing ? "Update Course" : "Add Course"}
            </button>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white p-3 rounded-xl shadow-md flex flex-wrap items-center justify-around gap-4 mb-6">
          {/* Dropdown Filter Only */}
          <select
            className="border rounded-lg px-3 py-2 w-40"
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
          >
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Date filter */}
          <input
            type="date"
            className="border rounded-lg px-3 py-2 w-40"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />

          <button
            className="bg-[#03C0C8] cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-[#04337B]"
            onClick={() => {
              setFilterCourse("");
              setFilterDate("");
            }}
          >
            Clear
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#03C0C8] text-white">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Fee</th>
                <th className="py-3 px-6 text-left">Duration (Months)</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course, idx) => (
                  <tr
                    key={course.id}
                    className={
                      idx % 2 === 0
                        ? "bg-gray-50 hover:bg-gray-100"
                        : "hover:bg-gray-100"
                    }
                  >
                    <td className="py-3 px-6">{course.name}</td>
                    <td className="py-3 px-6">{course.fee}</td>
                    <td className="py-3 px-6">{course.duration}</td>
                    <td className="py-3 px-6">{course.description}</td>

                    <td className="py-3 px-6 flex gap-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                        onClick={() => handleEdit(course)}
                      >
                        Edit
                      </button>

                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
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
                    No courses found.
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
