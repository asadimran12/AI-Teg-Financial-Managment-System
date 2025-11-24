import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

interface Student {
  id: number;
  name: string;
  fatherName: string;
  phone: string;
  course: string;
  fees_paid: number;
}

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState({
    name: '',
    fatherName: '',
    phone: '',
    course: '',
    fees_paid: 0,
  });

  const handleAdd = () => {
    if (!form.name || !form.fatherName) return;
    const newStudent: Student = { id: Date.now(), ...form };
    setStudents([...students, newStudent]);
    setForm({ name: '', fatherName: '', phone: '', course: '', fees_paid: 0 });
  };

  const handleDelete = (id: number) => {
    setStudents(students.filter(student => student.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <h2 className="text-3xl font-bold text-[#04337B] mb-6">Students Dashboard</h2>

        {/* Add Student Form - Card Style */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-[#04337B] mb-4">Add New Student</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Father Name"
              value={form.fatherName}
              onChange={e => setForm({ ...form, fatherName: e.target.value })}
            />
            <input
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Phone"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
            <input
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Course"
              value={form.course}
              onChange={e => setForm({ ...form, course: e.target.value })}
            />
            <input
              type="number"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#03C0C8] shadow-sm"
              placeholder="Fees Paid"
              value={form.fees_paid}
              onChange={e => setForm({ ...form, fees_paid: +e.target.value })}
            />
            <button
              className="bg-[#03C0C8] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#04337B] transition shadow"
              onClick={handleAdd}
            >
              Add Student
            </button>
          </div>
        </div>

        {/* Students List Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#03C0C8] text-white">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Father Name</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Course</th>
                <th className="py-3 px-6 text-left">Fees Paid</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.length > 0 ? (
                students.map((student, idx) => (
                  <tr
                    key={student.id}
                    className={idx % 2 === 0 ? "bg-gray-50 hover:bg-gray-100 transition" : "hover:bg-gray-100 transition"}
                  >
                    <td className="py-3 px-6 font-medium text-[#04337B]">{student.name}</td>
                    <td className="py-3 px-6">{student.fatherName}</td>
                    <td className="py-3 px-6">{student.phone}</td>
                    <td className="py-3 px-6">{student.course}</td>
                    <td className="py-3 px-6 font-semibold text-[#03C0C8]">{student.fees_paid}</td>
                    <td className="py-3 px-6">
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
                  <td colSpan={6} className="text-center py-4 text-gray-500">
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
