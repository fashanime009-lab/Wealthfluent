import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Search, Settings as SettingsIcon } from "lucide-react";
import Logo from "./Logo";
import SearchModal from "./SearchModal";

const navItems = [
  { label: "Calculators", to: "/calculators" },
  { label: "Verdict", to: "/verdict" },
  { label: "Goals", to: "/goals" },
  { label: "Learn", to: "/learn" },
  { label: "Insights", to: "/insights" },
  { label: "Tools", to: "/tools" },
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
        className={`sticky top-0 z-[80] border-b transition-colors duration-200 ${
          scrolled
            ? "border-[#111814]/10 bg-[#eef1ec]/90 backdrop-blur-xl dark:border-[#eef1ec]/10 dark:bg-[#0b1210]/90"
            : "border-transparent bg-[#eef1ec] dark:bg-[#0b1210]"
        }`}
      >
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
          <div className="flex h-[72px] items-center">
            <Link to="/" onClick={closeMenu} className="flex flex-shrink-0 items-center gap-2.5">
              <Logo />
            </Link>

            <nav className="ml-10 hidden items-center gap-7 lg:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `text-[13.5px] font-semibold transition ${
                      isActive
                        ? "text-[#111814] dark:text-[#eef1ec]"
                        : "text-[#111814]/50 hover:text-[#111814] dark:text-[#eef1ec]/50 dark:hover:text-[#eef1ec]"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="hidden h-9 w-9 place-items-center text-[#111814]/55 transition hover:bg-[#111814]/6 hover:text-[#111814] dark:text-[#eef1ec]/55 dark:hover:bg-[#eef1ec]/10 dark:hover:text-[#eef1ec] lg:grid"
              >
                <Search size={17} />
              </button>

              <Link
                to="/settings"
                aria-label="Settings"
                className="hidden h-9 w-9 place-items-center text-[#111814]/55 transition hover:bg-[#111814]/6 hover:text-[#111814] dark:text-[#eef1ec]/55 dark:hover:bg-[#eef1ec]/10 dark:hover:text-[#eef1ec] lg:grid"
              >
                <SettingsIcon size={17} />
              </Link>

              <Link
                to="/verdict"
                className="ml-2 hidden h-10 items-center bg-[#047857] px-4 text-[13px] font-semibold text-white transition hover:bg-[#065f46] lg:inline-flex"
              >
                Get your verdict
              </Link>

              <button
                onClick={toggleMenu}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                className="ml-1 grid h-10 w-10 place-items-center text-[#111814] transition hover:bg-[#111814]/6 dark:text-[#eef1ec] dark:hover:bg-[#eef1ec]/10 lg:hidden"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        <div
          className={`overflow-hidden border-t border-[#111814]/10 bg-[#eef1ec] transition-[max-height,opacity] duration-300 dark:border-[#eef1ec]/10 dark:bg-[#0b1210] lg:hidden ${
            isOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col px-5 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `border-b border-[#111814]/8 py-3.5 text-[14px] font-semibold last:border-b-0 dark:border-[#eef1ec]/8 ${
                    isActive ? "text-[#047857] dark:text-[#34d399]" : "text-[#111814] dark:text-[#eef1ec]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => {
                closeMenu();
                setSearchOpen(true);
              }}
              className="border-b border-[#111814]/8 py-3.5 text-left text-[14px] font-semibold text-[#111814] dark:border-[#eef1ec]/8 dark:text-[#eef1ec]"
            >
              Search
            </button>
            <Link
              to="/settings"
              onClick={closeMenu}
              className="py-3.5 text-[14px] font-semibold text-[#111814] dark:text-[#eef1ec]"
            >
              Settings
            </Link>
          </div>
          <div className="px-5 pb-5">
            <Link
              to="/verdict"
              onClick={closeMenu}
              className="flex h-11 w-full items-center justify-center bg-[#047857] text-[13.5px] font-semibold text-white"
            >
              Get your verdict
            </Link>
          </div>
        </div>
      </header>
      {searchOpen && <SearchModal open onClose={() => setSearchOpen(false)} />}
    </>
  );
}
