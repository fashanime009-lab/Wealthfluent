import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  Settings as SettingsIcon,
  Home as HomeIcon,
  BriefcaseBusiness,
  Calculator,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Target,
  ArrowRight,
} from "lucide-react";
import Logo from "./Logo";
import SearchModal from "./SearchModal";

const navItems = [
  { label: "Home", to: "/", icon: HomeIcon },
  { label: "Calculators", to: "/calculators", icon: Calculator },
  { label: "Verdict", to: "/verdict", icon: BriefcaseBusiness },
  { label: "Goals", to: "/goals", icon: ShieldCheck },
  { label: "Learn", to: "/learn", icon: BookOpen },
  { label: "Insights", to: "/insights", icon: Sparkles },
  { label: "Tools", to: "/tools", icon: Target },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleMenu = () => setIsOpen((v) => !v);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    // Standard Cmd/Ctrl+K shortcut to open search from anywhere on the site.
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header
      className={`sticky top-0 z-[80] border-b transition-all duration-300 ${
        scrolled
          ? "border-slate-200/80 bg-white/85 shadow-[0_8px_30px_rgba(15,23,42,.05)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/85"
          : "border-transparent bg-white/60 backdrop-blur-xl dark:bg-slate-950/60"
      }`}
    >
      <div className="mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-10">
        <div className="flex h-[76px] items-center">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex flex-shrink-0 items-center gap-2.5"
          >
            <Logo />
          </Link>

          {/* Desktop Navigation — single, unified pill rail */}
          <nav className="ml-auto mr-3 hidden items-center gap-0.5 rounded-full bg-slate-100/70 p-1 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `group flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-white text-emerald-800 shadow-[0_6px_16px_rgba(15,23,42,.08)] ring-1 ring-slate-200/70 dark:bg-slate-800 dark:text-emerald-400 dark:ring-white/10"
                        : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                    }`
                  }
                >
                  <Icon size={15} strokeWidth={2.3} className="opacity-70 group-hover:opacity-100" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            {/* Search */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="hidden h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white lg:grid"
            >
              <Search size={18} />
            </button>

            {/* Settings — currency, number format & theme all live in one place */}
            <Link
              to="/settings"
              aria-label="Settings"
              className="hidden h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white lg:grid"
            >
              <SettingsIcon size={18} />
            </Link>

            {/* Primary CTA */}
            <Link
              to="/verdict"
              className="hidden items-center gap-1.5 rounded-full bg-emerald-800 px-4 py-2.5 text-[13px] font-black text-white shadow-[0_10px_25px_rgba(4,120,87,.25)] transition hover:-translate-y-0.5 hover:bg-emerald-900 lg:inline-flex"
            >
              Get Your Verdict
              <ArrowRight size={14} />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-800 transition hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/15 lg:hidden"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`overflow-hidden border-t border-slate-100 bg-white transition-[max-height,opacity] duration-300 dark:border-white/10 dark:bg-slate-950 lg:hidden ${
          isOpen ? "max-h-[560px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="grid grid-cols-2 gap-2 px-5 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-2xl px-3.5 py-3 text-[13px] font-bold transition ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                  }`
                }
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            );
          })}
          <button
            type="button"
            onClick={() => {
              closeMenu();
              setSearchOpen(true);
            }}
            className="flex items-center gap-2.5 rounded-2xl bg-slate-50 px-3.5 py-3 text-[13px] font-bold text-slate-700 transition hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            <Search size={16} />
            Search
          </button>
          <Link
            to="/settings"
            onClick={closeMenu}
            className="flex items-center gap-2.5 rounded-2xl bg-slate-50 px-3.5 py-3 text-[13px] font-bold text-slate-700 transition hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            <SettingsIcon size={16} />
            Settings
          </Link>
        </div>
        <div className="px-5 pb-5">
          <Link
            to="/verdict"
            onClick={closeMenu}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-800 text-[13px] font-black text-white shadow-[0_10px_25px_rgba(4,120,87,.25)]"
          >
            Get Your Verdict <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      </header>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
