import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema, howToSchema } from "@/components/seo/schema";
import { formatCurrency } from "../utils/currency";
import { useSettings } from "../context/SettingsContext";
import useDefaultableField, { useFieldBounds } from "@/hooks/useDefaultableField";
import { defaultFor } from "@/data/calculatorDefaults";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

// Shared by the worked examples in the body copy below, mirroring the live
// calculator's own reducing-balance formula so the figures render in
// whichever currency formatCurrency() is given.
function emiOf(principal, annualRate, years) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  return Math.round(r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}

// Interest, principal and closing balance for each year of a loan repaid
// with a fixed EMI. The EMI is rounded to a whole unit, which leaves a few
// units unpaid at the end; the last year clears them so the table ends at 0.
function amortizeByYear(principal, annualRate, years, emi) {
  const r = annualRate / 12 / 100;
  let balance = principal;
  const rows = [];
  for (let year = 1; year <= years; year++) {
    let interest = 0;
    let principalPaid = 0;
    for (let m = 0; m < 12 && balance > 0; m++) {
      const i = balance * r;
      const p = Math.min(emi - i, balance);
      interest += i;
      principalPaid += p;
      balance -= p;
    }
    if (year === years) {
      principalPaid += balance;
      balance = 0;
    }
    rows.push({ year, interest, principal: principalPaid, balance });
  }
  return rows;
}

// Months to repay, and total interest, when `prepay` is paid on top of the
// EMI after month `afterMonth` and the EMI stays the same.
function repayWithPrepayment(principal, annualRate, emi, prepay, afterMonth) {
  const r = annualRate / 12 / 100;
  let balance = principal;
  let interest = 0;
  let months = 0;
  while (balance > 0.5 && months < 1200) {
    const i = balance * r;
    balance -= Math.min(emi - i, balance);
    interest += i;
    months += 1;
    if (months === afterMonth) balance -= prepay;
  }
  return { months, interest };
}

const roundTo = (value, step) => Math.round(value / step) * step;

function yearsAndMonths(totalMonths) {
  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  const parts = [];
  if (y) parts.push(`${y} year${y === 1 ? "" : "s"}`);
  if (m) parts.push(`${m} month${m === 1 ? "" : "s"}`);
  return parts.join(" and ") || "0 months";
}

const tableHead = "border-b border-[#111814]/15 text-[#111814] dark:border-[#eef1ec]/15 dark:text-[#eef1ec]";
const tableRow = "border-b border-[#111814]/10 dark:border-[#eef1ec]/10";
const strong = "text-[#111814] dark:text-[#eef1ec]";
const inlineLink =
  "font-semibold text-[#047857] underline decoration-[#047857]/30 underline-offset-4 dark:text-[#34d399] dark:decoration-[#34d399]/30";

// Three questions whose answers use the page's worked example, so they're
// built per currency like the body copy.
function exampleFaqItems({ fmt, principal, rate, years, emi }) {
  const incomeLow = roundTo(emi / 0.4, 1000);
  const incomeHigh = roundTo(emi / 0.35, 1000);
  return [
    {
      q: `How much salary do I need for a ${fmt(principal)} home loan?`,
      a: `It depends on the rate and tenure, because those set the EMI. At ${rate}% over ${years} years, a ${fmt(principal)} loan has an EMI of about ${fmt(emi)}. Lenders set their own limit on how much of your take-home pay can go to EMIs, and keeping all your EMIs to 35–40% of it leaves room to save. On that basis, this EMI needs a take-home income of roughly ${fmt(incomeLow)} to ${fmt(incomeHigh)} a month, and more if you already pay other EMIs.`,
    },
    {
      q: "What happens if I miss an EMI payment?",
      a: "The lender charges a late-payment or bounce fee, usually with GST on top; in India these must be levied as penal charges, not as a higher interest rate. The missed payment is reported to the credit bureaus as overdue, which can lower your credit score and stays in your repayment history. If a loan stays unpaid for more than 90 days, it's classed as a non-performing asset and the lender can start recovery. If you expect to miss a payment, talk to your lender before the due date.",
    },
    {
      q: "Should I prepay my loan or invest the extra money?",
      a: "Compare the loan's interest rate with the return you can realistically expect after tax. Prepaying earns a guaranteed return equal to the loan rate, so it usually wins for expensive debt like personal loans and credit cards. For a cheaper loan, such as a home loan, investing for the long term may come out ahead, but with more risk. Keep an emergency fund either way. The Debt vs Invest verdict on this site compares both with your own numbers.",
    },
  ];
}

const FAQ_ITEMS = [
  { q: "How is EMI calculated?", a: "EMI depends on loan amount, interest rate, and repayment duration using standard amortization formulas." },
  { q: "What is the difference between a flat rate and a reducing-balance rate?", a: "A flat rate charges interest on the original loan amount for the whole tenure, while a reducing-balance rate charges it only on what you still owe. A flat rate therefore costs much more than the same number quoted as a reducing rate — often close to double once converted. This calculator uses the reducing-balance method that home and most bank loans use, so ask a lender to state its rate on that basis before you compare offers." },
  { q: "Does longer loan tenure reduce EMI?", a: "Longer tenure generally reduces monthly EMI but may increase total interest paid." },
  { q: "Which loan has lowest EMI?", a: "Lower EMIs depend on lower interest rates, smaller loan amounts, and longer repayment periods." },
  { q: "Does prepaying a loan reduce EMI or tenure?", a: "Most lenders let you choose: reduce the tenure while keeping the EMI the same (saves the most total interest), or reduce the EMI while keeping the original tenure. Shortening the tenure is usually the better move if you can afford the current EMI." },
  { q: "Is a fixed or floating interest rate better for EMI?", a: "Fixed rates keep your EMI unchanged for the loan's life but are usually priced higher upfront. Floating rates track a benchmark and can rise or fall, which changes your EMI (or tenure) over time — most long-tenure loans like home loans are floating." },
];

export default function EMICalculatorPage() {
  const [loanAmount, setLoanAmount] = useDefaultableField("emi", "loan");
  const [interestRate, setInterestRate] = useDefaultableField("emi", "rate");
  const [loanYears, setLoanYears] = useDefaultableField("emi", "years");
  const loanBounds = useFieldBounds("emi", "loan");
  const rateBounds = useFieldBounds("emi", "rate");
  const yearsBounds = useFieldBounds("emi", "years");

  const { settings } = useSettings();
  const currency = settings.currency;
  const fmt = (v) => formatCurrency(v, currency);

  const monthlyRate = interestRate / 12 / 100;
  const months = loanYears * 12;

  // A 0% loan (an interest-free EMI offer) makes the standard formula 0/0.
  // The limit as the rate reaches zero is simply principal / months.
  const emi = Math.round(
    monthlyRate === 0
      ? loanAmount / months
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1)
  );

  const totalPayment = emi * months;
  const totalInterest = totalPayment - loanAmount;
  const principalShare = totalPayment > 0 ? (loanAmount / totalPayment) * 100 : 0;
  const interestShare = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  // Fixed worked examples for the body copy below, independent of the live
  // inputs above — but using the same mortgage-scale default and rate as
  // this page's own currency-aware starting values, so the written example
  // always matches what's actually prefilled above it.
  const examplePrincipal = defaultFor("emi", "loan", currency);
  const exampleRate = defaultFor("emi", "rate", currency);
  const exampleEmi5yr = emiOf(examplePrincipal, exampleRate, 5);
  const exampleEmi3yr = emiOf(examplePrincipal, exampleRate, 3);
  const exampleEmi7yr = emiOf(examplePrincipal, exampleRate, 7);
  const exampleEmi10yr = emiOf(examplePrincipal, exampleRate, 10);
  const exampleInterest3yr = exampleEmi3yr * 36 - examplePrincipal;
  const exampleInterest5yr = exampleEmi5yr * 60 - examplePrincipal;
  const exampleInterest7yr = exampleEmi7yr * 84 - examplePrincipal;
  const exampleInterest10yr = exampleEmi10yr * 120 - examplePrincipal;
  const exampleMonthlyR = (exampleRate / 12 / 100).toFixed(6);
  const emiDropPercent = Math.round((1 - exampleEmi10yr / exampleEmi5yr) * 100);
  const interestRatio = exampleInterest10yr / exampleInterest5yr;

  // Tenure table: the common tenures, plus this currency's default tenure.
  const exampleYears = defaultFor("emi", "years", currency);
  const tenureRows = [...new Set([3, 5, 7, 10, 20, exampleYears])]
    .sort((a, b) => a - b)
    .map((years) => {
      const e = emiOf(examplePrincipal, exampleRate, years);
      return { years, emi: e, interest: e * years * 12 - examplePrincipal, total: e * years * 12 };
    });

  // Amortization of the default example loan, shown at milestone years.
  const exampleEmi = emiOf(examplePrincipal, exampleRate, exampleYears);
  const schedule = amortizeByYear(examplePrincipal, exampleRate, exampleYears, exampleEmi);
  const milestoneRows = schedule.filter((row) => row.year === 1 || row.year % 5 === 0 || row.year === exampleYears);
  const year1 = schedule[0];
  const balanceAfter10 = schedule[Math.min(10, exampleYears) - 1].balance;
  const owedAfter10Percent = Math.round((balanceAfter10 / examplePrincipal) * 100);
  const halfwayYear = schedule.find((row) => row.principal > row.interest)?.year;

  // One prepayment of 5% of the loan at the end of year 1, EMI unchanged.
  const prepayAmount = examplePrincipal * 0.05;
  const withPrepay = repayWithPrepayment(examplePrincipal, exampleRate, exampleEmi, prepayAmount, 12);
  const prepayMonthsSaved = exampleYears * 12 - withPrepay.months;
  const withoutPrepay = repayWithPrepayment(examplePrincipal, exampleRate, exampleEmi, 0, 12);
  const prepayInterestSaved = withoutPrepay.interest - withPrepay.interest;

  const faqItems = [
    ...FAQ_ITEMS,
    ...exampleFaqItems({ fmt, principal: examplePrincipal, rate: exampleRate, years: exampleYears, emi: exampleEmi }),
  ];

  return (
    <>
      <Seo
        title="EMI Calculator – Home, Car & Personal Loan Payments"
        description="Work out your monthly EMI, total interest and total repayment for a home, car, personal or education loan. See how tenure and rate change the cost. Free."
        path="/emi-calculator"
        keywords="EMI calculator, loan EMI calculator, home loan EMI calculator, personal loan EMI, car loan EMI, EMI formula"
        jsonLd={[
          calculatorSchema({
            name: "Loan EMI Calculator",
            description: "Work out your monthly EMI, total interest and total repayment for a home, car, personal or education loan. See how tenure and rate change the cost. Free.",
            path: "/emi-calculator",
          }),
          faqSchema(faqItems.map((f) => ({ question: f.q, answer: f.a }))),
          howToSchema({
            name: "How to Use the Loan EMI Calculator",
            description: "Work out your monthly EMI, total interest and total repayment for a home, car, personal or education loan.",
            steps: [
              { name: "Enter the loan amount", text: "Enter the amount you plan to borrow in the Loan amount field." },
              { name: "Enter the interest rate", text: "Enter the annual interest rate as a percentage in the Interest rate field." },
              { name: "Enter the loan duration", text: "Enter the repayment period in years in the Loan duration field." },
              { name: "View your result instantly", text: "The calculator instantly shows your monthly EMI, total interest and total payment." },
            ],
          }),
        ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Loan & interest"
            title="Loan EMI Calculator"
            description="Calculate monthly EMI payments for home loans, personal loans, car loans, and other financing options instantly."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Loan amount" value={loanAmount} onChange={setLoanAmount} {...loanBounds} format={fmt} />
              <CalcField label="Interest rate (p.a.)" value={interestRate} onChange={setInterestRate} {...rateBounds} suffix="%" hint="Sample value. Enter your own." />
              <CalcField label="Loan duration" value={loanYears} onChange={setLoanYears} {...yearsBounds} suffix=" yrs" />
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="Monthly EMI" value={fmt(emi)} />
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Principal amount" value={fmt(loanAmount)} share={principalShare} tone="signal" />
                <CalcStat label="Total interest" value={fmt(totalInterest)} share={interestShare} />
                <CalcStat label="Total payment" value={fmt(totalPayment)} share={100} />
              </div>
              <p className="text-[13.5px] leading-6 text-[#111814]/75 dark:text-[#eef1ec]/75">
                Have spare cash? See whether prepaying this loan or investing the money comes out ahead:{" "}
                <Link to="/verdict/debt-vs-invest" className={inlineLink}>
                  Run the Debt vs Invest verdict →
                </Link>
              </p>
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                These figures are illustrative only and don't represent actual loan terms or guaranteed approvals.
                Interest rates and loan terms vary by lender policy and borrower eligibility.
              </p>
            </div>
          </div>

          <div className="mt-16">

            <CalcSection title="What is a loan EMI calculator?">
              <p>
                An EMI calculator helps borrowers estimate monthly loan repayments based on loan amount, interest
                rate, and repayment duration. It's commonly used for home loans, personal loans, education loans,
                and vehicle financing.
              </p>
              <p>
                EMI stands for Equated Monthly Installment — a fixed payment amount a borrower makes to a lender at
                a specified date each month. Every EMI splits into two parts: interest (the lender's charge for
                lending the money) and principal (the actual loan amount being repaid). In the early years of a
                loan, a larger share of each EMI goes toward interest; as the loan matures, more of it goes toward
                principal, even though the EMI amount itself stays constant throughout the tenure.
              </p>
            </CalcSection>

            <CalcSection title="How is EMI calculated?">
              <p>EMI is calculated using the standard reducing-balance formula:</p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                EMI = [P × R × (1 + R)^N] / [(1 + R)^N − 1]
              </p>
              <p>
                Here, <strong className="text-[#111814] dark:text-[#eef1ec]">P</strong> is the principal loan
                amount, <strong className="text-[#111814] dark:text-[#eef1ec]">R</strong> is the monthly interest
                rate (annual rate divided by 12, then by 100), and{" "}
                <strong className="text-[#111814] dark:text-[#eef1ec]">N</strong> is the total number of monthly
                installments (loan tenure in years × 12). For example, a {fmt(examplePrincipal)} loan at {exampleRate}% annual interest over
                5 years has R = {exampleMonthlyR} and N = 60, which works out to an EMI of roughly {fmt(exampleEmi5yr)}/month — the same
                figure the calculator above produces for those inputs.
              </p>
            </CalcSection>

            <CalcSection title="EMI example: how tenure changes what you pay">
              <p>
                On a {fmt(examplePrincipal)} loan at {exampleRate}%, the EMI is about {fmt(exampleEmi3yr)} over 3 years, {fmt(exampleEmi5yr)} over 5 years,{" "}
                {fmt(exampleEmi7yr)} over 7 years and {fmt(exampleEmi10yr)} over 10 years. The total interest paid moves the other way: roughly{" "}
                {fmt(exampleInterest3yr)}, {fmt(exampleInterest5yr)}, {fmt(exampleInterest7yr)} and {fmt(exampleInterest10yr)}. Stretching a loan from 5 to 10 years lowers the monthly
                burden by about {emiDropPercent}% but{" "}
                {interestRatio >= 2 ? "more than doubles the interest" : `raises the interest by about ${Math.round((interestRatio - 1) * 100)}%`}.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-[13px]">
                  <caption className="pb-2 text-left text-[12.5px] text-[#111814]/60 dark:text-[#eef1ec]/55">
                    {fmt(examplePrincipal)} at {exampleRate}% a year, by tenure
                  </caption>
                  <thead>
                    <tr className={tableHead}>
                      <th className="py-2 pr-4 font-semibold">Tenure</th>
                      <th className="py-2 pr-4 font-semibold">Monthly EMI</th>
                      <th className="py-2 pr-4 font-semibold">Total interest</th>
                      <th className="py-2 font-semibold">Total repaid</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono-tech tabular-nums">
                    {tenureRows.map((row) => (
                      <tr key={row.years} className={tableRow}>
                        <td className={`py-2 pr-4 font-sans font-semibold ${strong}`}>{row.years} years</td>
                        <td className="py-2 pr-4">{fmt(row.emi)}</td>
                        <td className="py-2 pr-4">{fmt(row.interest)}</td>
                        <td className="py-2">{fmt(row.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                That is the trade-off to weigh before you borrow: a longer tenure makes the EMI comfortable, a
                shorter one makes the loan cheaper. A common rule of thumb is to keep your EMIs at 30–40% of
                monthly income or less, and the{" "}
                <Link to="/home-affordability-calculator" className={inlineLink}>
                  Home Affordability Calculator
                </Link>{" "}
                tests a property against exactly that. For EMIs on other loan amounts and rates, see{" "}
                <Link to="/blog/emi-for-every-loan-amount" className={inlineLink}>
                  EMI for every loan amount
                </Link>
                .
              </p>
            </CalcSection>

            <CalcSection title="Year-by-year: how much of your EMI is interest">
              <p>
                Your EMI stays the same every month, but what it pays for changes. Interest is charged on what you
                still owe, so early on most of each EMI goes to interest. On a {fmt(examplePrincipal)} loan at{" "}
                {exampleRate}% over {exampleYears} years, the EMI is {fmt(exampleEmi)}. In year 1 you pay{" "}
                {fmt(exampleEmi * 12)} in total: <strong className={strong}>{fmt(year1.interest)}</strong> is interest
                and only <strong className={strong}>{fmt(year1.principal)}</strong> reduces the loan.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-[13px]">
                  <caption className="pb-2 text-left text-[12.5px] text-[#111814]/60 dark:text-[#eef1ec]/55">
                    {fmt(examplePrincipal)} at {exampleRate}% over {exampleYears} years: EMI {fmt(exampleEmi)}
                  </caption>
                  <thead>
                    <tr className={tableHead}>
                      <th className="py-2 pr-4 font-semibold">Year</th>
                      <th className="py-2 pr-4 font-semibold">Interest paid</th>
                      <th className="py-2 pr-4 font-semibold">Principal repaid</th>
                      <th className="py-2 font-semibold">Still owed at year end</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono-tech tabular-nums">
                    {milestoneRows.map((row) => (
                      <tr key={row.year} className={tableRow}>
                        <td className={`py-2 pr-4 font-sans font-semibold ${strong}`}>Year {row.year}</td>
                        <td className="py-2 pr-4">{fmt(row.interest)}</td>
                        <td className="py-2 pr-4">{fmt(row.principal)}</td>
                        <td className="py-2">{fmt(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                {exampleYears > 10 && (
                  <>
                    After 10 years of payments, you still owe {fmt(balanceAfter10)}, about {owedAfter10Percent}% of the
                    original loan.{" "}
                  </>
                )}
                {halfwayYear && halfwayYear > 1 && (
                  <>Principal only overtakes interest in year {halfwayYear}. </>
                )}
                That's why prepaying early saves so much: every extra payment cuts the balance directly, and the
                interest that balance would have charged for the rest of the loan disappears with it.
              </p>
              <p>
                For example, paying an extra {fmt(prepayAmount)} once, at the end of year 1, and keeping the same
                EMI, clears this loan <strong className={strong}>{yearsAndMonths(prepayMonthsSaved)}</strong> early
                and saves about <strong className={strong}>{fmt(roundTo(prepayInterestSaved, 1000))}</strong> in
                interest. Most lenders let you choose between a shorter tenure and a lower EMI after a prepayment;
                a shorter tenure saves more.
              </p>
            </CalcSection>

            <CalcSection title="Typical rates and tenures by loan type in India">
              <p>
                One EMI calculator works for every loan, but the rate and tenure you should test differ a lot by
                loan type. These are typical ranges at Indian banks, checked in November 2026. Your rate depends on
                your credit score, income and lender, and floating rates move with the RBI's repo rate.
              </p>
              <ul className="list-disc space-y-3 pl-5">
                <li>
                  <strong className={strong}>Home loans:</strong> roughly 7.5% to 9.5% a year for most borrowers,
                  over 15 to 30 years. Most are floating-rate, so your EMI or tenure changes when rates move.
                  Lenders can't charge a prepayment or foreclosure penalty on a floating-rate loan an individual
                  takes for personal use, which makes prepaying a home loan easy.
                </li>
                <li>
                  <strong className={strong}>Car loans:</strong> roughly 7.5% to 9% a year at most banks for new
                  cars, and higher for used cars or weaker credit, usually over 3 to 7 years. A car loses value
                  every year, so stretching the loan past about five years can leave you owing more than the car is
                  worth.
                </li>
                <li>
                  <strong className={strong}>Personal loans:</strong> from about 10% a year at banks for strong
                  profiles, and often 16% to 24% for others, over 1 to 5 years. Many are fixed-rate, so check the
                  foreclosure charges before you sign: they're usually a percentage of the amount you prepay.
                </li>
              </ul>
            </CalcSection>

            <CalcSection title="Costs beyond the EMI">
              <p>
                The EMI formula only covers the loan amount and interest. Before you compare offers, ask for these
                too, because they change what the loan really costs:
              </p>
              <ul className="list-disc space-y-3 pl-5">
                <li>
                  <strong className={strong}>Processing fee:</strong> a flat fee or a percentage of the loan,
                  usually deducted from the amount you receive. Home loan fees tend to be small; some car and
                  personal loans charge up to about 2% of the loan.
                </li>
                <li>
                  <strong className={strong}>Legal, valuation and stamp duty charges:</strong> home loans add
                  legal and technical checks on the property, and stamp duty on the loan documents, which varies by
                  state.
                </li>
                <li>
                  <strong className={strong}>Bundled loan insurance:</strong> lenders often offer a loan-protection
                  policy and add its one-time premium to the loan. You then pay interest on that premium for the
                  whole tenure, which quietly raises your EMI. It's usually optional, so ask for a quote without it
                  and compare it with a term insurance plan.
                </li>
                <li>
                  <strong className={strong}>GST:</strong> 18% GST applies to fees such as processing, foreclosure
                  and late-payment charges. On a personal or home loan there's no GST on the interest itself, but on
                  a credit card EMI, GST is charged on the interest part of every instalment.
                </li>
                <li>
                  <strong className={strong}>Late-payment and bounce charges:</strong> a missed or failed EMI costs
                  a fee plus GST, and is reported to the credit bureaus.
                </li>
              </ul>
            </CalcSection>

            <CalcSection title="Benefits of EMI calculation">
              <CalcBenefitGrid
                items={[
                  { title: "Better budget planning", text: "EMI calculators help estimate monthly repayment obligations before taking a loan." },
                  { title: "Loan comparison", text: "Borrowers can compare different loan amounts, durations, and interest rates easily." },
                  { title: "Financial clarity", text: "EMI estimation helps avoid unexpected repayment burdens." },
                  { title: "Smarter borrowing", text: "Users can choose more manageable repayment structures." },
                ]}
              />
            </CalcSection>

            <RelatedLinks />

            <VerdictFAQ items={faqItems} className="border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10" />
          </div>
        </div>
      </div>
    </>
  );
}
