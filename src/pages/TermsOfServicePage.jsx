import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";

export default function TermsOfServicePage() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Seo
        title="Terms of Service – FINAIW"
        description="Read the Terms of Service for FINAIW — the rules for using our free financial calculators, tools, and educational content."
        path="/terms-of-service"
        keywords="terms of service, terms and conditions, FINAIW"
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Terms of Service", path: "/terms-of-service" },
        ])}
      />

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 md:p-12">
            <div className="mb-2">
              <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">
                FINAIW
              </p>
              <p className="text-xs text-slate-400">
                Financial Intelligence, AI for Wealth
              </p>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
              Terms of Service
            </h1>
            <p className="text-sm text-slate-400 mb-8">
              Last Updated: September 6, {currentYear}
            </p>

            <div className="space-y-8 text-slate-600 leading-relaxed">
              {/* Agreement */}
              <div>
                <p>
                  These Terms of Service ("Terms") govern your access to and use of FINAIW
                  (the "Website," "we," "us," or "our"), available at finaiw.com. By using the
                  Website, you agree to be bound by these Terms. If you do not agree, please do
                  not use the Website.
                </p>
              </div>

              {/* The Service */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  1. The Service
                </h2>
                <p>
                  FINAIW provides free financial calculators, planning tools, educational
                  content, and related features. No account or signup is required to use the
                  calculators — your inputs and results are processed and stored only in your
                  own browser, never on our servers.
                </p>
                <p className="mt-3">
                  We may add, change, or remove features, calculators, or content at any time,
                  and we may display advertising to keep the Website free — see our{" "}
                  <Link to="/disclaimer" className="text-emerald-700 hover:underline">
                    Disclaimer
                  </Link>{" "}
                  for details on advertising and cookies.
                </p>
              </div>

              {/* Not Financial Advice */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  2. Not Financial, Legal, or Tax Advice
                </h2>
                <p>
                  Every calculator, tool, and piece of content on FINAIW is provided for
                  educational and illustrative purposes only. Nothing on this Website
                  constitutes financial, investment, tax, or legal advice, and using the
                  Website does not create an advisor-client relationship of any kind. Always
                  consult a qualified professional before making financial decisions — see our{" "}
                  <Link to="/disclaimer" className="text-emerald-700 hover:underline">
                    Disclaimer
                  </Link>{" "}
                  for the full details.
                </p>
              </div>

              {/* Acceptable Use */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  3. Acceptable Use
                </h2>
                <p className="mb-3">When using FINAIW, you agree not to:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Use the Website for any unlawful purpose or in violation of any applicable law.</li>
                  <li>Attempt to gain unauthorized access to any part of the Website, its systems, or data of other users.</li>
                  <li>Interfere with or disrupt the Website's functioning, including through automated scraping, bots, or excessive requests.</li>
                  <li>Copy, reproduce, or redistribute the Website's content, calculators, or design for commercial purposes without our written permission.</li>
                  <li>Submit false, misleading, or malicious content through our contact, feedback, or newsletter forms.</li>
                </ul>
              </div>

              {/* Intellectual Property */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  4. Intellectual Property
                </h2>
                <p>
                  The Website's design, layout, calculators, original written content, and
                  branding are owned by FINAIW unless otherwise noted. You may use the
                  calculators and read the content for your own personal, non-commercial use.
                  You may not copy, modify, or redistribute the underlying code, design, or
                  content without permission.
                </p>
              </div>

              {/* Third-Party Services */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  5. Third-Party Services and Links
                </h2>
                <p>
                  The Website may use third-party services (such as Google AdSense for
                  advertising) and may link to external websites. We do not control and are
                  not responsible for the content, accuracy, or practices of any third-party
                  service or site. Your use of any third-party service is subject to that
                  service's own terms and privacy policy.
                </p>
              </div>

              {/* Availability */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  6. Availability and Changes
                </h2>
                <p>
                  We aim to keep FINAIW available and accurate, but we do not guarantee the
                  Website will be uninterrupted, error-free, or available at all times. We may
                  suspend, restrict, or discontinue any part of the Website without notice.
                </p>
              </div>

              {/* Limitation of Liability */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  7. Limitation of Liability
                </h2>
                <p>
                  To the fullest extent permitted by law, FINAIW and its owners are not liable
                  for any direct, indirect, incidental, or consequential damages arising from
                  your use of, or inability to use, the Website — including any financial
                  decisions made based on its calculators or content. See our{" "}
                  <Link to="/disclaimer" className="text-emerald-700 hover:underline">
                    Disclaimer
                  </Link>{" "}
                  for the complete limitation of liability terms.
                </p>
              </div>

              {/* Changes to Terms */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  8. Changes to These Terms
                </h2>
                <p>
                  We may update these Terms from time to time. Material changes will be
                  reflected by an updated "Last Updated" date at the top of this page. Your
                  continued use of the Website after changes are posted constitutes your
                  acceptance of the revised Terms.
                </p>
              </div>

              {/* Governing Law */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  9. Governing Law
                </h2>
                <p>
                  These Terms are governed by the laws of India, without regard to its
                  conflict of law provisions. Any disputes arising under these Terms shall be
                  subject to the exclusive jurisdiction of the courts in India.
                </p>
              </div>

              {/* Contact */}
              <div className="border-t border-slate-200 pt-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  10. Contact Us
                </h2>
                <p>
                  If you have any questions about these Terms, please reach out to us:
                </p>
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                  <p className="text-sm">
                    <span className="font-medium text-slate-700">Email:</span>{" "}
                    <a href="mailto:finaiw.organisation@gmail.com" className="text-emerald-700 hover:underline">
                      finaiw.organisation@gmail.com
                    </a>
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium text-slate-700">Location:</span>{" "}
                    Mumbai, India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
