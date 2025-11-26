import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

interface Student {
  id: number;
  name: string;
  father_name: string;
  Address: string;
  Phone_number: string;
  course: string[];
  fee: number;
}

interface Course {
  id: number;
  name: string;
  fee: number;
}

const apiUrl = import.meta.env.VITE_BACKEND;

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState({
    id: 0,
    name: "",
    father_name: "",
    Phone_number: "",
    Address: "",
    course: [] as string[],
    fee: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          axios.get(`${apiUrl}/api/students`),
          axios.get(`${apiUrl}/api/courses`),
        ]);
        setStudents(studentsRes.data);
        setCourses(coursesRes.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const calculateTotalFee = (selectedCourses: string[]) => {
    return courses
      .filter((c) => selectedCourses.includes(c.name))
      .reduce((total, c) => total + c.fee, 0);
  };

  const handleCourseSelect = (courseName: string) => {
    if (!form.course.includes(courseName)) {
      const newCourses = [...form.course, courseName];
      const totalFee = calculateTotalFee(newCourses);
      setForm({ ...form, course: newCourses, fee: totalFee });
    }
  };

  const handleCourseRemove = (courseName: string) => {
    const newCourses = form.course.filter((c) => c !== courseName);
    const totalFee = calculateTotalFee(newCourses);
    setForm({ ...form, course: newCourses, fee: totalFee });
  };

  const handleAddOrUpdate = async () => {
    if (!form.name || !form.father_name || form.course.length === 0) return;

    try {
      if (isEditing) {
        // Update existing student
        const response = await axios.put(
          `${apiUrl}/api/students/${form.id}`,
          form
        );
        setStudents(
          students.map((s) => (s.id === form.id ? response.data : s))
        );
      } else {
        // Add new student
        const response = await axios.post(`${apiUrl}/api/students`, form);
        setStudents([...students, response.data]);
      }

      // Reset form
      setForm({
        id: 0,
        name: "",
        father_name: "",
        Phone_number: "",
        Address: "",
        course: [],
        fee: 0,
      });
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (student: Student) => {
    setForm({
      id: student.id,
      name: student.name,
      father_name: student.father_name,
      Phone_number: student.Phone_number,
      Address: student.Address,
      course: student.course,
      fee: student.fee,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/api/students/${id}`);
      setStudents(students.filter((student) => student.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <h2 className="text-3xl font-bold text-[#04337B] mb-6">
          Students Dashboard
        </h2>

        {/* Add / Update Student Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-[#04337B] mb-4">
            {isEditing ? "Update Student" : "Add New Student"}
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
              placeholder="Father Name"
              value={form.father_name}
              onChange={(e) =>
                setForm({ ...form, father_name: e.target.value })
              }
            />
            <input
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Phone"
              value={form.Phone_number}
              onChange={(e) =>
                setForm({ ...form, Phone_number: e.target.value })
              }
            />
            <input
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Address"
              value={form.Address}
              onChange={(e) => setForm({ ...form, Address: e.target.value })}
            />

            {/* Multi-select Courses */}
            <div className="border rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-[#03C0C8] shadow-sm">
              <div className="flex flex-wrap gap-1">
                {form.course.map((c) => (
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
                className="mt-2 w-full border-none focus:ring-0 outline-none"
                value=""
                onChange={(e) => handleCourseSelect(e.target.value)}
              >
                <option value="">Select course</option>
                {courses
                  .filter((c) => !form.course.includes(c.name))
                  .map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.fee})
                    </option>
                  ))}
              </select>
            </div>

            {/* Fees (readonly) */}
            <input
              type="number"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Total Fees"
              value={form.fee}
              readOnly
            />

            <button
              className="bg-[#03C0C8] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#04337B] transition shadow"
              onClick={handleAddOrUpdate}
            >
              {isEditing ? "Update Student" : "Add Student"}
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#03C0C8] text-white">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Father Name</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Address</th>
                <th className="py-3 px-6 text-left">Courses</th>
                <th className="py-3 px-6 text-left">Fees</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.length > 0 ? (
                students.map((student, idx) => (
                  <tr
                    key={student.id}
                    className={
                      idx % 2 === 0
                        ? "bg-gray-50 hover:bg-gray-100 transition"
                        : "hover:bg-gray-100 transition"
                    }
                  >
                    <td className="py-3 px-6 font-medium text-[#04337B]">
                      {student.name}
                    </td>
                    <td className="py-3 px-6">{student.father_name}</td>
                    <td className="py-3 px-6">{student.Phone_number}</td>
                    <td className="py-3 px-6">{student.Address}</td>
                    <td className="py-3 px-6">{student.course.join(", ")}</td>
                    <td className="py-3 px-6 font-semibold text-[#03C0C8]">
                      {student.fee}
                    </td>
                    <td className="py-3 px-6 flex gap-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition shadow"
                        onClick={() => handleEdit(student)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition shadow"
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No students added yet.
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

export default Students;
