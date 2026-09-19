import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema, faqSchema } from "@/components/seo/schema";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

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
  { title: "Explore the calculators", desc: "Visit our Calculators page to find tools for loans, investments, retirement, taxes, and more." },
  { title: "Not sure where to start?", desc: "Tap the compass icon in the corner for a quick guide to every section of the site." },
  { title: "Learn at your own pace", desc: "Check out our Quizzes and News sections to deepen your financial knowledge." },
];

export default function HelpPage() {
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

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-[760px] px-5 py-16 sm:px-8 lg:px-12">
          <h1 className="font-display text-[34px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[42px]">
            How can we help you?
          </h1>
          <p className="mt-4 max-w-[58ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
            Find answers to common questions, learn how to use our tools, and get the support you
            need — all in one place.
          </p>

          {/* Getting Started */}
          <div className="mt-12 border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10">
            <h2 className="font-display text-[22px] font-extrabold tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec]">
              Getting started
            </h2>
            <p className="mt-3 max-w-[60ch] text-[14px] leading-6 text-[#111814]/60 dark:text-[#eef1ec]/60">
              New to FINAIW? Here's how to make the most of our platform:
            </p>
            <div className="mt-5 divide-y divide-[#111814]/8 dark:divide-[#eef1ec]/8">
              {quickStart.map((step, i) => (
                <div key={step.title} className="py-4">
                  <p className="text-[14px] leading-6 text-[#111814]/65 dark:text-[#eef1ec]/65">
                    <span className="font-semibold text-[#111814] dark:text-[#eef1ec]">{i + 1}. {step.title}</span> — {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="mt-12 border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10">
            <VerdictFAQ items={faqs.map((f) => ({ q: f.question, a: f.answer }))} />
          </div>

          {/* Still need help? */}
          <div className="mt-12 border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10">
            <h2 className="font-display text-[22px] font-extrabold tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec]">
              Still need help?
            </h2>
            <p className="mt-3 max-w-lg text-[14px] leading-6 text-[#111814]/60 dark:text-[#eef1ec]/60">
              If you couldn't find the answer you were looking for, reach out to us directly and
              we'll get back to you as soon as possible.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-block border border-[#111814] bg-[#111814] px-6 py-3 text-[14px] font-semibold text-[#eef1ec] transition hover:bg-[#111814]/85 dark:border-[#eef1ec] dark:bg-[#eef1ec] dark:text-[#111814] dark:hover:bg-[#eef1ec]/85"
            >
              Contact us
            </Link>
          </div>

          <p className="mt-10 border-t border-[#111814]/10 pt-6 text-[12px] leading-5 text-[#111814]/45 dark:border-[#eef1ec]/10 dark:text-[#eef1ec]/45">
            <span className="font-semibold text-[#111814]/65 dark:text-[#eef1ec]/65">Disclaimer:</span> All responses are for
            educational purposes only. For personalised advice, please consult a qualified
            financial professional.
          </p>
        </div>
      </div>
    </>
  );
}
