import { useState } from "react";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";
import { CheckCircle2 } from "lucide-react";

const fieldClass =
  "mt-2 w-full border border-[#111814]/15 bg-transparent px-3.5 py-2.5 text-[13.5px] text-[#111814] outline-none transition focus:border-[#047857] dark:border-[#eef1ec]/15 dark:text-[#eef1ec] dark:focus:border-[#34d399]";
const labelClass = "text-[13px] font-medium text-[#111814]/70 dark:text-[#eef1ec]/70";

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

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-[640px] px-5 py-16 sm:px-8 lg:px-12">
          <h1 className="font-display text-[34px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[42px]">
            We're here to help
          </h1>
          <p className="mt-4 max-w-[52ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
            Have a question or feedback? Reach out to us — we'd love to hear from you.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div>
              <label htmlFor="name" className={labelClass}>
                Your name <span className="text-[#b91c1c] dark:text-[#f87171]">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={fieldClass}
                placeholder="Enter your name"
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email address <span className="text-[#b91c1c] dark:text-[#f87171]">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={fieldClass}
                placeholder="you@example.com"
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="message" className={labelClass}>
                Message <span className="text-[#b91c1c] dark:text-[#f87171]">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleInputChange}
                required
                className={`${fieldClass} resize-y`}
                placeholder="What would you like to tell us?"
                maxLength={2000}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full border border-[#111814] bg-[#111814] py-3 text-[14px] font-semibold text-[#eef1ec] transition hover:bg-[#111814]/85 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#eef1ec] dark:bg-[#eef1ec] dark:text-[#111814] dark:hover:bg-[#eef1ec]/85"
            >
              {isSubmitting ? "Sending…" : "Send message"}
            </button>

            {formSubmitted && (
              <div className="flex items-center gap-2 border border-[#047857]/25 bg-[#047857]/5 px-4 py-3 text-[13px] font-medium text-[#047857] dark:border-[#34d399]/25 dark:bg-[#34d399]/5 dark:text-[#34d399]">
                <CheckCircle2 size={16} className="flex-shrink-0" />
                Thank you! We've received your message and will respond within 24 hours.
              </div>
            )}
          </form>

          <div className="mt-12 flex flex-col gap-6 border-t border-[#111814]/10 pt-8 dark:border-[#eef1ec]/10 sm:flex-row sm:justify-between">
            <div>
              <p className="text-[13px] font-semibold text-[#111814]/60 dark:text-[#eef1ec]/50">Email us</p>
              <a
                href="mailto:finaiw.organisation@gmail.com"
                className="text-[14.5px] font-semibold text-[#047857] hover:underline dark:text-[#34d399]"
              >
                finaiw.organisation@gmail.com
              </a>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#111814]/60 dark:text-[#eef1ec]/50">Location</p>
              <p className="text-[14.5px] font-semibold text-[#111814] dark:text-[#eef1ec]">Mumbai, India</p>
            </div>
          </div>

          <p className="mt-6 text-[12.5px] text-[#111814]/60 dark:text-[#eef1ec]/50">
            We'll reply to you personally. We're here to help.
          </p>
        </div>
      </div>
    </>
  );
}
