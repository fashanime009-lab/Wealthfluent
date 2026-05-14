import { Link } from "react-router-dom";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <header className="border-b border-white/10 bg-[#07111f]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <h1 className="text-2xl font-black">
              Wealth<span className="text-cyan-400">Fluent</span>
            </h1>
          </Link>

          <Link
            to="/"
            className="text-cyan-400 hover:text-cyan-300"
          >
            ← Back To Home
          </Link>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-black mb-10">
          Privacy Policy
        </h1>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <p>
            WealthFluent values your privacy and is committed to
            protecting your personal information.
          </p>

          <p>
            We may collect non-personal analytics information such as
            browser type, device information, and pages visited to
            improve user experience and website performance.
          </p>

          <p>
            Third-party advertising partners including Google AdSense
            may use cookies to serve personalized advertisements.
          </p>

          <p>
            By using this website, you agree to this privacy policy
            and the use of cookies for analytics and advertising.
          </p>

          <p>
            If you have any questions regarding this policy,
            please contact us through the contact page.
          </p>
        </div>
      </section>
    </div>
  );
}