import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About FINAIW – Financial Intelligence for Everyone</title>
        <meta
          name="description"
          content="FINAIW is a free platform offering simple, smart financial tools for real people. Start taking control of your money today."
        />
        <meta
          name="keywords"
          content="about FINAIW, financial intelligence, money management, financial calculators, personal finance"
        />
      </Helmet>

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
       

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* Hero Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 md:p-12 mb-12">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                About FINAIW
              </p>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
                Helping You Make
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  Smarter Financial Choices
                </span>
              </h1>
              <p className="text-slate-500 text-lg mt-4 leading-relaxed">
                We believe that everyone deserves to feel confident about their money. 
                FINAIW is your friendly companion on the journey to financial well‑being — 
                simple, free, and made for real people, everywhere.
              </p>
            </div>
          </div>

          {/* Our Story */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 md:p-12 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Our Story</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              FINAIW was born from a simple realisation: financial jargon and hidden fees 
              make it hard for ordinary people to take control of their money. We saw 
              friends, family, and colleagues struggling to understand loans, investments, 
              and retirement planning — not because they weren't smart, but because the 
              system felt designed to confuse.
            </p>
            <p className="text-slate-600 leading-relaxed text-lg mt-4">
              So we decided to build something different. FINAIW is a space where complex 
              financial concepts become clear, where tools are genuinely helpful, and where 
              everyone — regardless of background or location — can find a path to financial 
              confidence.
            </p>
          </div>

          {/* Our Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed">
                To make financial confidence a reality for everyone — by offering clear, 
                accessible, and completely free tools that help people understand their 
                money, plan their goals, and live with less financial stress.
              </p>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed">
                A world where financial literacy is not a privilege — it is a right. We 
                envision a future where technology and empathy work together to help 
                people everywhere build secure and fulfilling financial lives.
              </p>
            </div>
          </div>

          {/* What We Offer */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 md:p-12 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">
              What You Will Find Here
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h4 className="text-xl font-bold text-slate-800 mb-2">Practical Tools</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Calculators for loans, investments, taxes, retirement, and more — 
                  designed to give you real answers, not more questions.
                </p>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold text-slate-800 mb-2">Friendly Guidance</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Our digital assistant is here to answer your questions in plain, 
                  simple language, so you can learn at your own pace without feeling 
                  overwhelmed.
                </p>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold text-slate-800 mb-2">Real‑World Wisdom</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Articles, quizzes, and tips written for everyday people — because 
                  financial education should feel like a conversation, not a lecture.
                </p>
              </div>
            </div>
          </div>

          {/* Why FINAIW */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl border border-blue-100 p-8 md:p-12 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">
              Why FINAIW
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <span className="text-blue-600 text-xl font-bold">✓</span>
                <div>
                  <h4 className="font-semibold text-slate-800">Always Free</h4>
                  <p className="text-slate-500 text-sm">No strings attached. No hidden fees. No subscriptions.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-blue-600 text-xl font-bold">✓</span>
                <div>
                  <h4 className="font-semibold text-slate-800">Made for Humans</h4>
                  <p className="text-slate-500 text-sm">Clear language, intuitive design, and genuine care for your journey.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-blue-600 text-xl font-bold">✓</span>
                <div>
                  <h4 className="font-semibold text-slate-800">Privacy First</h4>
                  <p className="text-slate-500 text-sm">Your data stays yours. We do not sell or track your personal information.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-blue-600 text-xl font-bold">✓</span>
                <div>
                  <h4 className="font-semibold text-slate-800">Built with Empathy</h4>
                  <p className="text-slate-500 text-sm">We understand that money can be stressful — we are here to make it easier.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 text-center">
              <div className="text-3xl font-black text-blue-600">15+</div>
              <div className="text-sm text-slate-500 mt-1">Tools to explore</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 text-center">
              <div className="text-3xl font-black text-cyan-600">100%</div>
              <div className="text-sm text-slate-500 mt-1">Free, always</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 text-center">
              <div className="text-3xl font-black text-emerald-600">Human</div>
              <div className="text-sm text-slate-500 mt-1">Centric design</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 text-center">
              <div className="text-3xl font-black text-purple-600">Global</div>
              <div className="text-sm text-slate-500 mt-1">For everyone</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Take the First Step?
            </h2>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
              Explore our calculators, ask a question, or just browse around — 
              you are always welcome here.
            </p>
            <Link
              to="/calculators"
              className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-2xl hover:bg-blue-50 transition shadow-lg shadow-blue-200/30"
            >
              Explore Calculators
            </Link>
          </div>

          {/* Disclaimer Note */}
          <div className="mt-8 text-xs text-slate-400 text-center">
            <p>
              FINAIW is an educational platform. All tools and content are for illustrative 
              purposes only. Please consult a qualified financial advisor for personalised advice.
            </p>
          </div>
        </section>

        
      </div>
    </>
  );
}