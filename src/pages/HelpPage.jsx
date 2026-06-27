import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";


export default function HelpPage() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const faqs = [
    {
      question: "What is FINAIW?",
      answer:
        "FINAIW (Financial Intelligence with AI for Wealth) is a free platform that offers financial calculators, AI-powered insights, and educational content to help you make smarter money decisions.",
    },
    {
      question: "How do I use the calculators?",
      answer:
        "Simply select any calculator from the Calculators page, enter your numbers in the input fields, and the results will update instantly. You can adjust sliders or type in values directly.",
    },
    {
      question: "Is my data safe?",
      answer:
        "Absolutely. We do not store or share your personal information. All calculations are done on your device and are never transmitted to our servers. Please see our Privacy Policy for more details.",
    },
    {
      question: "What is the FinAI assistant?",
      answer:
        "The FinAI assistant is a friendly digital helper that can answer your financial questions in plain language. You can ask about investing, savings, taxes, or get live stock prices — all without leaving the page.",
    },
    {
      question: "Are the calculators accurate?",
      answer:
        "Our calculators use standard financial formulas and are designed to be as accurate as possible. However, they are for illustrative and educational purposes only — actual returns may vary based on market conditions and other factors.",
    },
    {
      question: "Is FINAIW free?",
      answer:
        "Yes! FINAIW is completely free to use. No subscriptions, no hidden fees — ever.",
    },
    {
      question: "Do I need to create an account?",
      answer:
        "No account is required to use any of our calculators or tools. You can start exploring immediately.",
    },
    {
      question: "How can I contact support?",
      answer:
        "You can reach us via the contact form below or email us directly at support@finaiw.com. We aim to respond within 24 hours.",
    },
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    // Here you would normally send the email
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  return (
    <>
      <Helmet>
        <title>Help Center – FINAIW</title>
        <meta
          name="description"
          content="Need help with FINAIW? Find answers to common questions, learn how to use our calculators, and get in touch with support."
        />
        <meta
          name="keywords"
          content="help center, FINAIW support, FAQs, financial calculators help"
        />
      </Helmet>

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
        

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 md:p-12">
            {/* Header */}
            <div className="mb-2">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                FINAIW Help Center
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              How Can We Help You?
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed mb-10">
              Find answers to common questions, learn how to use our tools, and get the
              support you need — all in one place.
            </p>

            {/* Quick Start */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 p-6 mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-3">
                Getting Started
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                New to FINAIW? Here's how to make the most of our platform:
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-lg leading-none">1.</span>
                  <span>
                    <span className="font-semibold text-slate-700">Explore the Calculators</span> – 
                    Visit our Calculators page to find tools for loans, investments, retirement, 
                    taxes, and more.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-lg leading-none">2.</span>
                  <span>
                    <span className="font-semibold text-slate-700">Ask the FinAI Assistant</span> – 
                    Use the chat feature to get instant answers to your financial questions.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-lg leading-none">3.</span>
                  <span>
                    <span className="font-semibold text-slate-700">Learn at Your Own Pace</span> – 
                    Check out our Blogs, Quizzes, and News sections to deepen your financial 
                    knowledge.
                  </span>
                </li>
              </ul>
            </div>

            {/* FAQs */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-slate-200/60 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left text-slate-700 hover:bg-slate-50 transition"
                    >
                      <span className="font-medium">{faq.question}</span>
                      <span className="text-blue-600 text-xl transition-transform duration-200">
                        {activeFaq === index ? "−" : "+"}
                      </span>
                    </button>
                    <div
                      className={`px-5 overflow-hidden transition-all duration-300 ${
                        activeFaq === index ? "max-h-96 py-4" : "max-h-0 py-0"
                      }`}
                    >
                      <p className="text-slate-500 leading-relaxed border-t border-slate-100 pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="mt-12 border-t border-slate-200 pt-10">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Still Need Help?
              </h2>
              <p className="text-slate-500 mb-6">
                If you couldn't find the answer you were looking for, feel free to 
                reach out to us directly. We'll get back to you as soon as possible.
              </p>
              <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
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
                    placeholder="John Doe"
                  />
                </div>
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
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                    Your Question
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                    placeholder="How can we assist you?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-xl shadow-sm shadow-blue-200/50"
                >
                  Send Message
                </button>
                {formSubmitted && (
                  <p className="text-emerald-600 text-sm font-medium text-center">
                    Thank you! Your message has been sent. We'll respond shortly.
                  </p>
                )}
              </form>
            </div>

            {/* Direct Contact */}
            <div className="mt-8 text-sm text-slate-500 border-t border-slate-200 pt-6">
              <p>
                Prefer to email us directly? Reach us at{" "}
                <a
                  href="mailto:support@finaiw.com"
                  className="text-blue-600 hover:underline font-medium"
                >
                  support@finaiw.com
                </a>
              </p>
            </div>

            {/* Disclaimer Note */}
            <div className="mt-8 text-xs text-slate-400 border-t border-slate-200 pt-4">
              <p>
                <span className="font-medium text-slate-500">Disclaimer:</span>{" "}
                All responses are for educational purposes only. For personalised advice, 
                please consult a qualified financial professional.
              </p>
            </div>
          </div>
        </section>

        
      </div>
    </>
  );
}