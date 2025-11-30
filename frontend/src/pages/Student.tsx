import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import jsPDF from "jspdf";

interface Student {
  id: number;
  name: string;
  father_name: string;
  Address: string;
  Phone_number: string;
  course: string[];
  fee: number;
  Discount?: number;
  fee_after_discount?: number;
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
    Discount: 0,
    fee_after_discount: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

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
      const fee = calculateTotalFee(newCourses);
      const fee_after_discount = fee - (fee * (form.Discount || 0)) / 100;
      setForm({ ...form, course: newCourses, fee, fee_after_discount });
    }
  };

  const handleCourseRemove = (courseName: string) => {
    const newCourses = form.course.filter((c) => c !== courseName);
    const fee = calculateTotalFee(newCourses);
    const fee_after_discount = fee - (fee * (form.Discount || 0)) / 100;
    setForm({ ...form, course: newCourses, fee, fee_after_discount });
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
        Discount: 0,
        fee_after_discount: 0,
      });
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (student: Student) => {
    setForm({
      ...student,
      Discount: student.Discount || 0,
      fee_after_discount: student.fee_after_discount || student.fee,
    });
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

  // Generate PDF Challan
  const generateChallan = (student: Student) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // ===== HEADER SECTION =====
    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.rect(10, 10, pageWidth - 20, 270); // full border

    doc.setFontSize(22);
    doc.setTextColor(20, 60, 140);
    doc.text("AI-TEG-FMS Institute", pageWidth / 2, 25, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("Empowering Future Through Technology", pageWidth / 2, 32, {
      align: "center",
    });

    // Receipt Info
    doc.setFontSize(11);
    doc.text(
      `Challan No: ${Math.floor(Math.random() * 90000) + 10000}`,
      20,
      45
    );
    doc.text(
      `Issue Date: ${new Date().toLocaleDateString()}`,
      pageWidth - 60,
      45
    );

    doc.line(10, 50, pageWidth - 10, 50);

    // ===== STUDENT DETAILS =====
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Student Information", 15, 60);

    doc.setFontSize(11);
    doc.text(`Name: ${student.name}`, 15, 70);
    doc.text(`Father Name: ${student.father_name}`, 15, 80);
    doc.text(`Phone: ${student.Phone_number}`, 15, 90);
    doc.text(`Address: ${student.Address}`, 15, 100);

    doc.line(10, 110, pageWidth - 10, 110);

    // ===== COURSE TABLE =====
    doc.setFontSize(14);
    doc.text("Course Fee Details", 15, 120);

    // Table Header
    doc.setFillColor(3, 192, 200);
    doc.setTextColor(255, 255, 255);
    doc.rect(15, 130, pageWidth - 30, 10, "F");
    doc.text("Course Name", 20, 137);
    doc.text("Fee", pageWidth - 50, 137);

    // Table Rows
    let rowY = 145;
    doc.setTextColor(0, 0, 0);

    student.course.forEach((cName) => {
      const course = courses.find((c) => c.name === cName);
      if (course) {
        doc.text(course.name, 20, rowY);
        doc.text(`${course.fee}`, pageWidth - 50, rowY);
        rowY += 10;
      }
    });

    doc.line(15, rowY, pageWidth - 15, rowY);
    rowY += 10;

    // ===== PAYMENT SUMMARY =====
    doc.setFontSize(14);
    doc.text("Payment Summary", 15, rowY);
    rowY += 10;

    doc.setFontSize(11);
    doc.text(`Total Fee: Rs ${student.fee}`, 20, rowY);
    rowY += 10;

    doc.text(`Discount: ${student.Discount ?? 0}%`, 20, rowY);
    rowY += 10;

    const finalFee = student.fee_after_discount ?? student.fee;
    doc.text(`Final Payable Amount: Rs ${finalFee}`, 20, rowY);

    rowY += 20;
    doc.line(10, rowY, pageWidth - 10, rowY);
    rowY += 20;

    // ===== SIGNATURE AREA =====
    doc.setFontSize(12);
    doc.text("_________________________", 25, rowY + 10);
    doc.text("Student Signature", 35, rowY + 18);

    doc.text("_________________________", pageWidth - 80, rowY + 10);
    doc.text("Admin Signature", pageWidth - 67, rowY + 18);

    // ===== FOOTER =====
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(
      "This is a system-generated financial document. No manual edits are allowed.",
      pageWidth / 2,
      285,
      { align: "center" }
    );

    doc.save(`${student.name}_challan.pdf`);
  };

  const filteredStudents = students.filter((s) => {
    const byName = s.name.toLowerCase().includes(filterName.toLowerCase());
    const byCourse = filterCourse === "" || s.course.includes(filterCourse);
    const byDate =
      filterDate === "" || (s.createdAt && s.createdAt.startsWith(filterDate));
    return byName && byCourse && byDate;
  });

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className=" h-full overflow-y-auto">
        <Sidebar />
      </div>
      <main className="flex-1 h-full p-6 overflow-y-auto ">
        <h2 className="text-3xl font-bold text-[#04337B] mb-4">
          Students Dashboard
        </h2>

        {/* ========= ADD / UPDATE FORM ========= */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-[#04337B] mb-4">
            {isEditing ? "Update Student" : "Add Student"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Name
              </label>
              <input
                className="border rounded-lg px-4 py-2 w-full"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Father Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Father Name
              </label>
              <input
                className="border rounded-lg px-4 py-2 w-full"
                placeholder="Father Name"
                value={form.father_name}
                onChange={(e) =>
                  setForm({ ...form, father_name: e.target.value })
                }
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Phone
              </label>
              <input
                className="border rounded-lg px-4 py-2 w-full"
                placeholder="Phone"
                value={form.Phone_number}
                onChange={(e) =>
                  setForm({ ...form, Phone_number: e.target.value })
                }
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Address
              </label>
              <input
                className="border rounded-lg px-4 py-2 w-full"
                placeholder="Address"
                value={form.Address}
                onChange={(e) => setForm({ ...form, Address: e.target.value })}
              />
            </div>

            {/* Courses */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Courses
              </label>
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
            </div>

            {/* Fees */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Fees
              </label>
              <input
                type="number"
                className="border rounded-lg px-4 py-2 w-full"
                placeholder="Fees"
                value={form.fee}
                readOnly
              />
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                className="border rounded-lg px-4 py-2 w-full"
                placeholder="Discount %"
                value={form.Discount}
                onChange={(e) => {
                  const discount = parseFloat(e.target.value) || 0;
                  const fee_after_discount =
                    form.fee - (form.fee * discount) / 100;
                  setForm({ ...form, Discount: discount, fee_after_discount });
                }}
              />
            </div>

            {/* Fee After Discount */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Fee After Discount
              </label>
              <input
                type="number"
                className="border rounded-lg px-4 py-2 w-full"
                placeholder="Fee After Discount"
                value={form.fee_after_discount}
                readOnly
              />
            </div>

            {/* Submit Button */}
            <button
              className="bg-[#03C0C8] cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-[#04337B] col-span-full"
              onClick={handleAddOrUpdate}
            >
              {isEditing ? "Update" : "Add"}
            </button>
          </div>
        </div>

        {/* ========= FILTER BAR ========= */}
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

        {/* ========= STUDENTS TABLE ========= */}
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
                      {s.fee_after_discount ?? s.fee}
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
                      <button
                        onClick={() => generateChallan(s)}
                        className="bg-blue-500 cursor-pointer text-white px-3 py-1 rounded"
                      >
                        Generate Challan
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
