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

          {/* Logo */}
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
  <span
    className="
      bg-gradient-to-r
      from-white
      via-white
      via-40%
      to-sky-400
      bg-clip-text
      text-transparent
      text-[16px] sm:text-[18px] lg:text-[20px]
      font-black
      tracking-tight
      select-none
      drop-shadow-[0_1px_8px_rgba(59,130,246,0.15)]
    "
  >
    FINAIW
  </span>
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
            {/* Google Translate - always visible */}
            <div className="flex items-center">
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
            isOpen ? "max-h-[500px] py-4" : "max-h-0 py-0"
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

            {/* Google Translate in mobile menu */}
            <div className="pt-2 border-t border-blue-500/10">
              <GoogleTranslate />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}