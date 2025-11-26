import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Student from "./pages/Student";
import Courses from "./pages/Courses";
import Teachers from "./pages/Teachers";
import { Investment } from "./pages/Investment";
import { Assets } from "./pages/Assest";
import { DailyExpenses } from "./pages/DailyExpense";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/student",
      element: <Student />,
    },
    {
      path: "/courses",
      element: <Courses />,
    },
    {
      path: "/teachers",
      element: <Teachers />,
    },
     {
      path: "/investment",
      element: <Investment />,
    },
      {
      path: "/assest",
      element: <Assets />,
    },
     {
      path: "/dailyexpense",
      element: <DailyExpenses />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
