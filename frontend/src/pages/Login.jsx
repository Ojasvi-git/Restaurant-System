
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const email = formData.email.trim();

    if (!email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password: formData.password,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid login response from server.");
      }

      const allowedRoles = [
        "customer",
        "waiter",
        "chef",
        "admin",
      ];

      if (!allowedRoles.includes(user.role)) {
        toast.error(
          "Your account role is invalid. Please contact admin."
        );
        return;
      }

      // Save user and token using AuthContext
      login(user, token);

      toast.success("Login successful!");

      // Redirect according to the user's role
      const dashboardRoutes = {
        customer: "/customer/dashboard",
        waiter: "/waiter/dashboard",
        chef: "/chef/dashboard",
        admin: "/admin/dashboard",
      };

      navigate(dashboardRoutes[user.role], {
        replace: true,
      });
    } catch (error) {
      console.error("Login error:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome Back
            </h1>

            <p className="mt-2 text-gray-500">
              Login to your account
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email
              </label>

              <input
                id="login-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                required
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100 disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <LoaderCircle
                    size={20}
                    className="animate-spin"
                  />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-gray-900 hover:underline"
            >
              Create Account
            </Link>
          </p>

          {/* Home link */}
          <Link
            to="/"
            className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;