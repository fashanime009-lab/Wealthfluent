import { Link } from "react-router-dom";
import {
  Bot,
  MessageCircle,
  Globe2,
  Users,
  Share2,
  Mail,
} from "lucide-react";
import { useState } from "react";

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
    <footer className="bg-[#061225] px-6 py-8 text-white">
      <div className="mx-auto grid max-w-[1518px] gap-8 md:grid-cols-[280px_1fr_1fr_300px]">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-500">
              <Bot size={21} />
            </div>

            <div>
              <div className="text-2xl font-black leading-none">
                FinAI
              </div>

              <div className="mt-1 text-xs text-slate-400">
                AI-Powered Financial Intelligence
              </div>
            </div>
          </Link>

          <p className="mt-8 text-sm">
            © 2026 FinAI.
          </p>

          <p className="mt-3 text-sm">
            All rights reserved.
          </p>

          <div className="mt-7 flex gap-4">
            <MessageCircle size={22} />
            <Globe2 size={22} />
            <Users size={22} />
            <Share2 size={22} />
          </div>
        </div>

        <div>
          <h4 className="font-bold">
            Trending Topics
          </h4>

          <Link to="/news" className="mt-3 block text-sm text-slate-300">
            Live Finance News
          </Link>

          <Link to="/blogs" className="mt-3 block text-sm text-slate-300">
            Investing Blogs
          </Link>

          <Link to="/quizzes" className="mt-3 block text-sm text-slate-300">
            FinQuiz
          </Link>

         

          <Link
            to="/fire-calculator"
            className="mt-3 block text-sm text-slate-300"
          >
            FIRE Planning
          </Link>
        </div>

        <div>
          <h4 className="font-bold">
            About Us
          </h4>

<Link to="/about" className="mt-3 block text-sm text-slate-300">
            Why FINAIW
          </Link>
          <Link to="/disclaimer" className="mt-3 block text-sm text-slate-300">
            Data Disclaimer
          </Link>

          <Link to="/help" className="mt-3 block text-sm text-slate-300">
            Help
          </Link>

          <Link to="/feedback" className="mt-3 block text-sm text-slate-300">
            Feedback
          </Link>

          <Link to="/sitemap" className="mt-3 block text-sm text-slate-300">
            Sitemap
          </Link>

          

          <Link
            to="/privacy-policy"
            className="mt-3 block text-sm text-slate-300"
          >
            Privacy Policy
          </Link>

          <Link
            to="/contact"
            className="mt-3 block text-sm text-slate-300"
          >
            Contact Us
          </Link>
        </div>

        <div>
          <form
            onSubmit={subscribe}
            className="rounded-md bg-white/5 p-5 ring-1 ring-white/10"
          >
            <h4 className="font-bold">
              Subscribe to Newsletter
            </h4>

            <p className="mt-2 text-sm text-slate-300">
              {subscribed
                ? "You're subscribed. We'll keep you posted."
                : "Get the latest financial news and insights in your inbox."}
            </p>

            <label className="mt-5 flex h-12 items-center rounded-md bg-white/5 px-4 text-sm text-slate-400 ring-1 ring-white/10">
              <Mail size={16} />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ml-3 h-full min-w-0 flex-1 bg-transparent text-white outline-none"
                placeholder="Enter your email"
              />
            </label>

            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-blue-500 py-3 text-sm font-bold"
            >
              Subscribe
            </button>
          </form>

          <Link
            to="/privacy-policy"
            className="mt-5 block w-full rounded-md border border-white/20 py-3 text-center text-sm font-semibold text-slate-200"
          >
            Privacy Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}