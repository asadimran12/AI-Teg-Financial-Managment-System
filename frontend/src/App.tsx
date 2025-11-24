import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Student from "./pages/Student";
import Courses from "./pages/Courses";
import Teachers from "./pages/Teachers";

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
  ]);

  return <RouterProvider router={router} />;
};

export default App;
