import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";
import { CheckCircle2, Lightbulb, Bug, Sparkles, FileText } from "lucide-react";

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

const fieldClass =
  "w-full border border-[#111814]/15 bg-transparent px-4 py-3 text-[13.5px] text-[#111814] outline-none transition focus:border-[#047857] dark:border-[#eef1ec]/15 dark:text-[#eef1ec] dark:focus:border-[#34d399]";
const labelClass = "mb-1.5 block text-[13px] font-medium text-[#111814]/70 dark:text-[#eef1ec]/70";

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

      // The backend (api/feedback.js) always replies with a clean, safe
      // `message` — this is the one error text meant for display. Anything
      // that throws before we get here (no network, a non-JSON response)
      // is a raw browser/JS error, not something to show verbatim.
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to send feedback.");
        return;
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
    } catch {
      alert("Something went wrong. Please try again.");
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

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-[640px] px-5 py-16 sm:px-8 lg:px-12">
          <span className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Feedback</span>
          <h1 className="font-display mt-2 text-[34px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[42px]">
            We'd love to hear from you
          </h1>
          <p className="mt-4 max-w-[52ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
            Your feedback helps us improve FINAIW — making it more useful, intuitive, and valuable
            for everyone.
          </p>

          {/* Why Feedback Matters */}
          <div className="mt-10 border-t border-[#111814]/10 pt-8 dark:border-[#eef1ec]/10">
            <h2 className="font-display text-[18px] font-bold text-[#111814] dark:text-[#eef1ec]">Why your voice matters</h2>
            <p className="mt-3 text-[13.5px] leading-6 text-[#111814]/65 dark:text-[#eef1ec]/65">
              Every piece of feedback — big or small — helps us understand what's working, what's
              confusing, and what we can do better. Whether you love a feature, found a bug, or have
              an idea for improvement, we want to hear it all.
            </p>
            <ul className="mt-4 space-y-2">
              {voicePoints.map((point) => (
                <li key={point} className="flex items-center gap-2.5 text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">
                  <CheckCircle2 size={15} className="flex-shrink-0 text-[#047857] dark:text-[#34d399]" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Feedback Form */}
          <form onSubmit={handleSubmit} className="mt-10 space-y-6 border-t border-[#111814]/10 pt-8 dark:border-[#eef1ec]/10">
            <div>
              <label htmlFor="name" className={labelClass}>
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={fieldClass}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={fieldClass}
                placeholder="you@example.com"
              />
              <p className="mt-1.5 text-[12px] text-[#111814]/60 dark:text-[#eef1ec]/50">
                Optional — we'll only use this to respond to your feedback.
              </p>
            </div>

            {/* Rating */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-[#111814]/70 dark:text-[#eef1ec]/70">
                How would you rate your experience?
              </label>
              <div className="flex flex-wrap gap-2">
                {["1", "2", "3", "4", "5"].map((value) => (
                  <label
                    key={value}
                    className={`flex cursor-pointer items-center gap-1.5 border px-4 py-2.5 text-[13px] font-semibold transition ${
                      formData.rating === value
                        ? "border-[#111814] bg-[#111814] text-[#eef1ec] dark:border-[#eef1ec] dark:bg-[#eef1ec] dark:text-[#111814]"
                        : "border-[#111814]/15 text-[#111814]/65 hover:border-[#111814]/30 dark:border-[#eef1ec]/15 dark:text-[#eef1ec]/65 dark:hover:border-[#eef1ec]/30"
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
                    {value}★
                  </label>
                ))}
              </div>
              <p className="mt-1.5 text-[12px] text-[#111814]/60 dark:text-[#eef1ec]/50">{ratingLabels[formData.rating]}</p>
            </div>

            {/* Feedback Type */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-[#111814]/70 dark:text-[#eef1ec]/70">
                What type of feedback is this?
              </label>
              <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
                {feedbackTypes.map((type) => {
                  const Icon = type.icon;
                  const active = formData.feedbackType === type.value;
                  return (
                    <label
                      key={type.value}
                      className={`flex cursor-pointer items-center justify-center gap-1.5 border px-3 py-2.5 text-[12.5px] font-semibold transition ${
                        active
                          ? "border-[#111814] bg-[#111814] text-[#eef1ec] dark:border-[#eef1ec] dark:bg-[#eef1ec] dark:text-[#111814]"
                          : "border-[#111814]/15 text-[#111814]/65 hover:border-[#111814]/30 dark:border-[#eef1ec]/15 dark:text-[#eef1ec]/65 dark:hover:border-[#eef1ec]/30"
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
              <label htmlFor="message" className={labelClass}>
                Your Feedback
              </label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleInputChange}
                required
                className={`${fieldClass} resize-y`}
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
                className="h-4 w-4 border-[#111814]/25 text-[#047857] focus:ring-[#047857] dark:border-[#eef1ec]/25"
              />
              <span className="text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">
                I'd like to receive updates about FINAIW (occasional, no spam)
              </span>
            </label>

            <button
              type="submit"
              className="w-full bg-[#047857] py-3.5 text-[14px] font-semibold text-white transition hover:bg-[#065f46]"
            >
              Share Your Feedback
            </button>

            {formSubmitted && (
              <div className="flex items-center justify-center gap-2 border border-[#047857]/25 bg-[#047857]/10 py-3 text-[13px] font-medium text-[#047857] dark:border-[#34d399]/25 dark:bg-[#34d399]/10 dark:text-[#34d399]">
                <CheckCircle2 size={16} />
                Thank you for your feedback! We truly appreciate it.
              </div>
            )}
          </form>

          {/* Thank You Note */}
          <p className="mt-10 border-t border-[#111814]/10 pt-8 text-[13.5px] leading-6 text-[#111814]/65 dark:border-[#eef1ec]/10 dark:text-[#eef1ec]/65">
            Every piece of feedback is read by our team. We're grateful you're helping us build a
            better FINAIW.
          </p>

          {/* Disclaimer */}
          <p className="mt-6 border-t border-[#111814]/10 pt-4 text-[12px] leading-5 text-[#111814]/60 dark:border-[#eef1ec]/10 dark:text-[#eef1ec]/50">
            <span className="font-semibold text-[#111814]/70 dark:text-[#eef1ec]/70">Privacy Note:</span> Your feedback is
            confidential and will only be used to improve our services. We do not share or sell your
            information. See our{" "}
            <Link to="/privacy-policy" className="font-semibold text-[#047857] hover:underline dark:text-[#34d399]">
              Privacy Policy
            </Link>{" "}
            for more details.
          </p>
        </div>
      </div>
    </>
  );
}
