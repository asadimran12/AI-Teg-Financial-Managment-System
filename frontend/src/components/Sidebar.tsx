import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const routes = [
    { path: "/", text: "Dashboard" },
    { path: "/student", text: "Students" },
    { path: "/teachers", text: "Teachers" },
    { path: "/courses", text: "Courses" },
    { path: "/investment", text: "Investments" },
    { path: "/assest", text: "Assests" },
    { path: "/dailyexpense", text: "Daily Expenses" },
    { path: "/teacherspay", text: "Teachers Pay" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      {!isOpen && (
        <button
          className="block md:hidden p-4 fixed top-0 left-0 z-50 text-[#04337B] transition duration-300 ease-in-out hover:scale-110"
          onClick={() => setIsOpen(true)}
        >
          <FiMenu size={28} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 p-6 flex flex-col shadow-lg z-50 
          bg-[#04337B] text-white transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:block
        `}
      >
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold" style={{ color: "#03C0C8" }}>
            AITeg Academy
          </h2>

          {/* Close button */}
          <button
            className="block md:hidden transition duration-300 hover:rotate-90"
            onClick={() => setIsOpen(false)}
          >
            <FiX size={28} />
          </button>
        </div>

        <nav className="flex-1">
          <ul className="space-y-4">
            {routes.map((route) => {
              const isActive = location.pathname === route.path;
              return (
                <li key={route.path}>
                  <Link
                    to={route.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-[#03C0C8] text-[#04337B] font-semibold shadow"
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
    </>
  );
};

export default Sidebar;
