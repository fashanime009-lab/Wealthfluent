import { useState } from "react";
import { Helmet } from "react-helmet";


export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  setIsSubmitting(true);

  try {
    const response = await fetch("/api/contact", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
      setFormSubmitted(true);

      setFormData({
        name: "",
        email: "",
        message: "",
      });

      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
    } else {
      alert("Failed to send message.");
    }
  } catch (err) {
    console.error(err);

    alert("Something went wrong.");
  }

  setIsSubmitting(false);
};

  return (
    <>
      <Helmet>
        <title>Contact Us – FINAIW</title>
        <meta
          name="description"
          content="Get in touch with FINAIW. We're here to help with your financial questions. Based in Mumbai, India."
        />
        <meta
          name="keywords"
          content="contact FINAIW, support, feedback, financial intelligence"
        />
      </Helmet>

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
       

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                Get in Touch
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                We're Here to Help
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto">
                Have a question or feedback? Reach out to us — we'd love to hear from you.
              </p>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-y"
                  placeholder="What would you like to tell us?"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-xl shadow-sm shadow-blue-200/50 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {formSubmitted && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-700 text-sm text-center">
                  Thank you! We've received your message and will respond within 24 hours.
                </div>
              )}
            </form>

            {/* Simple contact info */}
            <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-center items-center gap-6 text-center">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                  Email Us
                </p>
                <a
                  href="mailto:support@finaiw.com"
                  className="text-blue-600 hover:underline font-medium text-lg"
                >
                  support@finaiw.com
                </a>
              </div>
              <div className="hidden sm:block w-px h-10 bg-slate-200" />
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                  Location
                </p>
                <p className="text-slate-700 font-medium text-lg">Mumbai, India</p>
              </div>
            </div>

            <p className="mt-6 text-sm text-slate-400 text-center">
              We'll reply to you personally. We're here to help.
            </p>
          </div>
        </section>

        
      </div>
    </>
  );
}