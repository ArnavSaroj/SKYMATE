import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOff, IoEye, IoArrowBackCircle } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "../lib/supabaseBrowser";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // signup logic is remaining here

    navigate("/", { replace: true });
  };

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://example.com/auth/callback",
      },
    });

    if (error) {
      console.error("google login error", error.message);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <img
        src="/clouds.jpg"
        alt="clouds"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/30 backdrop-blur-md rounded-lg shadow-lg p-5 w-96">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handleBackClick}
              className="text-gray-800 hover:text-gray-600"
            >
              <IoArrowBackCircle size={30} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 flex-1 text-center">
              Sign Up
            </h2>
            <div className="w-[30px]"></div>
          </div>
          <h3 className="text-center mb-6">
            Signup now to get access to more amazing features
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                onClick={handleToggle}
              >
                {showPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:cursor-pointer"
            >
              GET STARTED
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white/50 px-2 text-gray-500">or</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center gap-2 hover:cursor-pointer"
              onClick={handleGoogleLogin}
            >
              <FcGoogle size={20} />
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
