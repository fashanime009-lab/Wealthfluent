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

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-[760px] px-5 py-16 sm:px-8 lg:px-12">
          <p className="text-[13px] font-semibold text-[#111814]/60 dark:text-[#eef1ec]/50">
            FINAIW — Financial Intelligence, AI for Wealth
          </p>
          <h1 className="font-display mt-2 text-[34px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[42px]">
            Terms of Service
          </h1>
          <p className="mt-3 font-mono-tech text-[13px] tabular-nums text-[#111814]/60 dark:text-[#eef1ec]/50">
            Last updated: September 6, {currentYear}
          </p>

          <div className="mt-10 space-y-3 text-[14px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
            <p>
              These Terms of Service ("Terms") govern your access to and use of FINAIW
              (the "Website," "we," "us," or "our"), available at finaiw.com. By using the
              Website, you agree to be bound by these Terms. If you do not agree, please do
              not use the Website.
            </p>
          </div>

          <div className="mt-10 space-y-10">
            <Section n={1} title="The Service">
              <p>
                FINAIW provides free financial calculators, planning tools, educational
                content, and related features. No account or signup is required to use the
                calculators — your inputs and results are processed and stored only in your
                own browser, never on our servers.
              </p>
              <p>
                We may add, change, or remove features, calculators, or content at any time,
                and we may display advertising to keep the Website free — see our{" "}
                <Link to="/disclaimer" className={link}>
                  Disclaimer
                </Link>{" "}
                for details on advertising and cookies.
              </p>
            </Section>

            <Section n={2} title="Not Financial, Legal, or Tax Advice">
              <p>
                Every calculator, tool, and piece of content on FINAIW is provided for
                educational and illustrative purposes only. Nothing on this Website
                constitutes financial, investment, tax, or legal advice, and using the
                Website does not create an advisor-client relationship of any kind. Always
                consult a qualified professional before making financial decisions — see our{" "}
                <Link to="/disclaimer" className={link}>
                  Disclaimer
                </Link>{" "}
                for the full details.
              </p>
            </Section>

            <Section n={3} title="Acceptable Use">
              <p>When using FINAIW, you agree not to:</p>
              <ul className={list}>
                <li>Use the Website for any unlawful purpose or in violation of any applicable law.</li>
                <li>Attempt to gain unauthorized access to any part of the Website, its systems, or data of other users.</li>
                <li>Interfere with or disrupt the Website's functioning, including through automated scraping, bots, or excessive requests.</li>
                <li>Copy, reproduce, or redistribute the Website's content, calculators, or design for commercial purposes without our written permission.</li>
                <li>Submit false, misleading, or malicious content through our contact, feedback, or newsletter forms.</li>
              </ul>
            </Section>

            <Section n={4} title="Intellectual Property">
              <p>
                The Website's design, layout, calculators, original written content, and
                branding are owned by FINAIW unless otherwise noted. You may use the
                calculators and read the content for your own personal, non-commercial use.
                You may not copy, modify, or redistribute the underlying code, design, or
                content without permission.
              </p>
            </Section>

            <Section n={5} title="Third-Party Services and Links">
              <p>
                The Website may use third-party services (such as Google AdSense for
                advertising) and may link to external websites. We do not control and are
                not responsible for the content, accuracy, or practices of any third-party
                service or site. Your use of any third-party service is subject to that
                service's own terms and privacy policy.
              </p>
            </Section>

            <Section n={6} title="Availability and Changes">
              <p>
                We aim to keep FINAIW available and accurate, but we do not guarantee the
                Website will be uninterrupted, error-free, or available at all times. We may
                suspend, restrict, or discontinue any part of the Website without notice.
              </p>
            </Section>

            <Section n={7} title="Limitation of Liability">
              <p>
                To the fullest extent permitted by law, FINAIW and its owners are not liable
                for any direct, indirect, incidental, or consequential damages arising from
                your use of, or inability to use, the Website — including any financial
                decisions made based on its calculators or content. See our{" "}
                <Link to="/disclaimer" className={link}>
                  Disclaimer
                </Link>{" "}
                for the complete limitation of liability terms.
              </p>
            </Section>

            <Section n={8} title="Changes to These Terms">
              <p>
                We may update these Terms from time to time. Material changes will be
                reflected by an updated "Last Updated" date at the top of this page. Your
                continued use of the Website after changes are posted constitutes your
                acceptance of the revised Terms.
              </p>
            </Section>

            <Section n={9} title="Governing Law">
              <p>
                These Terms are governed by the laws of India, without regard to its
                conflict of law provisions. Any disputes arising under these Terms shall be
                subject to the exclusive jurisdiction of the courts in India.
              </p>
            </Section>

            <Section n={10} title="Contact Us">
              <p>
                If you have any questions about these Terms, please reach out to us:
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
        </div>
      </div>
    </>
  );
}
