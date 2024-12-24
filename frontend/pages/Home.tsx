import React from 'react'
import { useNavigate } from "react-router-dom";
import Layout2 from '../layouts/Layout';
import { useAuthStore } from '../store/authStore';
import { FaProjectDiagram, FaTasks, FaClock } from 'react-icons/fa';
import { BiColumns } from "react-icons/bi";
import { useGoogleOneTapLogin } from '@react-oauth/google';
import { GoogleJWT } from '../types/types';
import { jwtDecode } from 'jwt-decode';
import { googleLogin } from '../src/api/auth';
import { toast } from 'sonner';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore((state) => state);
  const auth = useAuthStore((state) => state)
  useGoogleOneTapLogin({
    onSuccess: async (credentialResponse) => {
      console.log(credentialResponse);
      const decoded: GoogleJWT = jwtDecode(credentialResponse.credential);
      const data = await googleLogin(decoded);
      auth?.login(data);
      navigate("/project");
      toast.success("Logged In Successfully");
    },
    onError: () => {
      console.log('Login Failed');
    },
  });

  React.useEffect(() => {
    if (user) {
      console.log("User is logged in");
      navigate('/project');
    }
  }, [user, navigate]);

  return (
    <Layout2>
      <div className=" text-white flex flex-col items-center justify-center px-4">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Task Tracker</h1>
          <p className="text-lg md:text-2xl">
            Manage your projects and tasks efficiently with our intuitive tools.
          </p>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Feature Card */}
          <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center shadow-lg hover:shadow-2xl transition duration-300">
            <FaProjectDiagram className="text-4xl mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold mb-2">Projects</h3>
            <p>Organize your work into manageable projects.</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center shadow-lg hover:shadow-2xl transition duration-300">
            <FaTasks className="text-4xl mb-4 text-green-500" />
            <h3 className="text-xl font-semibold mb-2">Tasks</h3>
            <p>Create and manage tasks with ease.</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center shadow-lg hover:shadow-2xl transition duration-300">
            <BiColumns className="text-4xl mb-4 text-purple-500" />
            <h3 className="text-xl font-semibold mb-2">Kanban Board</h3>
            <p>Visualize your workflow with our Kanban board.</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center shadow-lg hover:shadow-2xl transition duration-300">
            <FaClock className="text-4xl mb-4 text-yellow-500" />
            <h3 className="text-xl font-semibold mb-2">Pomodoro Timer</h3>
            <p>Boost your productivity with the Pomodoro technique.</p>
          </div>
        </section>

        {/* Call to Action */}
        <section>
          {!user && (
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
            >
              Get Started
            </button>
          )}
        </section>
      </div>
    </Layout2>
  );
};

export default Home;
