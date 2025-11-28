import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Report from "./pages/Report ";
import Student from "./pages/Student";
import Courses from "./pages/Courses";
import Teachers from "./pages/Teachers";
import { Investment } from "./pages/Investment";
import { Assets } from "./pages/Assest";
import { DailyExpenses } from "./pages/DailyExpense";
import Teachers_pay from "./pages/Teachers_pay";
import Login from "./pages/Login";
import { setAxiosAuthHeaderFromStorage } from "./services/auth";
import { protectedLoader } from "./services/authRoute";

const App = () => {
  setAxiosAuthHeaderFromStorage();

  const router = createBrowserRouter([
    // Public Route
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/report",
      element: <Report />,
    },

    // Protected Routes
    {
      path: "/home",
      element: <Home />,
      loader: protectedLoader,
    },
    {
      path: "/student",
      element: <Student />,
      loader: protectedLoader,
    },
    {
      path: "/courses",
      element: <Courses />,
      loader: protectedLoader,
    },
    {
      path: "/teachers",
      element: <Teachers />,
      loader: protectedLoader,
    },
    {
      path: "/investment",
      element: <Investment />,
      loader: protectedLoader,
    },
    {
      path: "/assest",
      element: <Assets />,
      loader: protectedLoader,
    },
    {
      path: "/dailyexpense",
      element: <DailyExpenses />,
      loader: protectedLoader,
    },
    {
      path: "/teacherspay",
      element: <Teachers_pay />,
      loader: protectedLoader,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
