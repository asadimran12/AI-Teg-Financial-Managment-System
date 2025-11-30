import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../assets/Logo.png";
import { removeToken } from "../services/auth";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    navigate("/"); // redirect user
  };

  const routes = [
    { path: "/home", text: "Dashboard" },
    { path: "/student", text: "Students" },
    { path: "/teachers", text: "Teachers" },
    { path: "/courses", text: "Courses" },
    { path: "/investment", text: "Investments" },
    { path: "/assest", text: "Assests" },
    { path: "/dailyexpense", text: "Daily Expenses" },
    { path: "/teacherspay", text: "Payment" },
    { path: "/sale", text: "Product Sale" },
  ];

  return (
    <>
      {!isOpen && (
        <button
          className="block md:hidden p-4 fixed top-0 left-0 z-50 text-[#04337B]"
          onClick={() => setIsOpen(true)}
        >
          <FiMenu size={28} />
        </button>
      )}

      <aside
        className={`
    fixed top-0 left-0 h-screen w-64 p-6 flex flex-col shadow-lg z-50
    bg-[#04337B] text-white
    overflow-y-auto  
    [&::-webkit-scrollbar]:hidden
    [-ms-overflow-style:none]
    [scrollbar-width:none]
    transform transition-transform duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    md:static md:translate-x-0 md:block
  `}
      >
        <div className="flex justify-between items-center mb-10">
          <img
            src={logo}
            alt="AITeg Academy"
            className="bg-white p-2 rounded-lg w-32 h-auto object-contain"
          />

          <button className="block md:hidden" onClick={() => setIsOpen(false)}>
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
                    className={`block px-4 py-2 rounded-lg transition-all ${
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

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="block w-full cursor-pointer px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all mt-4"
            >
              Logout
            </button>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
