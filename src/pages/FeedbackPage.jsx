import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";
import {
  MessageSquareHeart,
  CheckCircle2,
  Star,
  Lightbulb,
  Bug,
  Sparkles,
  FileText,
} from "lucide-react";

const voicePoints = [
  "Share your experience using FINAIW",
  "Suggest new features or calculators",
  "Report any issues or bugs you encounter",
  "Tell us how we can make FINAIW better for you",
];

const feedbackTypes = [
  { value: "suggestion", label: "Suggestion", icon: Lightbulb },
  { value: "bug", label: "Bug Report", icon: Bug },
  { value: "feature", label: "Feature Request", icon: Sparkles },
  { value: "other", label: "Other", icon: FileText },
];

const ratingLabels = {
  "1": "Very dissatisfied",
  "2": "Dissatisfied",
  "3": "Neutral",
  "4": "Satisfied",
  "5": "Very satisfied",
};

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "5",
    feedbackType: "suggestion",
    message: "",
    subscribe: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setFormSubmitted(true);
      setFormData({
        name: "",
        email: "",
        rating: "5",
        feedbackType: "suggestion",
        message: "",
        subscribe: false,
      });

      setTimeout(() => {
        setFormSubmitted(false);
      }, 4000);
    } catch (err) {
      alert(err.message || "Unable to send feedback.");
    }
  };

  return (
    <>
      <Seo
        title="Share Your Feedback – FINAIW"
        description="We value your feedback! Share your thoughts, suggestions, and experiences with FINAIW to help us improve."
        path="/feedback"
        keywords="feedback, suggestions, FINAIW, user experience, improve"
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Share Your Feedback", path: "/feedback" },
        ])}
      />

      <div className="min-h-screen bg-[#fbfdfc]">
        <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8 lg:px-12">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 sm:p-12">
            {/* Header */}
            <div className="mb-10 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-[12px] font-black text-emerald-800 ring-1 ring-emerald-100">
                <MessageSquareHeart size={13} /> FINAIW Feedback
              </span>
              <h1 className="mx-auto mt-5 max-w-lg text-[32px] font-black leading-[1.12] tracking-[-0.03em] text-slate-950 sm:text-[40px]">
                We'd love to hear from you
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-[15px] font-medium leading-7 text-slate-500">
                Your feedback helps us improve FINAIW — making it more useful, intuitive, and
                valuable for everyone.
              </p>
            </div>

            {/* Why Feedback Matters */}
            <div className="mb-10 rounded-[24px] border border-emerald-100 bg-emerald-50/50 p-7">
              <h2 className="text-[18px] font-black text-slate-950">Why your voice matters</h2>
              <p className="mt-3 text-[13.5px] leading-6 text-slate-600">
                Every piece of feedback — big or small — helps us understand what's working, what's
                confusing, and what we can do better. Whether you love a feature, found a bug, or
                have an idea for improvement, we want to hear it all.
              </p>
              <ul className="mt-4 space-y-2">
                {voicePoints.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-[13.5px] text-slate-600">
                    <CheckCircle2 size={15} className="flex-shrink-0 text-emerald-600" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Feedback Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-[13px] font-bold text-slate-700">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13.5px] outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-[13px] font-bold text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13.5px] outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  placeholder="you@example.com"
                />
                <p className="mt-1.5 text-[12px] text-slate-400">
                  Optional — we'll only use this to respond to your feedback.
                </p>
              </div>

              {/* Rating */}
              <div>
                <label className="mb-2 block text-[13px] font-bold text-slate-700">
                  How would you rate your experience?
                </label>
                <div className="flex flex-wrap gap-2">
                  {["1", "2", "3", "4", "5"].map((value) => (
                    <label
                      key={value}
                      className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2.5 text-[13px] font-bold transition ${
                        formData.rating === value
                          ? "bg-emerald-800 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={value}
                        checked={formData.rating === value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      {value}
                      <Star size={13} className={formData.rating === value ? "fill-white" : "fill-slate-400 text-slate-400"} />
                    </label>
                  ))}
                </div>
                <p className="mt-1.5 text-[12px] text-slate-400">{ratingLabels[formData.rating]}</p>
              </div>

              {/* Feedback Type */}
              <div>
                <label className="mb-2 block text-[13px] font-bold text-slate-700">
                  What type of feedback is this?
                </label>
                <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
                  {feedbackTypes.map((type) => {
                    const Icon = type.icon;
                    const active = formData.feedbackType === type.value;
                    return (
                      <label
                        key={type.value}
                        className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[12.5px] font-bold transition ${
                          active ? "bg-emerald-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="feedbackType"
                          value={type.value}
                          checked={active}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <Icon size={14} />
                        {type.label}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-[13px] font-bold text-slate-700">
                  Your Feedback
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13.5px] outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  placeholder="Tell us what's on your mind... What do you like? What could be better? Do you have any ideas for new features?"
                />
              </div>

              <label htmlFor="subscribe" className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  id="subscribe"
                  name="subscribe"
                  checked={formData.subscribe}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
                />
                <span className="text-[13.5px] text-slate-600">
                  I'd like to receive updates about FINAIW (occasional, no spam)
                </span>
              </label>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-800 py-3.5 text-[14px] font-black text-white shadow-[0_14px_30px_rgba(4,120,87,.22)] transition hover:-translate-y-0.5 hover:bg-emerald-900"
              >
                Share Your Feedback
              </button>

              {formSubmitted && (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 py-3 text-[13px] font-semibold text-emerald-700">
                  <CheckCircle2 size={16} />
                  Thank you for your feedback! We truly appreciate it.
                </div>
              )}
            </form>

            {/* Thank You Note */}
            <div className="mt-10 border-t border-slate-100 pt-8 text-center">
              <p className="text-[13.5px] leading-6 text-slate-500">
                Every piece of feedback is read by our team. We're grateful you're helping us build
                a better FINAIW.
              </p>
            </div>

            {/* Disclaimer */}
            <p className="mt-6 border-t border-slate-100 pt-4 text-[12px] leading-5 text-slate-400">
              <span className="font-bold text-slate-500">Privacy Note:</span> Your feedback is
              confidential and will only be used to improve our services. We do not share or sell
              your information. See our{" "}
              <Link to="/privacy-policy" className="font-semibold text-emerald-700 hover:underline">
                Privacy Policy
              </Link>{" "}
              for more details.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
