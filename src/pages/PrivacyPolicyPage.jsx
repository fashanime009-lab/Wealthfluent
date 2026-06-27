import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";


export default function PrivacyPolicyPage() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Helmet>
        <title>Privacy Policy – FINAIW</title>
        <meta
          name="description"
          content="Read the Privacy Policy of FINAIW to understand how we collect, use, and protect your personal information."
        />
        <meta
          name="keywords"
          content="privacy policy, data protection, FINAIW, GDPR, personal information, cookies"
        />
      </Helmet>

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
       

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 md:p-12">
            {/* Header */}
            <div className="mb-2">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                FINAIW
              </p>
              <p className="text-xs text-slate-400">
                Financial Intelligence with AI for Wealth
              </p>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-400 mb-8">
              Last Updated: June 26, {currentYear}
            </p>

            <div className="space-y-8 text-slate-600 leading-relaxed">
              {/* Introduction */}
              <div>
                <p className="mb-2">
                  At FINAIW, we take your privacy seriously. This Privacy Policy explains 
                  how we collect, use, disclose, and safeguard your personal information when 
                  you visit our website (finaiw.com) or use our services.
                </p>
                <p>
                  FINAIW is operated from India and complies with the Information Technology 
                  (Reasonable Security Practices and Procedures and Sensitive Personal Data 
                  or Information) Rules, 2011, and other applicable Indian data protection laws. 
                  However, our services are designed for a global audience, and we are committed 
                  to protecting your privacy wherever you are.
                </p>
              </div>

              {/* Information We Collect */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  1. Information We Collect
                </h2>
                <p className="mb-3">
                  We may collect the following types of information:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    <span className="font-medium text-slate-700">Personal Information</span> – 
                    Name, email address, phone number, and any other information you provide 
                    voluntarily (e.g., when you contact us or subscribe to updates).
                  </li>
                  <li>
                    <span className="font-medium text-slate-700">Usage Data</span> – 
                    Information about how you interact with our website, including pages visited, 
                    time spent, clicks, and referring URLs.
                  </li>
                  <li>
                    <span className="font-medium text-slate-700">Device & Browser Data</span> – 
                    IP address, browser type, operating system, screen resolution, and other 
                    technical details.
                  </li>
                  <li>
                    <span className="font-medium text-slate-700">Cookies & Tracking</span> – 
                    We use cookies and similar technologies to enhance your experience, analyse 
                    usage, and personalise content.
                  </li>
                </ul>
              </div>

              {/* How We Use Your Information */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  2. How We Use Your Information
                </h2>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>To provide and maintain our services and website.</li>
                  <li>To improve and personalise your experience.</li>
                  <li>To respond to your inquiries and support requests.</li>
                  <li>To send you administrative information, such as updates to our policies.</li>
                  <li>To analyse usage trends and optimise our content.</li>
                  <li>To comply with legal obligations or enforce our terms.</li>
                </ul>
              </div>

              {/* Legal Basis for Processing (GDPR) */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  3. Legal Basis for Processing (GDPR)
                </h2>
                <p>
                  For users in the European Economic Area (EEA), we process your personal 
                  information based on one or more of the following legal grounds:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2 mt-3">
                  <li>Your consent (which you may withdraw at any time).</li>
                  <li>Performance of a contract with you (e.g., providing services).</li>
                  <li>Compliance with a legal obligation.</li>
                  <li>Our legitimate interests (e.g., improving our website and services).</li>
                </ul>
              </div>

              {/* Sharing Your Information */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  4. Sharing Your Information
                </h2>
                <p className="mb-3">
                  We do not sell, rent, or trade your personal information. We may share your 
                  data with:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    <span className="font-medium text-slate-700">Service Providers</span> – 
                    Trusted third‑party vendors who assist with website hosting, analytics, 
                    and email delivery (all are bound by strict confidentiality agreements).
                  </li>
                  <li>
                    <span className="font-medium text-slate-700">Legal Authorities</span> – 
                    If required by law, we may disclose information to comply with a legal 
                    obligation or protect our rights.
                  </li>
                </ul>
              </div>

              {/* Cross-Border Data Transfers */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  5. Cross‑Border Data Transfers
                </h2>
                <p>
                  FINAIW is based in India, and your information may be stored and processed 
                  on servers located in India or other countries where our service providers 
                  operate. By using our website, you consent to the transfer of your data to 
                  these jurisdictions, which may have different data protection laws than 
                  your country of residence. We take appropriate safeguards to ensure your 
                  data is protected in accordance with this policy.
                </p>
              </div>

              {/* Data Retention */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  6. Data Retention
                </h2>
                <p>
                  We retain your personal information only for as long as necessary to fulfil 
                  the purposes for which it was collected, unless a longer retention period is 
                  required or permitted by law. When we no longer need your data, we securely 
                  delete or anonymise it.
                </p>
              </div>

              {/* Cookies */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  7. Cookies & Tracking Technologies
                </h2>
                <p className="mb-3">
                  We use cookies to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Remember your preferences and settings.</li>
                  <li>Analyse site traffic and user behaviour.</li>
                  <li>Deliver relevant content and improve functionality.</li>
                </ul>
                <p className="mt-3">
                  You can control cookies through your browser settings. Please note that 
                  disabling cookies may affect some features of the website.
                </p>
              </div>

              {/* Third-Party Services */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  8. Third‑Party Services
                </h2>
                <p>
                  Our website may contain links to external sites or use third‑party tools 
                  (e.g., Google Analytics, social media buttons). These services have their 
                  own privacy policies, and we are not responsible for their practices. We 
                  encourage you to review their policies before providing any personal data.
                </p>
              </div>

              {/* Your Rights */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  9. Your Rights (Global)
                </h2>
                <p className="mb-3">
                  Depending on your location, you may have certain rights regarding your 
                  personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Access, update, or delete your data.</li>
                  <li>Withdraw consent at any time.</li>
                  <li>Object to processing or request data portability.</li>
                  <li>Lodge a complaint with a data protection authority.</li>
                </ul>
                <p className="mt-3">
                  To exercise any of these rights, please contact us using the details below.
                </p>
              </div>

              {/* Children’s Privacy */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  10. Children’s Privacy
                </h2>
                <p>
                  Our services are not directed at individuals under the age of 18. We do not 
                  knowingly collect personal information from minors. If we become aware that 
                  we have inadvertently collected such data, we will take steps to delete it.
                </p>
              </div>

              {/* Security */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  11. Data Security
                </h2>
                <p>
                  We implement reasonable technical and organisational measures to protect 
                  your personal information from unauthorized access, disclosure, alteration, 
                  or destruction. However, no transmission over the internet is 100% secure, 
                  so we cannot guarantee absolute security.
                </p>
              </div>

              {/* Changes to This Policy */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  12. Changes to This Privacy Policy
                </h2>
                <p>
                  We may update this Privacy Policy periodically to reflect changes in our 
                  practices or legal requirements. We will notify you of any material changes 
                  by posting the new version on this page with an updated date. Your continued 
                  use of the website after such changes constitutes your acceptance of the 
                  revised policy.
                </p>
              </div>

              {/* Contact Information */}
              <div className="border-t border-slate-200 pt-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  13. Contact Us
                </h2>
                <p>
                  If you have any questions, concerns, or requests regarding this Privacy 
                  Policy or your personal data, please reach out to us:
                </p>
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                  <p className="text-sm">
                    <span className="font-medium text-slate-700">Email:</span>{" "}
                    <a href="mailto:privacy@finaiw.com" className="text-blue-600 hover:underline">
                      privacy@finaiw.com
                    </a>
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium text-slate-700">Address:</span>{" "}
                    FINAIW, [Your Business Address], India
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    (Please note: This is an informational address. For privacy‑related queries, 
                    use the email above.)
                  </p>
                </div>
              </div>

              {/* Governing Law */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/60 text-sm text-slate-500">
                <p>
                  <span className="font-medium text-slate-600">Governing Law:</span> This 
                  Privacy Policy is governed by the laws of India, without regard to its 
                  conflict of law provisions. Any disputes arising under this policy shall 
                  be subject to the exclusive jurisdiction of the courts in India.
                </p>
                <p className="mt-2">
                  <span className="font-medium text-slate-600">International Users:</span> 
                  While our services are accessible globally, our data processing activities 
                  are primarily conducted in India. We strive to meet international standards, 
                  but please be aware that your data may be subject to Indian legal requirements.
                </p>
              </div>
            </div>
          </div>
        </section>

       
      </div>
    </>
  );
}