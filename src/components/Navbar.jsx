import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  Globe2,
} from "lucide-react";
import GoogleTranslate from "./GoogleTranslate";
import logo from "../assets/logo.webp";
const navItems = [
  { label: "Home", to: "/" },
  { label: "Calculators", to: "/calculators" },
  { label: "Goals", to: "/goal-planner" },
  { label: "Workspace", to: "/WorkspacePage" },
  { label: "Learn", to: "/blogs" },
  { label: "Insights", to: "/news" },
  { label: "Tools", to: "/tools" },
];
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  return (
   <header className="sticky top-0 z-[60] border-b border-slate-200/70 bg-[#fbfdfc]/88 backdrop-blur-2xl">
      <div className="mx-auto max-w-[1720px] px-5 sm:px-8 lg:px-12">
        <div className="flex h-[82px] items-center">
          {/* Logo */}
<Link
  to="/"
  onClick={closeMenu}
 className="flex flex-shrink-0 items-center gap-2"
>
  <img
    src={logo}
    alt="FINAIW"
    className="h-9 w-9 object-contain"
  />
  <div className="leading-tight">
    <div className="text-[22px] font-black tracking-[-0.03em] text-slate-950">
      FINAIW
    </div>

    <div className="text-[11px] font-medium leading-[1.15] text-slate-600">
      Financial Intelligence
      <br />
      with AI for Wealth
    </div>
  </div>
</Link>
       {/* Desktop Navigation */}
<nav className="ml-20 hidden lg:flex items-center gap-8">
  {navItems.map((item) => (
    <NavLink
      key={item.label}
      to={item.to}
      end={item.to === "/"}
      className={({ isActive }) =>
        `relative text-[14px] font-black transition hover:text-emerald-800 ${
          isActive ? "text-emerald-800" : "text-slate-950"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {item.label}

          {isActive && (
            <span className="absolute -bottom-5 left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-full bg-emerald-700" />
          )}
        </>
      )}
    </NavLink>
  ))}
</nav>
         {/* Right Side */}
<div className="ml-auto flex items-center gap-2">
  {/* Search */}
  <button
    type="button"
    aria-label="Search"
    className="hidden lg:grid h-11 w-11 place-items-center rounded-full bg-white text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,.07)] ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,.12)]">
    <Search size={20} />
  </button>
  {/* Language */}
  <div className="hidden lg:flex items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-2 shadow-[0_12px_30px_rgba(15,23,42,.07)] ring-1 ring-slate-100">

    <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100">
      <Globe2 size={18} />
    </span>
   <div className="w-[145px] overflow-hidden">
      <GoogleTranslate />
    </div>
    <ChevronDown size={15} />
  </div>
  {/* Mobile Menu */}
  <button
    onClick={toggleMenu}
    className="lg:hidden grid h-11 w-11 place-items-center rounded-full bg-white shadow-[0_12px_30px_rgba(15,23,42,.07)] ring-1 ring-slate-100"
  >
    {isOpen ? <X size={22} /> : <Menu size={22} />}
  </button>
</div>
        </div>
        {/* Mobile Navigation */}
       {isOpen && (
  <div className="space-y-2 border-t border-slate-200 py-4 lg:hidden">
  {navItems.map((item) => (
    <NavLink
      key={item.label}
      to={item.to}
      end={item.to === "/"}
      onClick={closeMenu}
      className={({ isActive }) =>
        `block rounded-xl px-4 py-3 text-sm font-bold transition ${
          isActive
            ? "bg-emerald-50 text-emerald-800"
            : "text-slate-700 hover:bg-slate-100"
        }`
      }
    >
      {item.label}
    </NavLink>
  ))}
</div>
)}
      </div>
    </header>
  );
}