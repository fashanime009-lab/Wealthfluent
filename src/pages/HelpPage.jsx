import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema, faqSchema } from "@/components/seo/schema";
import { HelpCircle, Rocket, Calculator, Compass, BookOpen, ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is FINAIW?",
    answer:
      "FINAIW (Financial Intelligence, AI for Wealth) is a free platform that offers financial calculators, AI-powered insights, and educational content to help you make smarter money decisions.",
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
    question: "What's the compass icon in the corner?",
    answer:
      "It opens a quick site guide — a clickable directory that explains what every section of FINAIW does (Calculators, Verdict, Goals, Learn, Insights) and takes you straight there. No typing required.",
  },
  {
    question: "Are the calculators accurate?",
    answer:
      "Our calculators use standard financial formulas and are designed to be as accurate as possible. However, they are for illustrative and educational purposes only — actual returns may vary based on market conditions and other factors.",
  },
  {
    question: "Is FINAIW free?",
    answer: "Yes! FINAIW is completely free to use. No subscriptions, no hidden fees — ever.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No account is required to use any of our calculators or tools. You can start exploring immediately.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can reach us through our Contact page — we aim to respond within 24 hours.",
  },
];

const quickStart = [
  { icon: Calculator, title: "Explore the Calculators", desc: "Visit our Calculators page to find tools for loans, investments, retirement, taxes, and more." },
  { icon: Compass, title: "Not sure where to start?", desc: "Tap the compass icon in the corner for a quick guide to every section of the site." },
  { icon: BookOpen, title: "Learn at Your Own Pace", desc: "Check out our Quizzes and News sections to deepen your financial knowledge." },
];

export default function HelpPage() {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <>
      <Seo
        title="Help Center – FINAIW"
        description="Need help with FINAIW? Find answers to common questions, learn how to use our calculators, and get in touch with support."
        path="/help"
        keywords="help center, FINAIW support, FAQs, financial calculators help"
        jsonLd={[
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Help Center", path: "/help" },
          ]),
        ]}
      />

      <div className="min-h-screen bg-[#fbfdfc]">
        <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8 lg:px-12">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 sm:p-12">
            {/* Header */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-[12px] font-black text-emerald-800 ring-1 ring-emerald-100">
              <HelpCircle size={13} /> FINAIW Help Center
            </span>
            <h1 className="mt-5 text-[34px] font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-[42px]">
              How can we help you?
            </h1>
            <p className="mt-4 max-w-xl text-[15px] font-medium leading-7 text-slate-500">
              Find answers to common questions, learn how to use our tools, and get the support you
              need — all in one place.
            </p>

            {/* Quick Start */}
            <div className="mt-10 rounded-[28px] border border-emerald-100 bg-emerald-50/50 p-7 sm:p-8">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Rocket size={17} />
                </span>
                <h2 className="text-[20px] font-black text-slate-950">Getting Started</h2>
              </div>
              <p className="mt-4 text-[14px] leading-6 text-slate-600">
                New to FINAIW? Here's how to make the most of our platform:
              </p>
              <ul className="mt-5 space-y-4">
                {quickStart.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <li key={step.title} className="flex items-start gap-3.5">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-xl bg-white text-emerald-700 ring-1 ring-emerald-100">
                        <Icon size={15} />
                      </span>
                      <span className="text-[14px] leading-6 text-slate-600">
                        <span className="font-black text-slate-800">{i + 1}. {step.title}</span> — {step.desc}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* FAQs */}
            <div className="mt-12">
              <h2 className="text-[22px] font-black tracking-[-0.02em] text-slate-950">
                Frequently Asked Questions
              </h2>
              <div className="mt-5 space-y-2.5">
                {faqs.map((faq, index) => (
                  <div key={faq.question} className="overflow-hidden rounded-2xl border border-slate-200">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50"
                    >
                      <span className="text-[14px] font-bold text-slate-800">{faq.question}</span>
                      <ChevronDown
                        size={17}
                        className={`flex-shrink-0 text-emerald-700 transition-transform duration-200 ${
                          activeFaq === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden px-5 transition-all duration-300 ${
                        activeFaq === index ? "max-h-96 py-4" : "max-h-0 py-0"
                      }`}
                    >
                      <p className="border-t border-slate-100 pt-4 text-[13.5px] leading-6 text-slate-500">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Still need help? */}
            <div className="mt-12 border-t border-slate-100 pt-10">
              <h2 className="text-[22px] font-black tracking-[-0.02em] text-slate-950">Still need help?</h2>
              <p className="mt-3 max-w-lg text-[14px] leading-6 text-slate-500">
                If you couldn't find the answer you were looking for, reach out to us directly and
                we'll get back to you as soon as possible.
              </p>
              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-6 py-3.5 text-[14px] font-black text-white shadow-[0_14px_30px_rgba(4,120,87,.22)] transition hover:-translate-y-0.5 hover:bg-emerald-900"
              >
                Contact Us
              </Link>
            </div>

            {/* Disclaimer */}
            <p className="mt-8 border-t border-slate-100 pt-4 text-[12px] leading-5 text-slate-400">
              <span className="font-bold text-slate-500">Disclaimer:</span> All responses are for
              educational purposes only. For personalised advice, please consult a qualified
              financial professional.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
