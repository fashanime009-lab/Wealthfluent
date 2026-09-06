import { useState } from "react";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";
import { Mail, MapPin, MessageCircle, CheckCircle2 } from "lucide-react";

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
      <Seo
        title="Contact Us – FINAIW"
        description="Get in touch with FINAIW. We're here to help with your financial questions. Based in Mumbai, India."
        path="/contact"
        keywords="contact FINAIW, support, feedback, financial intelligence"
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact Us", path: "/contact" },
        ])}
      />

      <div className="min-h-screen bg-[#fbfdfc]">
        <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8 lg:px-12">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 sm:p-12">
            {/* Header */}
            <div className="mb-10 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-[12px] font-black text-emerald-800 ring-1 ring-emerald-100">
                <MessageCircle size={13} /> Get in Touch
              </span>
              <h1 className="mx-auto mt-5 max-w-xl text-[34px] font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-[42px]">
                We're here to help
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-[15px] font-medium leading-7 text-slate-500">
                Have a question or feedback? Reach out to us — we'd love to hear from you.
              </p>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-5">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-[13px] font-bold text-slate-700">
                  Your Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13.5px] outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  placeholder="Enter your name"
                  maxLength={100}
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-[13px] font-bold text-slate-700">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13.5px] outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  placeholder="you@example.com"
                  maxLength={100}
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-[13px] font-bold text-slate-700">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13.5px] outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  placeholder="What would you like to tell us?"
                  maxLength={2000}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-emerald-800 py-3.5 text-[14px] font-black text-white shadow-[0_14px_30px_rgba(4,120,87,.22)] transition hover:-translate-y-0.5 hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {formSubmitted && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-[13px] font-semibold text-emerald-700">
                  <CheckCircle2 size={16} className="flex-shrink-0" />
                  Thank you! We've received your message and will respond within 24 hours.
                </div>
              )}
            </form>

            {/* Simple contact info */}
            <div className="mt-12 flex flex-col items-center justify-center gap-8 border-t border-slate-100 pt-8 text-center sm:flex-row">
              <div>
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  <Mail size={17} />
                </div>
                <p className="mt-2.5 text-[11px] font-black uppercase tracking-wide text-slate-400">Email Us</p>
                <a
                  href="mailto:finaiw.organisation@gmail.com"
                  className="text-[15px] font-bold text-emerald-700 hover:underline"
                >
                  finaiw.organisation@gmail.com
                </a>
              </div>
              <div className="hidden h-12 w-px bg-slate-200 sm:block" />
              <div>
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  <MapPin size={17} />
                </div>
                <p className="mt-2.5 text-[11px] font-black uppercase tracking-wide text-slate-400">Location</p>
                <p className="text-[15px] font-bold text-slate-800">Mumbai, India</p>
              </div>
            </div>

            <p className="mt-6 text-center text-[12.5px] text-slate-400">
              We'll reply to you personally. We're here to help.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
