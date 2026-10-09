import { Link, useNavigate } from "react-router-dom";
import {
  Utensils,
  Menu as MenuIcon,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Dashboard route according to logged-in user's role
  const dashboardPath =
    user?.role === "admin"
      ? "/admin/dashboard"
      : "/customer/dashboard";

  const dashboardLabel =
    user?.role === "admin" ? "Admin Dashboard" : "My Dashboard";

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    toast.success("Logged out successfully!");
    navigate("/", { replace: true });
  };

  const closeMobileMenu = () => setIsOpen(false);

  const navLinkClass =
    "text-sm font-medium text-gray-700 transition hover:text-black";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-white">
            <Utensils size={20} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Food<span className="text-gray-500">House</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-400">
              Restaurant
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className={navLinkClass}>
            Home
          </Link>

          <Link to="/menu" className={navLinkClass}>
            Menu
          </Link>

          <Link to="/about" className={navLinkClass}>
            About
          </Link>

          <Link to="/contact" className={navLinkClass}>
            Contact
          </Link>

          {isAuthenticated && (
            <Link
              to={dashboardPath}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-black"
            >
              <LayoutDashboard size={17} />
              {dashboardLabel}
            </Link>
          )}
        </nav>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
        >
          {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-gray-200 bg-white px-6 py-5 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link to="/" onClick={closeMobileMenu} className={navLinkClass}>
              Home
            </Link>

            <Link
              to="/menu"
              onClick={closeMobileMenu}
              className={navLinkClass}
            >
              Menu
            </Link>

            <Link
              to="/about"
              onClick={closeMobileMenu}
              className={navLinkClass}
            >
              About
            </Link>

            <Link
              to="/contact"
              onClick={closeMobileMenu}
              className={navLinkClass}
            >
              Contact
            </Link>

            {isAuthenticated ? (
              <>  
                <Link
                  to={dashboardPath}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-2 ${navLinkClass}`}
                >
                  <LayoutDashboard size={17} />
                  {dashboardLabel}
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="mt-2 rounded-lg bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white transition hover:bg-gray-700"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;

