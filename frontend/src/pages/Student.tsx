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
  createdAt?: string;
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

  // Filters
  const [filterName, setFilterName] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          axios.get(`${apiUrl}/api/students`),
          axios.get(`${apiUrl}/api/courses`),
        ]);
        setStudents(studentsRes.data);
        setCourses(coursesRes.data.data);
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
      setForm({
        ...form,
        course: newCourses,
        fee: calculateTotalFee(newCourses),
      });
    }
  };

  const handleCourseRemove = (courseName: string) => {
    const newCourses = form.course.filter((c) => c !== courseName);
    setForm({
      ...form,
      course: newCourses,
      fee: calculateTotalFee(newCourses),
    });
  };

  const handleAddOrUpdate = async () => {
    if (!form.name || !form.father_name || form.course.length === 0) return;

    try {
      if (isEditing) {
        const res = await axios.put(`${apiUrl}/api/students/${form.id}`, form);
        setStudents(students.map((s) => (s.id === form.id ? res.data : s)));
      } else {
        const res = await axios.post(`${apiUrl}/api/students`, form);
        setStudents([...students, res.data]);
      }

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
    setForm(student);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/api/students/${id}`);
      setStudents(students.filter((s) => s.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const filteredStudents = students.filter((s) => {
    const byName = s.name.toLowerCase().includes(filterName.toLowerCase());
    const byCourse = filterCourse === "" || s.course.includes(filterCourse);
    const byDate =
      filterDate === "" || (s.createdAt && s.createdAt.startsWith(filterDate));
    return byName && byCourse && byDate;
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        <h2 className="text-3xl font-bold text-[#04337B] mb-4">
          Students Dashboard
        </h2>

        {/* ========= ADD / UPDATE FORM ========= */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-[#04337B] mb-4">
            {isEditing ? "Update Student" : "Add Student"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              className="border rounded-lg px-4 py-2"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="border rounded-lg px-4 py-2"
              placeholder="Father Name"
              value={form.father_name}
              onChange={(e) =>
                setForm({ ...form, father_name: e.target.value })
              }
            />

            <input
              className="border rounded-lg px-4 py-2"
              placeholder="Phone"
              value={form.Phone_number}
              onChange={(e) =>
                setForm({ ...form, Phone_number: e.target.value })
              }
            />

            <input
              className="border rounded-lg px-4 py-2"
              placeholder="Address"
              value={form.Address}
              onChange={(e) => setForm({ ...form, Address: e.target.value })}
            />

            {/* Multi Course Select */}
            <div className="border rounded-lg px-4 py-2">
              <div className="flex flex-wrap gap-1">
                {form.course.map((c) => (
                  <span
                    key={c}
                    className="bg-[#03C0C8] text-white px-2 py-1 rounded-full"
                  >
                    {c}
                    <button
                      onClick={() => handleCourseRemove(c)}
                      className="ml-1 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <select
                className="mt-2 w-full border-none outline-none"
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

            <input
              type="number"
              className="border rounded-lg px-4 py-2"
              placeholder="Fees"
              value={form.fee}
              readOnly
            />

            <button
              className="bg-[#03C0C8] cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-[#04337B] col-span-full"
              onClick={handleAddOrUpdate}
            >
              {isEditing ? "Update" : "Add"}
            </button>
          </div>
        </div>

        {/* ========= SMALL FILTER BAR (NEW) ========= */}
        <div className="bg-white p-3 rounded-xl shadow-md flex flex-wrap items-center justify-around mb-6">
          <input
            type="text"
            placeholder="Search by name"
            className="border rounded-lg px-3 py-2 w-40"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />

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

          <input
            type="date"
            className="border rounded-lg px-3 py-2 w-40"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />

          <button
            className="bg-[#03C0C8] cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-[#04337B]"
            onClick={() => {
              setFilterName("");
              setFilterCourse("");
              setFilterDate("");
            }}
          >
            Clear
          </button>
        </div>

        {/* ========= TABLE ========= */}
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#03C0C8] text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Father Name</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-left">Courses</th>
                <th className="p-3 text-left">Fees</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length ? (
                filteredStudents.map((s, i) => (
                  <tr key={s.id} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">{s.father_name}</td>
                    <td className="p-3">{s.Phone_number}</td>
                    <td className="p-3">{s.Address}</td>
                    <td className="p-3">{s.course.join(", ")}</td>
                    <td className="p-3 font-semibold text-[#03C0C8]">
                      {s.fee}
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(s)}
                        className="bg-green-500 cursor-pointer text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="bg-red-500 cursor-pointer text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={7}>
                    No students found.
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
