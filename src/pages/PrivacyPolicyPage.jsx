import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";

const link = "text-[#047857] underline decoration-[#047857]/30 underline-offset-2 hover:decoration-[#047857] dark:text-[#34d399] dark:decoration-[#34d399]/30 dark:hover:decoration-[#34d399]";
const strong = "font-semibold text-[#111814] dark:text-[#eef1ec]";
const list = "list-disc space-y-2 pl-5 marker:text-[#111814]/25 dark:marker:text-[#eef1ec]/25";

function Section({ n, title, children }) {
  return (
    <div className="border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10">
      <h2 className="font-display text-[19px] font-extrabold tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec]">
        {n}. {title}
      </h2>
      <div className="mt-3 space-y-3 text-[14px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
        {children}
      </div>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Seo
        title="Privacy Policy – FINAIW"
        description="Read the Privacy Policy of FINAIW to understand how we collect, use, and protect your personal information."
        path="/privacy-policy"
        keywords="privacy policy, data protection, FINAIW, GDPR, personal information, cookies"
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy" },
        ])}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-[760px] px-5 py-16 sm:px-8 lg:px-12">
          <p className="text-[13px] font-semibold text-[#111814]/45 dark:text-[#eef1ec]/45">
            FINAIW — Financial Intelligence, AI for Wealth
          </p>
          <h1 className="font-display mt-2 text-[34px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[42px]">
            Privacy Policy
          </h1>
          <p className="mt-3 font-mono-tech text-[13px] tabular-nums text-[#111814]/45 dark:text-[#eef1ec]/45">
            Last updated: June 26, {currentYear}
          </p>

          <div className="mt-10 space-y-3 text-[14px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
            <p>
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

          <div className="mt-10 space-y-10">
            <Section n={1} title="Information We Collect">
              <p>We may collect the following types of information:</p>
              <ul className={list}>
                <li>
                  <span className={strong}>Personal Information</span> –
                  Name, email address, and any other information you provide
                  voluntarily (e.g., when you contact us, submit feedback, or subscribe to updates).
                </li>
                <li>
                  <span className={strong}>Usage Data</span> –
                  Information about how you interact with our website, including pages visited,
                  time spent, clicks, and referring URLs.
                </li>
                <li>
                  <span className={strong}>Device & Browser Data</span> –
                  IP address, browser type, operating system, screen resolution, and other
                  technical details.
                </li>
                <li>
                  <span className={strong}>Cookies & Tracking</span> –
                  We use cookies for advertising only, and only if you accept them —
                  see our{" "}
                  <Link to="/disclaimer" className={link}>
                    Disclaimer
                  </Link>{" "}
                  page and the cookie banner for the full breakdown of what is and isn't a
                  cookie on this site.
                </li>
                <li>
                  <span className={strong}>Locally Stored Data</span> –
                  Your financial profile, goals, learning streak, calculator history, and
                  display preferences are saved only in your browser's local storage. This is
                  not a cookie, and it is never transmitted to our servers or any third party.
                </li>
              </ul>
            </Section>

            <Section n={2} title="How We Use Your Information">
              <ul className={list}>
                <li>To provide and maintain our services and website.</li>
                <li>To improve and personalise your experience.</li>
                <li>To respond to your inquiries and support requests.</li>
                <li>To send you administrative information, such as updates to our policies.</li>
                <li>To analyse usage trends and optimise our content.</li>
                <li>To comply with legal obligations or enforce our terms.</li>
              </ul>
            </Section>

            <Section n={3} title="Legal Basis for Processing (GDPR)">
              <p>
                For users in the European Economic Area (EEA), we process your personal
                information based on one or more of the following legal grounds:
              </p>
              <ul className={list}>
                <li>Your consent (which you may withdraw at any time).</li>
                <li>Performance of a contract with you (e.g., providing services).</li>
                <li>Compliance with a legal obligation.</li>
                <li>Our legitimate interests (e.g., improving our website and services).</li>
              </ul>
            </Section>

            <Section n={4} title="Sharing Your Information">
              <p>
                We do not sell, rent, or trade your personal information. We may share your
                data with:
              </p>
              <ul className={list}>
                <li>
                  <span className={strong}>Service Providers</span> –
                  Trusted third‑party vendors who assist with website hosting, email delivery,
                  and — only if you accept our cookie banner — analytics and advertising (all
                  are bound by strict confidentiality agreements).
                </li>
                <li>
                  <span className={strong}>Legal Authorities</span> –
                  If required by law, we may disclose information to comply with a legal
                  obligation or protect our rights.
                </li>
              </ul>
            </Section>

            <Section n={5} title="Cross‑Border Data Transfers">
              <p>
                FINAIW is based in India, and your information may be stored and processed
                on servers located in India or other countries where our service providers
                operate. By using our website, you consent to the transfer of your data to
                these jurisdictions, which may have different data protection laws than
                your country of residence. We take appropriate safeguards to ensure your
                data is protected in accordance with this policy.
              </p>
            </Section>

            <Section n={6} title="Data Retention">
              <p>
                We retain your personal information only for as long as necessary to fulfil
                the purposes for which it was collected, unless a longer retention period is
                required or permitted by law. When we no longer need your data, we securely
                delete or anonymise it. Data stored locally in your browser (your financial
                profile, goals, and preferences) can be cleared at any time from{" "}
                <Link to="/settings" className={link}>
                  Settings
                </Link>.
              </p>
            </Section>

            <Section n={7} title="Cookies & Tracking Technologies">
              <p>
                FINAIW itself does not set tracking cookies. Two third-party cookies are used
                on this site, each only if you accept them in the cookie banner: Google
                Analytics (to see which calculators and pages people actually use, so we know
                what to improve) and Google AdSense (to show ads and measure their
                performance). If you decline either or both, those cookies are not set and the
                site works exactly the same.
              </p>
              <p>
                You can change your choice at any time from "Cookie Preferences" in the
                footer, or control cookies through your browser settings.
              </p>
            </Section>

            <Section n={8} title="Third‑Party Services">
              <p>
                Our website may use third‑party tools (e.g., Google AdSense) and may contain
                links to external sites. These services have their own privacy policies, and
                we are not responsible for their practices. We encourage you to review their
                policies before providing any personal data.
              </p>
            </Section>

            <Section n={9} title="Your Rights (Global)">
              <p>
                Depending on your location, you may have certain rights regarding your
                personal information:
              </p>
              <ul className={list}>
                <li>Access, update, or delete your data.</li>
                <li>Withdraw consent at any time.</li>
                <li>Object to processing or request data portability.</li>
                <li>Lodge a complaint with a data protection authority.</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us using the details below.
              </p>
            </Section>

            <Section n={10} title="Children's Privacy">
              <p>
                Our services are not directed at individuals under the age of 18. We do not
                knowingly collect personal information from minors. If we become aware that
                we have inadvertently collected such data, we will take steps to delete it.
              </p>
            </Section>

            <Section n={11} title="Data Security">
              <p>
                We implement reasonable technical and organisational measures to protect
                your personal information from unauthorized access, disclosure, alteration,
                or destruction. However, no transmission over the internet is 100% secure,
                so we cannot guarantee absolute security.
              </p>
            </Section>

            <Section n={12} title="Changes to This Privacy Policy">
              <p>
                We may update this Privacy Policy periodically to reflect changes in our
                practices or legal requirements. We will notify you of any material changes
                by posting the new version on this page with an updated date. Your continued
                use of the website after such changes constitutes your acceptance of the
                revised policy.
              </p>
            </Section>

            <Section n={13} title="Contact Us">
              <p>
                If you have any questions, concerns, or requests regarding this Privacy
                Policy or your personal data, please reach out to us:
              </p>
              <p>
                <span className={strong}>Email:</span>{" "}
                <a href="mailto:finaiw.organisation@gmail.com" className={link}>
                  finaiw.organisation@gmail.com
                </a>
                <br />
                <span className={strong}>Location:</span> Mumbai, India
              </p>
            </Section>
          </div>

          <div className="mt-10 border-t border-[#111814]/10 pt-6 text-[12px] leading-5 text-[#111814]/45 dark:border-[#eef1ec]/10 dark:text-[#eef1ec]/45">
            <p>
              <span className="font-semibold text-[#111814]/65 dark:text-[#eef1ec]/65">Governing Law:</span> This
              Privacy Policy is governed by the laws of India, without regard to its
              conflict of law provisions. Any disputes arising under this policy shall
              be subject to the exclusive jurisdiction of the courts in India.
            </p>
            <p className="mt-2">
              <span className="font-semibold text-[#111814]/65 dark:text-[#eef1ec]/65">International Users:</span>{" "}
              While our services are accessible globally, our data processing activities
              are primarily conducted in India. We strive to meet international standards,
              but please be aware that your data may be subject to Indian legal requirements.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
