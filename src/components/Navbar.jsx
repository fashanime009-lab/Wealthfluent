import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import GoogleTranslate from "./GoogleTranslate";
import logo from "../assets/logo.webp";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0b1628] border-b border-blue-500/10 shadow-lg shadow-blue-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[64px]">

          {/* Logo - now brand name is visible on all screens */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0"
            onClick={closeMenu}
          >
            <img
              src={logo}
              alt="FINAIW"
              className="h-11 lg:h-12 w-auto object-contain"
            />

            <div className="flex flex-col leading-none">
              <span className="text-[16px] sm:text-[18px] lg:text-[20px] font-extrabold tracking-tight text-white">
                FINAIW
              </span>
              {/* You can uncomment the tagline if needed */}
              {/* <span className="text-[9px] sm:text-[10px] text-slate-400 hidden sm:block">Financial Intelligence</span> */}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/calculators" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition">
              Calculators
            </Link>
            <Link to="/tools" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition">
              Tools
            </Link>
            <Link to="/quizzes" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition">
              FinQuiz
            </Link>
            <Link to="/blogs" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition">
              Blogs
            </Link>
            <Link to="/news" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition">
              News
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center">
              <GoogleTranslate />
            </div>

          

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-white/5 transition"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 py-4" : "max-h-0 py-0"
          }`}
        >
          <div className="space-y-2 border-t border-blue-500/10 pt-4">
            <Link
              to="/calculators"
              className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 rounded-lg transition"
              onClick={closeMenu}
            >
              Calculators
            </Link>
            <Link
              to="/tools"
              className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 rounded-lg transition"
              onClick={closeMenu}
            >
              Tools
            </Link>
            <Link
              to="/quizzes"
              className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 rounded-lg transition"
              onClick={closeMenu}
            >
              FinQuiz
            </Link>
            <Link
              to="/blogs"
              className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 rounded-lg transition"
              onClick={closeMenu}
            >
              Blogs
            </Link>
            <Link
              to="/news"
              className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 rounded-lg transition"
              onClick={closeMenu}
            >
              News
            </Link>
            <div className="pt-2 border-t border-blue-500/10 flex flex-col gap-2">
              <Link
                to="/sip-calculator"
                className="block px-3 py-2 text-sm font-medium text-center text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition"
                onClick={closeMenu}
              >
                Get Started
              </Link>
            </div>
            <div className="pt-2 border-t border-blue-500/10">
              <GoogleTranslate />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}