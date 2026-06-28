import { Link } from "react-router-dom";
import {
  MessageCircle,
  Globe2,
  Users,
  Share2,
  Mail,
} from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo.webp"; // Replace with your actual logo path

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;

    const subscribers = JSON.parse(
      localStorage.getItem("finaiSubscribers") || "[]"
    );
    localStorage.setItem(
      "finaiSubscribers",
      JSON.stringify([...new Set([...subscribers, email])])
    );

    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-[#061225] px-4 sm:px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Grid – stacks on mobile, 2 cols on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">

          {/* Brand Column – with logo, brand name, tagline (navbar style) */}
          <div>
            {/* Brand block – replicates navbar styling */}
            <Link
              to="/"
              className="flex items-center gap-2 flex-shrink-0"
            >
              <img
                src={logo}
                alt="FINAIW"
                className="h-11 lg:h-12 w-auto object-contain"
              />

              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-[18px] lg:text-[20px] font-extrabold tracking-tight text-white">
                  FINAIW
                </span>
                <span className="text-[10px] font-medium text-slate-400 leading-tight">
                  FINANCIAL INTELLIGENCE WITH AI FOR WEALTH
                </span>
              </div>
            </Link>

            {/* Tagline for mobile – shown only on small screens */}
            <div className="sm:hidden mt-1">
              <span className="text-[20px] font-medium text-white">
                FINAIW
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-400">
              © 2026 FINAIW. All rights reserved.
            </p>

            <div className="mt-6 flex gap-4">
              <MessageCircle size={22} className="text-slate-400 hover:text-blue-400 transition cursor-pointer" />
              <Globe2 size={22} className="text-slate-400 hover:text-blue-400 transition cursor-pointer" />
              <Users size={22} className="text-slate-400 hover:text-blue-400 transition cursor-pointer" />
              <Share2 size={22} className="text-slate-400 hover:text-blue-400 transition cursor-pointer" />
            </div>
          </div>

          {/* Trending Topics */}
          <div>
            <h4 className="font-bold text-white">Trending Finance Topics</h4>
            <ul className="mt-3 space-y-3">
              <li><Link to="/news" className="text-sm text-slate-300 hover:text-blue-400 transition">Financial News</Link></li>
              <li><Link to="/blogs" className="text-sm text-slate-300 hover:text-blue-400 transition">Investing Blogs</Link></li>
              <li><Link to="/quizzes" className="text-sm text-slate-300 hover:text-blue-400 transition">FinQuiz</Link></li>
              <li><Link to="/fire-calculator" className="text-sm text-slate-300 hover:text-blue-400 transition">FIRE Planning</Link></li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h4 className="font-bold text-white">About Us</h4>
            <ul className="mt-3 space-y-3">
              <li><Link to="/about" className="text-sm text-slate-300 hover:text-blue-400 transition">Why FINAIW</Link></li>
              <li><Link to="/disclaimer" className="text-sm text-slate-300 hover:text-blue-400 transition">Data Disclaimer</Link></li>
              <li><Link to="/help" className="text-sm text-slate-300 hover:text-blue-400 transition">Help</Link></li>
              <li><Link to="/feedback" className="text-sm text-slate-300 hover:text-blue-400 transition">Feedback</Link></li>
              <li><Link to="/sitemap" className="text-sm text-slate-300 hover:text-blue-400 transition">Sitemap</Link></li>
              <li><Link to="/privacy-policy" className="text-sm text-slate-300 hover:text-blue-400 transition">Privacy Policy</Link></li>
              <li><Link to="/contact" className="text-sm text-slate-300 hover:text-blue-400 transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter & Privacy Dashboard */}
          <div>
            <form
              onSubmit={subscribe}
              className="rounded-md bg-white/5 p-5 ring-1 ring-white/10"
            >
              <h4 className="font-bold text-white">Subscribe to Newsletter</h4>
              <p className="mt-2 text-sm text-slate-300">
                {subscribed
                  ? "You're subscribed. We'll keep you posted."
                  : "Get the latest financial news and insights in your inbox."}
              </p>

              <div className="mt-5 flex h-12 items-center rounded-md bg-white/5 px-4 text-sm text-slate-400 ring-1 ring-white/10">
                <Mail size={16} className="flex-shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ml-3 h-full min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-slate-500"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                className="mt-4 w-full rounded-md bg-blue-500 py-3 text-sm font-bold text-white hover:bg-blue-600 transition"
              >
                Subscribe
              </button>
            </form>

            <Link
              to="/privacy-policy"
              className="mt-5 block w-full rounded-md border border-white/20 py-3 text-center text-sm font-semibold text-slate-200 hover:bg-white/5 transition"
            >
              Privacy Dashboard
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}