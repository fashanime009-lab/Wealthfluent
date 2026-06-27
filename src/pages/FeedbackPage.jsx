import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";


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

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    // In production, send the feedback to your backend or email
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: "",
        email: "",
        rating: "5",
        feedbackType: "suggestion",
        message: "",
        subscribe: false,
      });
    }, 3000);
  };

  return (
    <>
      <Helmet>
        <title>Share Your Feedback – FINAIW</title>
        <meta
          name="description"
          content="We value your feedback! Share your thoughts, suggestions, and experiences with FINAIW to help us improve."
        />
        <meta
          name="keywords"
          content="feedback, suggestions, FINAIW, user experience, improve"
        />
      </Helmet>

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
       

        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                FINAIW Feedback
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                We'd Love to Hear From You
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto">
                Your feedback helps us improve FINAIW — making it more useful,
                intuitive, and valuable for everyone.
              </p>
            </div>

            {/* Why Feedback Matters */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 p-6 mb-10">
              <h2 className="text-xl font-bold text-slate-800 mb-3">
                Why Your Voice Matters
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Every piece of feedback — big or small — helps us understand what's
                working, what's confusing, and what we can do better. Whether you love
                a feature, found a bug, or have an idea for improvement, we want to
                hear it all.
              </p>
              <ul className="mt-3 space-y-1 text-slate-600">
                <li className="flex items-center gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Share your experience using FINAIW</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Suggest new features or calculators</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Report any issues or bugs you encounter</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Tell us how we can make FINAIW better for you</span>
                </li>
              </ul>
            </div>

            {/* Feedback Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Optional — we'll only use this to respond to your feedback.
                </p>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  How would you rate your experience?
                </label>
                <div className="flex gap-2">
                  {["1", "2", "3", "4", "5"].map((value) => (
                    <label
                      key={value}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2 cursor-pointer transition ${
                        formData.rating === value
                          ? "bg-blue-600 text-white"
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
                      <span className="text-sm font-semibold">{value}</span>
                      <span className="text-sm">⭐</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {formData.rating === "1" && "Very dissatisfied"}
                  {formData.rating === "2" && "Dissatisfied"}
                  {formData.rating === "3" && "Neutral"}
                  {formData.rating === "4" && "Satisfied"}
                  {formData.rating === "5" && "Very satisfied"}
                </p>
              </div>

              {/* Feedback Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What type of feedback is this?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: "suggestion", label: "💡 Suggestion" },
                    { value: "bug", label: "🐛 Bug Report" },
                    { value: "feature", label: "✨ Feature Request" },
                    { value: "other", label: "📝 Other" },
                  ].map((type) => (
                    <label
                      key={type.value}
                      className={`flex items-center justify-center rounded-xl px-3 py-2 cursor-pointer transition ${
                        formData.feedbackType === type.value
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="feedbackType"
                        value={type.value}
                        checked={formData.feedbackType === type.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                  Your Feedback
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                  placeholder="Tell us what's on your mind... What do you like? What could be better? Do you have any ideas for new features?"
                />
              </div>

              {/* Subscribe */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="subscribe"
                  name="subscribe"
                  checked={formData.subscribe}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="subscribe" className="text-sm text-slate-600">
                  I'd like to receive updates about FINAIW (occasional, no spam)
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-xl shadow-sm shadow-blue-200/50 text-lg"
              >
                Share Your Feedback
              </button>

              {formSubmitted && (
                <p className="text-emerald-600 text-sm font-medium text-center py-2">
                  Thank you for your feedback! We truly appreciate it.
                </p>
              )}
            </form>

            {/* Thank You Note */}
            <div className="mt-10 border-t border-slate-200 pt-8 text-center">
              <p className="text-slate-500 text-sm leading-relaxed">
                Every piece of feedback is read by our team. We're grateful you're
                helping us build a better FINAIW.
              </p>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 text-xs text-slate-400 border-t border-slate-200 pt-4">
              <p>
                <span className="font-medium text-slate-500">Privacy Note:</span>{" "}
                Your feedback is confidential and will only be used to improve our
                services. We do not share or sell your information. See our{" "}
                <Link to="/privacy-policy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>{" "}
                for more details.
              </p>
            </div>
          </div>
        </section>

        
      </div>
    </>
  );
}