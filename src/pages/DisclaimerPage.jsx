import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function DisclaimerPage() {
  return (
    <>
      <Helmet>
        <title>Disclaimer – FINAIW</title>
        <meta
          name="description"
          content="Read the full disclaimer for FINAIW (Financial Intelligence with AI for Wealth). Learn about our use of calculators, educational content, and limitations of liability."
        />
      </Helmet>

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
        <Navbar />

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 md:p-12">
            <div className="mb-6">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                FINAIW
              </p>
              <p className="text-xs text-slate-400">
                Financial Intelligence with AI for Wealth
              </p>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
              Disclaimer
            </h1>
            <p className="text-sm text-slate-400 mb-8">
              Last Updated: June 21, 2026
            </p>

            <div className="space-y-8 text-slate-600 leading-relaxed">
              {/* General Disclaimer */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  General Information
                </h2>
                <p>
                  The information provided on FINAIW — Financial Intelligence with AI for Wealth (the "Website") is for 
                  <span className="font-medium text-slate-700"> educational and informational purposes</span> only. 
                  It is not intended to be a substitute for professional financial advice, 
                  investment guidance, tax consultation, or legal counsel.
                </p>
                <p className="mt-3">
                  While we strive to keep the information accurate and up‑to‑date, 
                  we make no representations or warranties of any kind, express or implied, 
                  about the completeness, accuracy, reliability, suitability, or availability 
                  with respect to the Website or the information, products, services, or 
                  related graphics contained on the Website for any purpose.
                </p>
              </div>

              {/* No Financial Advice */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  No Financial Advice
                </h2>
                <p>
                  FINAIW does not provide personalised financial, investment, tax, 
                  or legal advice. The content and calculators on this site are 
                  <span className="font-medium text-slate-700"> for illustrative and educational purposes only</span>.
                </p>
                <p className="mt-3">
                  Any reliance you place on such information is strictly at your own risk. 
                  Before making any financial decisions, you should consult a qualified 
                  financial advisor or other appropriate professional who understands your 
                  personal financial situation.
                </p>
              </div>

              {/* AI Disclaimer */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  AI-Generated Content
                </h2>
                <p>
                  FINAIW utilises artificial intelligence to generate financial insights, 
                  summaries, and educational content. While we strive for accuracy and 
                  relevance, AI-generated content is 
                  <span className="font-medium text-slate-700"> not a substitute for professional human judgment</span>.
                </p>
                <p className="mt-3">
                  You acknowledge and agree that:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                  <li>
                    AI-generated content may contain errors or omissions.
                  </li>
                  <li>
                    You are responsible for verifying any AI-generated information 
                    before acting on it.
                  </li>
                  <li>
                    FINAIW shall not be liable for any decisions made based on 
                    AI-generated content.
                  </li>
                </ul>
              </div>

              {/* Calculator Disclaimer */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  Calculator Tools
                </h2>
                <p>
                  All calculators provided on FINAIW are designed to give you an 
                  <span className="font-medium text-slate-700"> estimate based on the inputs you provide</span>. 
                  They do not guarantee actual returns, future performance, or any specific 
                  financial outcome.
                </p>
                <ul className="list-disc list-inside mt-3 space-y-2 ml-2">
                  <li>
                    <span className="font-medium">Investment calculators</span> assume fixed rates of return, 
                    which are not guaranteed in real markets.
                  </li>
                  <li>
                    <span className="font-medium">Loan calculators</span> provide approximate EMIs and are 
                    not official loan offers.
                  </li>
                  <li>
                    <span className="font-medium">Tax calculators</span> are estimates and should be verified 
                    with a tax professional.
                  </li>
                  <li>
                    <span className="font-medium">Retirement projections</span> are based on assumptions 
                    that may not reflect actual market conditions.
                  </li>
                </ul>
                <p className="mt-3">
                  You are strongly advised to verify all calculations and assumptions 
                  with a qualified professional before making any financial commitments.
                </p>
              </div>

              {/* No Guarantees */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  No Guarantees or Warranties
                </h2>
                <p>
                  FINAIW makes no guarantees regarding the accuracy, completeness, 
                  or timeliness of the information provided. The Website and its content 
                  are provided "as is" without any warranties of any kind, either express 
                  or implied.
                </p>
                <p className="mt-3">
                  We do not warrant that the Website will be uninterrupted, error‑free, 
                  or free of viruses or other harmful components.
                </p>
              </div>

              {/* External Links */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  External Links
                </h2>
                <p>
                  Our Website may contain links to third‑party websites or services that 
                  are not owned or controlled by FINAIW. We have no control over, 
                  and assume no responsibility for, the content, privacy policies, or 
                  practices of any third‑party websites.
                </p>
                <p className="mt-3">
                  The inclusion of any external link does not imply endorsement, approval, 
                  or recommendation by FINAIW. You acknowledge and agree that 
                  FINAIW shall not be responsible or liable, directly or indirectly, 
                  for any damage or loss caused or alleged to be caused by or in connection 
                  with use of or reliance on any such content, goods, or services available 
                  on or through any such third‑party websites.
                </p>
              </div>

              {/* Affiliate Disclosure */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  Affiliate Disclosure
                </h2>
                <p>
                  FINAIW may participate in affiliate marketing programs, which 
                  means we may earn commissions on products or services purchased 
                  through links on our Website. These links are provided for your 
                  convenience and do not affect the price you pay.
                </p>
                <p className="mt-3">
                  We only recommend products and services that we believe may be of 
                  value to our users. However, you are under no obligation to use 
                  these links and should always perform your own due diligence.
                </p>
              </div>

              {/* Limitation of Liability */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  Limitation of Liability
                </h2>
                <p>
                  To the fullest extent permitted by applicable law, FINAIW 
                  and its owners, employees, agents, and affiliates shall not be liable 
                  for any direct, indirect, incidental, special, consequential, or 
                  punitive damages arising out of or in any way connected with your 
                  use of the Website or its content.
                </p>
                <p className="mt-3">
                  This includes, but is not limited to, any financial loss, damage to 
                  reputation, or loss of data resulting from the use of the Website, 
                  even if advised of the possibility of such damages.
                </p>
              </div>

              {/* User Responsibility */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  Your Responsibility
                </h2>
                <p>
                  By using FINAIW, you accept full responsibility for your 
                  financial decisions. You agree to conduct your own research and 
                  consult with qualified professionals before acting on any information 
                  or estimates provided by this Website.
                </p>
                <p className="mt-3">
                  You also agree not to hold FINAIW liable for any decisions 
                  you make based on the information provided.
                </p>
              </div>

              {/* Governing Law */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  Governing Law
                </h2>
                <p>
                  These terms and your use of FINAIW shall be governed by and 
                  construed in accordance with the laws of India, without regard to 
                  its conflict of law provisions.
                </p>
              </div>

              {/* Changes to Disclaimer */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  Changes to This Disclaimer
                </h2>
                <p>
                  We reserve the right to update or change this Disclaimer at any time. 
                  Any changes will be effective immediately upon posting the updated 
                  version on this page. Your continued use of the Website after any 
                  changes constitutes your acceptance of the updated Disclaimer.
                </p>
                <p className="mt-3">
                  We encourage you to review this page periodically to stay informed 
                  about how we are protecting your rights and limiting our liability.
                </p>
              </div>

              {/* Contact */}
              <div className="border-t border-slate-200 pt-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  Contact Us
                </h2>
                <p>
                  If you have any questions about this Disclaimer, please contact us at:
                </p>
                <p className="mt-2 font-medium text-slate-700">
                  support@finaiw.com
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  (This email is for informational purposes and does not constitute financial advice.)
                </p>
              </div>

              {/* Final Note */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200/60 text-sm text-slate-500">
                <p>
                  <span className="font-medium text-slate-600">Important:</span> Nothing on this website 
                  should be construed as an offer, solicitation, or recommendation to buy or sell 
                  any security or financial product. Always consult with a licensed financial 
                  advisor before making investment decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}