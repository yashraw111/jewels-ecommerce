import { useDispatch } from "react-redux";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import Bracelet from "../assets/images/Bracelet.jpg";
import { setUser } from "../redux/UserSlice";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../helper/firebase";
import { signInWithPopup } from "firebase/auth";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const redirect = useNavigate();
  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", data, {
        withCredentials: true,
      });
      toast.success("Login successful");
      setTimeout(() => {
        dispatch(setUser(res.data.user));
        redirect("/");
      }, 1000); // 👈 delay redirect to allow toast to display
      dispatch(setUser(res.data.user));
    } catch (err) {
      // console.log(err)
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  
const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Step 2: Send Google user data to backend
    const res = await axios.post("http://localhost:8000/api/auth/google-login", {
      name: user.displayName,
      email: user.email,
      avatar: user.photoURL,
    }, { withCredentials: true });

    dispatch(setUser(res.data.user));
    toast.success("Login with Google successful");
    redirect("/");
  } catch (err) {
    console.error(err);
    toast.error("Google login failed");
  }
};
  return (
    <div className="flex min-h-screen">
      <ToastContainer />
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">
            KUKU <span className="text-purple-600">JEWELS</span>
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-4"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center">Log In</h2>

          <input
            type="email"
            placeholder="Email Address"
            {...register("email", { required: "Email is required" })}
            className="w-full px-4 py-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
            />
            <div
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          <div className="text-right text-sm text-purple-600 cursor-pointer hover:underline">
            Forgot Password?
          </div>

          <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition">
            Log In
          </button>
          <button
  onClick={handleGoogleLogin}
  className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
>
  Continue with Google
</button>


          <div className="text-center text-sm mt-2">
            Don't have an account?{" "}
            <a href="/signup" className="text-purple-600 cursor-pointer">
              Sign up
            </a>
          </div>
        </form>
      </div>

      <div className="hidden md:block w-1/2">
        <img
          src={Bracelet}
          alt="Jewelry"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
