import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Report: React.FC = () => {
  const [students, setStudents] = useState<unknown[]>([]);
  const [teachers, setTeachers] = useState<unknown[]>([]);
  const [investments, setInvestments] = useState<unknown[]>([]);
  const [assets, setAssets] = useState<unknown[]>([]);
  const [expenses, setExpenses] = useState<unknown[]>([]);
  const [payments, setPayments] = useState<unknown[]>([]);

  const [selectedSection, setSelectedSection] = useState<string>("");
  const [filterMonth, setFilterMonth] = useState<string>("");

  const apiUrl = import.meta.env.VITE_BACKEND;
  const token = localStorage.getItem("aiteg_token");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          studentsRes,
          teachersRes,
          investmentsRes,
          assetsRes,
          expensesRes,
          paymentsRes,
        ] = await Promise.all([
          axios.get(`${apiUrl}/api/students`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${apiUrl}/api/teachers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${apiUrl}/api/investment`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${apiUrl}/api/assets`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${apiUrl}/api/daily-expenses`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${apiUrl}/api/teacherpay/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStudents(studentsRes.data);
        setTeachers(teachersRes.data);
        setInvestments(investmentsRes.data);
        setAssets(assetsRes.data);
        setExpenses(expensesRes.data);
        setPayments(paymentsRes.data.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [apiUrl, token]);

  // Filter last N months
  const filterLastMonths = (data: any[], dateKey: string) => {
    if (!filterMonth) return data;
    const months = Number(filterMonth);
    const now = new Date();
    const startDate = new Date();
    startDate.setMonth(now.getMonth() - months + 1);
    return data.filter((item) => new Date(item[dateKey]) >= startDate);
  };

  // Filtered datasets
  const filteredStudents = filterLastMonths(students, "createdAt");
  const filteredTeachers = filterLastMonths(teachers, "createdAt");
  const filteredInvestments = filterLastMonths(investments, "createdAt");
  const filteredAssets = filterLastMonths(assets, "createdAt");
  const filteredExpenses = filterLastMonths(expenses, "createdAt");
  const filteredPayments = filterLastMonths(payments, "createdAt");

  // Summary cards
  const summary = [
    {
      key: "students",
      title: "Total Students",
      value: filteredStudents.length,
    },
    {
      key: "teachers",
      title: "Total Teachers",
      value: filteredTeachers.length,
    },
    { key: "assets", title: "Total Assets", value: filteredAssets.length },
    {
      key: "payments",
      title: "Total Payments",
      value: filteredPayments.length,
    },
    {
      key: "expenses",
      title: "Total Expenses",
      value: filteredExpenses.length,
    },
    {
      key: "investments",
      title: "Total Investments",
      value: filteredInvestments.length,
    },
  ];

  const SummaryCard = ({ title, value, onClick }: any) => (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow text-center border cursor-pointer hover:bg-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-2xl font-bold text-[#04337B] mt-2">{value}</p>
    </div>
  );

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("System Report - AI-TEG-FMS", 14, 20);

    const monthLabel = filterMonth
      ? ` (Last ${filterMonth} month${Number(filterMonth) > 1 ? "s" : ""})`
      : "";
    doc.setFontSize(14);
    doc.text(`Summary${monthLabel}`, 14, 30);

    const summaryData = [
      ["Total Students", filteredStudents.length],
      ["Total Teachers", filteredTeachers.length],
      ["Total Assets", filteredAssets.length],
      ["Total Payments", filteredPayments.length],
      ["Total Expenses", filteredExpenses.length],
      ["Total Investments", filteredInvestments.length],
    ];

    autoTable(doc, {
      startY: 35,
      head: [["Module", "Count"]],
      body: summaryData,
    });
    let yPos = (doc as any).lastAutoTable.finalY + 10;

    const addTable = (
      title: string,
      head: string[],
      body: unknown[][],
      totals?: unknown[]
    ) => {
      doc.setFontSize(14);
      doc.text(title, 14, yPos);
      if (totals) body.push(totals);
      autoTable(doc, {
        startY: yPos + 5,
        head: [head],
        body,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [4, 51, 123] },
      });
      yPos = (doc as any).lastAutoTable.finalY + 10;
    };

    // Students
    const studentBody = filteredStudents.map((s) => [
      s.id,
      s.name,
      s.father_name || "-",
      s.Phone_number || "-",
      s.courses?.join(", ") || "-",
      s.fee || 0,
      new Date(s.createdAt).toLocaleDateString(),
    ]);
    const totalFee = [
      "",
      "",
      "",
      "",
      "Total Fee",
      filteredStudents.reduce((acc, s) => acc + (s.fee || 0), 0),
      "",
    ];
    addTable(
      "Students",
      ["ID", "Name", "Father Name", "Phone", "Courses", "Fee", "Created At"],
      studentBody,
      totalFee
    );

    // Teachers
    const teacherBody = filteredTeachers.map((t) => [
      t.id,
      t.name,
      t.Phone_number || "-",
      t.courses?.join(", ") || "-",
      t.pay || 0,
      t.pay_status || "-",
      new Date(t.createdAt).toLocaleDateString(),
    ]);
    const totalPay = [
      "",
      "",
      "",
      "",
      "Total Pay",
      filteredTeachers.reduce((acc, t) => acc + Number(t.pay || 0), 0),
      "",
    ];
    addTable(
      "Teachers",
      ["ID", "Name", "Phone", "Courses", "Pay", "Pay Status", "Created At"],
      teacherBody,
      totalPay
    );

    // Investments
    const investmentBody = filteredInvestments.map((i) => [
      i.id,
      i.Category,
      i.Invested_by,
      i.Quantity,
      i.amount,
      i.date,
      new Date(i.createdAt).toLocaleDateString(),
    ]);
    const totalInvest = [
      "",
      "",
      "",
      "Total",
      filteredInvestments.reduce((acc, i) => acc + i.amount, 0),
      "",
      "",
    ];
    addTable(
      "Investments",
      ["ID", "Category", "Invested By", "Qty", "Amount", "Date", "Created At"],
      investmentBody,
      totalInvest
    );

    // Assets
    const assetsBody = filteredAssets.map((a) => [
      a.id,
      a.name,
      a.category,
      a.value,
      a.quantity,
      a.location,
      a.purchase_date,
      new Date(a.createdAt).toLocaleDateString(),
    ]);
    const totalAssetsValue = [
      "",
      "",
      "Total Value",
      filteredAssets.reduce((acc, a) => acc + a.value, 0),
      "",
      "",
      "",
      "",
    ];
    addTable(
      "Assets",
      [
        "ID",
        "Name",
        "Category",
        "Value",
        "Qty",
        "Location",
        "Purchase Date",
        "Created At",
      ],
      assetsBody,
      totalAssetsValue
    );

    // Expenses
    const expensesBody = filteredExpenses.map((e) => [
      e.id,
      e.category,
      e.amount,
      e.description,
      e.expense_by,
      e.date,
      new Date(e.createdAt).toLocaleDateString(),
    ]);
    const totalExpense = [
      "",
      "",
      "Total Amount",
      filteredExpenses.reduce((acc, e) => acc + e.amount, 0),
      "",
      "",
      "",
    ];
    addTable(
      "Expenses",
      [
        "ID",
        "Category",
        "Amount",
        "Description",
        "Expense By",
        "Date",
        "Created At",
      ],
      expensesBody,
      totalExpense
    );

    // Payments
    const paymentsBody = filteredPayments.map((p) => [
      p.id,
      p.name,
      p.pay,
      p.status,
      new Date(p.createdAt).toLocaleDateString(),
    ]);
    const totalPayment = [
      "",
      "Total Paid",
      filteredPayments.reduce((acc, p) => acc + Number(p.pay), 0),
      "",
      "",
    ];
    addTable(
      "Payments",
      ["ID", "Name", "Pay", "Status", "Created At"],
      paymentsBody,
      totalPayment
    );

    doc.save(`AI-TEG-FMS_Report_${filterMonth || "All"}.pdf`);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <h2 className="text-3xl font-bold text-[#04337B] mb-6">
          System Reports
        </h2>

        <div className="flex gap-4 items-center mb-6">
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="">All Months</option>
            <option value="1">Last 1 Month</option>
            <option value="2">Last 2 Months</option>
            <option value="3">Last 3 Months</option>
          </select>
          <button
            className="bg-[#03C0C8] text-white px-4 py-2 rounded-lg hover:bg-[#04337B]"
            onClick={exportPDF}
          >
            Export PDF
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {summary.map((item, i) => (
            <SummaryCard
              key={i}
              title={item.title}
              value={item.value}
              onClick={() => setSelectedSection(item.key)}
            />
          ))}
        </div>

        {selectedSection && (
          <DetailTable
            title={
              selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)
            }
            data={
              selectedSection === "students"
                ? filteredStudents
                : selectedSection === "teachers"
                ? filteredTeachers
                : selectedSection === "investments"
                ? filteredInvestments
                : selectedSection === "assets"
                ? filteredAssets
                : selectedSection === "expenses"
                ? filteredExpenses
                : filteredPayments
            }
            columns={
              selectedSection === "students"
                ? [
                    "ID",
                    "Name",
                    "Father Name",
                    "Phone",
                    "Courses",
                    "Fee",
                    "Created At",
                  ]
                : selectedSection === "teachers"
                ? [
                    "ID",
                    "Name",
                    "Phone",
                    "Courses",
                    "Pay",
                    "Pay Status",
                    "Created At",
                  ]
                : selectedSection === "investments"
                ? [
                    "ID",
                    "Category",
                    "Invested By",
                    "Qty",
                    "Amount",
                    "Date",
                    "Created At",
                  ]
                : selectedSection === "assets"
                ? [
                    "ID",
                    "Name",
                    "Category",
                    "Value",
                    "Qty",
                    "Location",
                    "Purchase Date",
                    "Created At",
                  ]
                : selectedSection === "expenses"
                ? [
                    "ID",
                    "Category",
                    "Amount",
                    "Description",
                    "Expense By",
                    "Date",
                    "Created At",
                  ]
                : ["ID", "Name", "Pay", "Status", "Created At"]
            }
            mapper={(item: any) =>
              selectedSection === "students"
                ? [
                    item.id,
                    item.name,
                    item.father_name || "-",
                    item.Phone_number || "-",
                    item.courses?.join(", ") || "-",
                    item.fee || "-",
                    new Date(item.createdAt).toLocaleDateString(),
                  ]
                : selectedSection === "teachers"
                ? [
                    item.id,
                    item.name,
                    item.Phone_number || "-",
                    item.courses?.join(", ") || "-",
                    item.pay,
                    item.pay_status || "-",
                    new Date(item.createdAt).toLocaleDateString(),
                  ]
                : selectedSection === "investments"
                ? [
                    item.id,
                    item.Category,
                    item.Invested_by,
                    item.Quantity,
                    item.amount,
                    item.date,
                    new Date(item.createdAt).toLocaleDateString(),
                  ]
                : selectedSection === "assets"
                ? [
                    item.id,
                    item.name,
                    item.category,
                    item.value,
                    item.quantity,
                    item.location,
                    item.purchase_date,
                    new Date(item.createdAt).toLocaleDateString(),
                  ]
                : selectedSection === "expenses"
                ? [
                    item.id,
                    item.category,
                    item.amount,
                    item.description,
                    item.expense_by,
                    item.date,
                    new Date(item.createdAt).toLocaleDateString(),
                  ]
                : [
                    item.id,
                    item.name,
                    item.pay,
                    item.status,
                    new Date(item.createdAt).toLocaleDateString(),
                  ]
            }
          />
        )}
      </main>
    </div>
  );
};

export default Report;

// DetailTable component
const DetailTable = ({ title, data, columns, mapper }: any) => (
  <div className="bg-white p-4 rounded-lg shadow mt-6 overflow-x-auto">
    <h3 className="text-xl font-bold mb-4">{title} Details</h3>
    <table className="w-full border">
      <thead className="bg-gray-200">
        <tr>
          {columns.map((col: string, idx: number) => (
            <th className="p-2 border" key={idx}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item: any) => (
          <tr key={item.id}>
            {mapper(item).map((v: any, idx: number) => (
              <td className="p-2 border" key={idx}>
                {v}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
