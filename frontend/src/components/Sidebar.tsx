import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation(); // Get current URL

  const routes = [
    { path: "/", text: "Dashboard" },
    { path: "/student", text: "Students" },
    { path: "/teachers", text: "Teachers" },
    { path: "/courses", text: "Courses" },
    { path: "/investment", text: "Investments" },
    { path: "/assest", text: "Assests" },
    { path: "/dailyexpense", text: "Daily Expenses" },
  ];

  return (
    <aside
      className="w-64 flex flex-col p-6 min-h-screen"
      style={{ backgroundColor: "#04337B", color: "#ffffff" }}
    >
      <div className="mb-10">
        <h2
          className="text-2xl font-bold text-center"
          style={{ color: "#03C0C8" }}
        >
          AITeg Academy
        </h2>
      </div>

      <nav className="flex-1">
        <ul className="space-y-4">
          {routes.map((route) => {
            const isActive = location.pathname === route.path;
            return (
              <li key={route.path}>
                <Link
                  to={route.path}
                  className={`block px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-[#03C0C8] text-[#04337B] font-semibold"
                      : "hover:bg-[#03C0C8] hover:text-[#04337B]"
                  }`}
                >
                  {route.text}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
