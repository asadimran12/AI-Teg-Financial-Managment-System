import Sidebar from "../components/Sidebar";

const Home = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar on the left */}
      <Sidebar />

      {/* Dashboard Content */}
      <div className="flex-1 flex justify-center items-center px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center w-full max-w-lg">
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to
          </h1>

          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
            AI Teg Academy
          </h2>

          <p className="text-lg text-gray-600">
            Final Management System Dashboard
          </p>

        </div>
      </div>
    </div>
  );
};

export default Home;
