import { Link } from "react-router-dom";
import { Utensils, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
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
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 transition hover:text-black"
          >
            Home
          </Link>

          <Link
            to="/menu"
            className="text-sm font-medium text-gray-700 transition hover:text-black"
          >
            Menu
          </Link>

          <Link
            to="/about"
            className="text-sm font-medium text-gray-700 transition hover:text-black"
          >
            About
          </Link>

          <Link
            to="/contact"
            className="text-sm font-medium text-gray-700 transition hover:text-black"
          >
            Contact
          </Link>
        </nav>

        {/* Login */}
        <Link
          to="/login"
          className="hidden rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 md:block"
        >
          Login
        </Link>

        {/* Mobile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
        >
          {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-gray-200 bg-white px-6 py-5 md:hidden">
          <nav className="flex flex-col gap-4">

            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-gray-700"
            >
              Home
            </Link>

            <Link
              to="/menu"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-gray-700"
            >
              Menu
            </Link>

            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-gray-700"
            >
              About
            </Link>

            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-gray-700"
            >
              Contact
            </Link>

            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-lg bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white"
            >
              Login
            </Link>

          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;