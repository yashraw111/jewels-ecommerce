// Signup.jsx
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Bracelet from "../assets/images/Bracelet.jpg";

const Signup = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const navigate = useNavigate()
  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:8000/api/auth/register", data);
      toast.success("Registration Successful!");
      navigate("/login")
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex min-h-screen">
      <ToastContainer />
      {/* Left Form Panel */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">KUKU <span className="text-purple-600">JEWELS</span></h1>
        </div>

        <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-2xl font-semibold mb-4 text-center">Create Account</h2>

          <input {...register("fullName", { required: "Full Name is required" })}
            placeholder="Full Name"
            className="w-full px-4 py-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}

          <input {...register("name", { required: "Username is required" })}
            placeholder="Username"
            className="w-full px-4 py-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <input {...register("email", { required: "Email is required" })}
            placeholder="Email Address"
            type="email"
            className="w-full px-4 py-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
            />
            <div className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          {/* Repeat Password */}
          <div className="relative">
            <input
              type={showRepeatPassword ? "text" : "password"}
              placeholder="Repeat Password"
              {...register("confirmPassword", {
                required: "Repeat password is required",
                validate: (val) => val === watch("password") || "Passwords do not match"
              })}
              className="w-full px-4 py-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
            />
            <div className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}>
              {showRepeatPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}

          <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition">
            Sign Up
          </button>

          <div className="text-center text-sm mt-2">
            Already have an account?{" "}
            <a href="/login" className="text-purple-600 cursor-pointer">Log In</a>
          </div>
        </form>
      </div>

      {/* Right Image Panel */}
      <div className="hidden md:block w-1/2">
        <img src={Bracelet} alt="Jewelry" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Signup;
