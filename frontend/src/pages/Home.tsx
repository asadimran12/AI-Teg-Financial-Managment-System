import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Interfaces
interface Investment {
  id: number;
  Invested_by: string;
  amount: number;
  Category: string;
  Quantity: number;
  date: string;
}
interface Asset {
  id: number;
  name: string;
  category: string;
  purchase_date: string;
  value: number;
  quantity: number;
  location: string;
}
interface Expense {
  id: number;
  title: string;
  amount: number;
  date: string;
}
interface Teacher {
  id: number;
  name: string;
  courses: string[];
}
interface Student {
  id: number;
  name: string;
  courses: string[];
}
interface TeacherPay {
  id: number;
  name: string;
  pay: number;
  status: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const apiUrl = import.meta.env.VITE_BACKEND;

  const [investments, setInvestments] = useState<Investment[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teacherPays, setTeacherPays] = useState<TeacherPay[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, assetRes, expRes, teacherRes, studentRes, payRes] =
          await Promise.all([
            axios.get(`${apiUrl}/api/investment`),
            axios.get(`${apiUrl}/api/assets`),
            axios.get(`${apiUrl}/api/daily-expenses`),
            axios.get(`${apiUrl}/api/teachers`),
            axios.get(`${apiUrl}/api/students`),
            axios.get(`${apiUrl}/api/teacherpay/all`),
          ]);

        setInvestments(invRes.data);
        setAssets(assetRes.data);
        setExpenses(expRes.data);
        setTeachers(teacherRes.data);
        setStudents(studentRes.data);
        setTeacherPays(payRes.data.data || payRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [apiUrl]);

  // Analytics calculations
  const investmentByCategory = investments.reduce<Record<string, number>>(
    (acc, cur) => {
      acc[cur.Category] = (acc[cur.Category] || 0) + cur.amount;
      return acc;
    },
    {}
  );

  const assetByMonth = assets.reduce<Record<string, number>>((acc, cur) => {
    const month = new Date(cur.purchase_date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    acc[month] = (acc[month] || 0) + cur.value;
    return acc;
  }, {});

  const expensesByMonth = expenses.reduce<Record<string, number>>(
    (acc, cur) => {
      const month = new Date(cur.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      acc[month] = (acc[month] || 0) + cur.amount;
      return acc;
    },
    {}
  );

  const teacherPayByMonth = teacherPays.reduce<Record<string, number>>(
    (acc, cur) => {
      const month = new Date(cur.createdAt).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      acc[month] = (acc[month] || 0) + cur.pay;
      return acc;
    },
    {}
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        <h2 className="text-3xl font-bold text-[#04337B] mb-6 text-center">
          Welcome to AI Teg Financial Management System
        </h2>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-6">
          {[
            {
              key: "investments",
              label: "Investments",
              count: investments.length,
            },
            { key: "assets", label: "Assets", count: assets.length },
            { key: "expenses", label: "Expenses", count: expenses.length },
            { key: "students", label: "Students", count: students.length },
            { key: "teachers", label: "Teachers", count: teachers.length },
            {
              key: "teacherPays",
              label: "Teacher Payments",
              count: teacherPays.length,
            },
          ].map((module) => (
            <div
              key={module.key}
              className="bg-white  rounded-2xl shadow-lg p-6 cursor-pointer hover:bg-[#03C0C8] hover:text-white transition text-center"
              onClick={() => setSelectedModule(module.key)}
            >
              <h3 className="text-xl font-semibold">{module.label}</h3>
              <p className="text-2xl font-bold mt-2">{module.count}</p>
            </div>
          ))}
        </div>

        {/* Selected Module Charts */}
        <div className="flex flex-wrap justify-center gap-6 mt-6">
          {selectedModule === "investments" && (
            <div className="bg-white rounded-2xl shadow-lg p-4 w-80 h-64">
              <h3 className="text-lg font-semibold mb-2 text-center">
                Investment by Category
              </h3>
              <Pie
                data={{
                  labels: Object.keys(investmentByCategory),
                  datasets: [
                    {
                      label: "Amount",
                      data: Object.values(investmentByCategory),
                      backgroundColor: [
                        "#03C0C8",
                        "#04337B",
                        "#FF6384",
                        "#FFCE56",
                        "#36A2EB",
                      ],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: { font: { size: 12 } },
                    },
                  },
                  maintainAspectRatio: false,
                }}
              />
            </div>
          )}

          {selectedModule === "assets" && (
            <div className="bg-white rounded-2xl shadow-lg p-4 w-80 h-64">
              <h3 className="text-lg font-semibold mb-2 text-center">
                Assets Over Time
              </h3>
              <Bar
                data={{
                  labels: Object.keys(assetByMonth),
                  datasets: [
                    {
                      label: "Assets Value",
                      data: Object.values(assetByMonth),
                      backgroundColor: "#03C0C8",
                    },
                  ],
                }}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          )}

          {selectedModule === "expenses" && (
            <div className="bg-white rounded-2xl shadow-lg p-4 w-80 h-64">
              <h3 className="text-lg font-semibold mb-2 text-center">
                Expenses Over Time
              </h3>
              <Bar
                data={{
                  labels: Object.keys(expensesByMonth),
                  datasets: [
                    {
                      label: "Expenses Amount",
                      data: Object.values(expensesByMonth),
                      backgroundColor: "#FF6384",
                    },
                  ],
                }}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          )}

          {selectedModule === "students" && (
            <div className="bg-white rounded-2xl shadow-lg p-4 w-80 h-64 flex flex-col justify-center items-center">
              <h3 className="text-lg font-semibold mb-2">Total Students</h3>
              <p className="text-4xl font-bold text-[#03C0C8]">
                {students.length}
              </p>
            </div>
          )}

          {selectedModule === "teachers" && (
            <div className="bg-white rounded-2xl shadow-lg p-4 w-80 h-64 flex flex-col justify-center items-center">
              <h3 className="text-lg font-semibold mb-2">Total Teachers</h3>
              <p className="text-4xl font-bold text-[#03C0C8]">
                {teachers.length}
              </p>
            </div>
          )}

          {selectedModule === "teacherPays" && (
            <div className="bg-white rounded-2xl shadow-lg p-4 w-96 h-64">
              <h3 className="text-lg font-semibold mb-2 text-center">
                Teacher Payments Over Time
              </h3>
              <Bar
                data={{
                  labels: Object.keys(teacherPayByMonth),
                  datasets: [
                    {
                      label: "Total Paid",
                      data: Object.values(teacherPayByMonth),
                      backgroundColor: "#36A2EB",
                    },
                  ],
                }}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
