import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";

const link = "text-[#047857] underline decoration-[#047857]/30 underline-offset-2 hover:decoration-[#047857] dark:text-[#34d399] dark:decoration-[#34d399]/30 dark:hover:decoration-[#34d399]";
const strong = "font-semibold text-[#111814] dark:text-[#eef1ec]";
const list = "list-disc space-y-2 pl-5 marker:text-[#111814]/25 dark:marker:text-[#eef1ec]/25";

function Section({ title, children }) {
  return (
    <div className="border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10">
      <h2 className="font-display text-[19px] font-extrabold tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec]">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[14px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
        {children}
      </div>
    </div>
  );
}

export default function DisclaimerPage() {
  return (
    <>
      <Seo
        title="Disclaimer – FINAIW"
        description="Read the FINAIW disclaimer. Learn about our educational content, AI-generated insights, financial calculators, and limitations of liability."
        path="/disclaimer"
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Disclaimer", path: "/disclaimer" },
        ])}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-[760px] px-5 py-16 sm:px-8 lg:px-12">
          <p className="text-[13px] font-semibold text-[#111814]/45 dark:text-[#eef1ec]/45">
            FINAIW — Financial Intelligence, AI for Wealth
          </p>
          <h1 className="font-display mt-2 text-[34px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[42px]">
            Disclaimer
          </h1>
          <p className="mt-3 font-mono-tech text-[13px] tabular-nums text-[#111814]/45 dark:text-[#eef1ec]/45">
            Last updated: June 21, 2026
          </p>

          <div className="mt-10 space-y-10">
            <Section title="General Information">
              <p>
                The information provided on FINAIW — Financial Intelligence, AI for Wealth (the "Website") is for
                <span className={strong}> educational and informational purposes</span> only.
                It is not intended to be a substitute for professional financial advice,
                investment guidance, tax consultation, or legal counsel.
              </p>
              <p>
                While we strive to keep the information accurate and up‑to‑date,
                we make no representations or warranties of any kind, express or implied,
                about the completeness, accuracy, reliability, suitability, or availability
                with respect to the Website or the information, products, services, or
                related graphics contained on the Website for any purpose.
              </p>
            </Section>

            <Section title="No Financial Advice">
              <p>
                FINAIW does not provide personalised financial, investment, tax,
                or legal advice. The content and calculators on this site are
                <span className={strong}> for illustrative and educational purposes only</span>.
              </p>
              <p>
                Any reliance you place on such information is strictly at your own risk.
                Before making any financial decisions, you should consult a qualified
                financial advisor or other appropriate professional who understands your
                personal financial situation.
              </p>
            </Section>

            <Section title="AI-Generated Content">
              <p>
                FINAIW utilises artificial intelligence to generate financial insights,
                summaries, and educational content. While we strive for accuracy and
                relevance, AI-generated content is
                <span className={strong}> not a substitute for professional human judgment</span>.
              </p>
              <p>You acknowledge and agree that:</p>
              <ul className={list}>
                <li>
                  AI-generated content may contain errors, omissions, or outdated information.
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
            </Section>

            <Section title="Calculator Tools">
              <p>
                All calculators provided on FINAIW are designed to give you an
                <span className={strong}> estimate based on the inputs you provide</span>.
                They do not guarantee actual returns, future performance, or any specific
                financial outcome.
              </p>
              <ul className={list}>
                <li>
                  <span className={strong}>Investment calculators</span> assume fixed rates of return,
                  which are not guaranteed in real markets.
                </li>
                <li>
                  <span className={strong}>Loan calculators</span> provide approximate EMIs and are
                  not official loan offers.
                </li>
                <li>
                  <span className={strong}>Tax calculators</span> are estimates and should be verified
                  with a tax professional.
                </li>
                <li>
                  <span className={strong}>Retirement projections</span> are based on assumptions
                  that may not reflect actual market conditions.
                </li>
              </ul>
              <p>
                You are strongly advised to verify all calculations and assumptions
                with a qualified professional before making any financial commitments.
              </p>
            </Section>

            <Section title="No Guarantees or Warranties">
              <p>
                FINAIW makes no guarantees regarding the accuracy, completeness,
                or timeliness of the information provided. The Website and its content
                are provided "as is" without any warranties of any kind, either express
                or implied.
              </p>
              <p>
                We do not warrant that the Website will be uninterrupted, error‑free,
                or free of viruses or other harmful components.
              </p>
            </Section>

            <Section title="External Links">
              <p>
                Our Website may contain links to third‑party websites or services that
                are not owned or controlled by FINAIW. We have no control over,
                and assume no responsibility for, the content, privacy policies, or
                practices of any third‑party websites.
              </p>
              <p>
                The inclusion of any external link does not imply endorsement, approval,
                or recommendation by FINAIW. You acknowledge and agree that
                FINAIW shall not be responsible or liable, directly or indirectly,
                for any damage or loss caused or alleged to be caused by or in connection
                with use of or reliance on any such content, goods, or services available
                on or through any such third‑party websites.
              </p>
            </Section>

            <Section title="Advertising">
              <p>
                FINAIW is currently free and ad-supported, and may display advertising
                through Google AdSense — but only for visitors who accept advertising
                cookies in the cookie banner. FINAIW does not currently participate in
                any affiliate marketing programs; if this changes in the future, this
                page will be updated to disclose it.
              </p>
            </Section>

            <Section title="Limitation of Liability">
              <p>
                To the fullest extent permitted by applicable law, FINAIW
                and its owners, employees, agents, and affiliates shall not be liable
                for any direct, indirect, incidental, special, consequential, or
                punitive damages arising out of or in any way connected with your
                use of the Website or its content.
              </p>
              <p>
                This includes, but is not limited to, any financial loss, damage to
                reputation, or loss of data resulting from the use of the Website,
                even if advised of the possibility of such damages.
              </p>
            </Section>

            <Section title="Your Responsibility">
              <p>
                By using FINAIW, you accept full responsibility for your
                financial decisions. You agree to conduct your own research and
                consult with qualified professionals before acting on any information
                or estimates provided by this Website.
              </p>
              <p>
                You also agree not to hold FINAIW liable for any decisions
                you make based on the information provided.
              </p>
            </Section>

            <Section title="Governing Law">
              <p>
                These terms and your use of FINAIW shall be governed by and
                construed in accordance with the laws of India, without regard to
                its conflict of law provisions.
              </p>
            </Section>

            <Section title="Changes to This Disclaimer">
              <p>
                We reserve the right to update or change this Disclaimer at any time.
                Any changes will be effective immediately upon posting the updated
                version on this page. Your continued use of the Website after any
                changes constitutes your acceptance of the updated Disclaimer.
              </p>
              <p>
                We encourage you to review this page periodically to stay informed
                about how we are protecting your rights and limiting our liability.
              </p>
            </Section>

            <Section title="Contact Us">
              <p>
                If you have any questions about this Disclaimer, please contact us at:
              </p>
              <p>
                <a href="mailto:finaiw.organisation@gmail.com" className={`${link} font-semibold`}>
                  finaiw.organisation@gmail.com
                </a>
              </p>
              <p className="text-[12.5px] text-[#111814]/45 dark:text-[#eef1ec]/45">
                (This email is for informational purposes and does not constitute financial advice.)
              </p>
            </Section>
          </div>

          <div className="mt-10 border-t border-[#111814]/10 pt-6 text-[12px] leading-5 text-[#111814]/45 dark:border-[#eef1ec]/10 dark:text-[#eef1ec]/45">
            <p>
              <span className="font-semibold text-[#111814]/65 dark:text-[#eef1ec]/65">Important:</span> Nothing on this website
              should be construed as an offer, solicitation, or recommendation to buy or sell
              any security or financial product. Always consult with a licensed financial
              advisor before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
