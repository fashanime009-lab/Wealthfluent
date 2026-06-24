import { Link } from "react-router-dom";
import { Bot } from "lucide-react";
import GoogleTranslate from "./GoogleTranslate";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#061225] text-white shadow-sm">
      <div className="mx-auto flex h-[70px] max-w-[1518px] items-center justify-between px-6">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-500 shadow-[inset_0_0_0_4px_rgba(255,255,255,.14)]">
            <Bot size={22} />
          </div>

          <div>
            <div className="text-2xl font-black leading-none tracking-tight">
              FinAI
            </div>

            <div className="mt-1 text-xs text-slate-300">
              AI-Powered Financial Intelligence
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-12 text-sm font-medium text-slate-100 lg:flex">
          <Link to="/calculators" className="hover:text-blue-300 transition">
            Calculators
          </Link>

          <Link to="/tools" className="hover:text-blue-300 transition">
            Tools
          </Link>

          <Link to="/quizzes" className="hover:text-blue-300 transition">
            FinQuiz
          </Link>

          <Link to="/blogs" className="hover:text-blue-300 transition">
            Blogs
          </Link>

          <Link to="/news" className="hover:text-blue-300 transition">
            News
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          
          <div className="hidden md:flex items-center">
  <GoogleTranslate />
</div>

          <Link
            to="/wealth-dashboard"
            className="hidden rounded-md border border-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:border-blue-400 sm:block"
          >
            Login
          </Link>

          <Link
            to="/sip-calculator"
            className="rounded-md bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,.35)] transition hover:bg-blue-600"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}