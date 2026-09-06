export const LESSONS = [
  {
    slug: "compound-interest",
    title: "Compound Interest",
    category: "Core Skill",
    readTime: "4 min",
    summary: "Understand how time, consistency and returns interact — the single most important idea in personal finance.",
    body: [
      "Compound interest is what happens when the returns you earn start earning their own returns. Put ₹10,000 into an investment earning 10% a year, and after one year you have ₹11,000. But in year two, you're not earning 10% on ₹10,000 anymore — you're earning it on ₹11,000. The gap between simple and compound growth looks small at first and enormous later.",
      "This is why the order of your investing decisions matters less than the number of years you stay invested. ₹5,000 invested monthly for 30 years at 12% annual return grows to roughly ₹1.76 crore. Wait just 10 years to start, and investing the same amount for 20 years only gets you to about ₹50 lakh — less than a third, despite investing for two-thirds as many years.",
      "The practical takeaway: the biggest lever you control isn't picking the perfect investment — it's starting now instead of later. A mediocre investment started today usually beats a great investment started in five years.",
      "Compounding cuts both ways, though. Debt compounds too. A credit card balance at 36% annual interest grows just as relentlessly as an investment, which is exactly why paying off high-interest debt is often the single highest-return move available to you — see the Pay Off Debt vs Invest tool for the real math on your own numbers.",
    ],
    relatedTool: { label: "Try the SIP Calculator", to: "/sip-calculator" },
  },
  {
    slug: "investment-basics",
    title: "Investment Basics",
    category: "Beginner",
    readTime: "5 min",
    summary: "Learn the foundations before choosing financial products — what actually differentiates one investment from another.",
    body: [
      "Every investment can be understood along three dimensions: expected return, risk, and liquidity. Higher expected returns generally come with higher risk (the chance you lose money) or lower liquidity (how quickly you can access your cash without a penalty). There's no investment that maximizes all three — every choice is a trade-off.",
      "Fixed deposits sit at one end: low risk, high liquidity (with some penalty for early withdrawal), but modest returns that often barely beat inflation after tax. Equity mutual funds sit further along: higher expected long-term returns, but real short-term volatility — a fund can drop 20-30% in a bad year, even if it averages 12% over a decade.",
      "The mistake most new investors make isn't picking a 'bad' investment — it's mismatching the investment to the time horizon. Money you need in 12 months has no business in equities; a market downturn right before you need the cash can be devastating. Money you won't touch for 10+ years is often too conservative sitting only in fixed deposits, where inflation quietly erodes its real value.",
      "A simple starting framework: money needed within 2 years goes in savings accounts or short-term fixed deposits. Money needed in 2-5 years goes in a mix of debt funds and conservative hybrid funds. Money you won't need for 5+ years can reasonably hold meaningful equity exposure, since you have time to ride out volatility.",
    ],
    relatedTool: { label: "Try the FD Calculator", to: "/fd-calculator" },
  },
  {
    slug: "retirement-planning",
    title: "Retirement Planning",
    category: "Planning",
    readTime: "5 min",
    summary: "Turn a distant, abstract goal into a practical, numbers-based savings system.",
    body: [
      "Retirement planning fails most often not because people invest badly, but because they never turn 'I should save for retirement' into an actual number. The first real step is estimating your future monthly expenses — not your current ones. If you spend ₹50,000/month today and retire in 25 years, at 6% inflation that same lifestyle costs roughly ₹2.15 lakh/month by the time you get there.",
      "The second step is estimating how long retirement needs to last. With life expectancy rising, a 30-year retirement (say, retiring at 60, living to 90) is a realistic planning assumption, not a pessimistic one. That means your retirement corpus doesn't just need to cover your first year of expenses — it needs to keep growing enough to outpace inflation across three full decades of withdrawals.",
      "Once you have a target corpus, work backward to a monthly SIP. This is where most people are surprised: reaching a ₹4-5 crore retirement corpus is very achievable starting in your late 20s or early 30s with a moderate monthly SIP, but the required monthly amount roughly doubles for every decade you delay starting.",
      "One overlooked detail: your equity allocation should generally decrease as retirement approaches. Money you'll withdraw within the next 3-5 years shouldn't be sitting in volatile equity — a market downturn right before or during early retirement can permanently damage a retirement plan in a way it wouldn't for a 30-year-old with decades to recover.",
    ],
    relatedTool: { label: "Try the Retirement Calculator", to: "/retirement-calculator" },
  },
  {
    slug: "risk-management",
    title: "Risk Management",
    category: "Guide",
    readTime: "4 min",
    summary: "Balance growth, liquidity and downside protection — before you think about returns.",
    body: [
      "Most people think of investment risk as 'how much can I lose,' but that's only half the picture. The other half is 'how much can I afford to lose without derailing my life' — and that depends entirely on your emergency fund, insurance, and debt situation, not your investment picks.",
      "This is why financial advisors insist on building an emergency fund and getting adequate insurance before investing aggressively. Without them, a single bad year — a job loss, a medical emergency — can force you to liquidate investments at the worst possible time, locking in losses that would have recovered if you'd had a cash buffer instead.",
      "Risk also isn't just about the size of a loss, but its timing. A 30% market drop is a rounding error for someone investing for a goal 20 years away — the market has recovered from every historical downturn given enough time. The same drop is catastrophic for someone who needs that money in 8 months.",
      "A practical risk checklist, roughly in order: build 3-6 months of expenses in an emergency fund, get term life insurance if anyone depends on your income, get adequate health insurance, pay off any debt above ~12-15% interest, and only then start allocating meaningfully to market-linked investments for long-term goals.",
    ],
    relatedTool: { label: "Try the Term Insurance Verdict", to: "/verdict/insurance-need" },
  },
  {
    slug: "market-basics",
    title: "Market Basics",
    category: "Markets",
    readTime: "4 min",
    summary: "Read financial headlines with better context instead of reacting to noise.",
    body: [
      "Stock markets move on expectations, not just current facts — which is why a company can report record profits and still see its stock price fall, if investors expected even more. This is the single most common source of confusion for new investors reading financial news.",
      "Short-term price movements are dominated by sentiment, interest rate expectations, and global flows of capital — genuinely difficult to predict consistently, even for professionals. Long-term returns, over 10+ years, are dominated by something much simpler and more predictable: the underlying growth of company earnings and the economy.",
      "This is why 'time in the market' reliably outperforms 'timing the market' for most people. Trying to guess short-term moves means competing with institutional traders who have better information and faster execution than you. Staying invested through cycles means simply capturing the long-term growth trend, which has historically been positive across every major market over sufficiently long periods.",
      "A useful habit: when you read alarming market headlines, ask whether the underlying event actually changes your investment's long-term earning power, or whether it's just short-term noise. Most headlines are noise. Genuine long-term shifts are rarer and usually more obvious in hindsight than they seemed at the time.",
    ],
    relatedTool: { label: "Explore Calculators", to: "/calculators" },
  },
  {
    slug: "emergency-funds",
    title: "Emergency Funds",
    category: "Foundations",
    readTime: "3 min",
    summary: "The unglamorous first step that makes every other financial goal possible.",
    body: [
      "An emergency fund is cash set aside specifically to cover job loss, medical emergencies, or urgent repairs — kept separate from your investments, in something you can access within a day or two without penalty or market risk.",
      "The standard guidance is 3-6 months of essential expenses, though the right number depends on your situation. Someone with a stable government job and no dependents can reasonably lean toward 3 months. A freelancer or single-income household with dependents should lean toward 6-9 months.",
      "The most common mistake is treating investments as an emergency fund substitute. Mutual funds can be sold quickly, but if an emergency coincides with a market downturn — which is exactly when layoffs tend to spike — you're forced to sell at a loss precisely when you can least afford it.",
      "Where to keep it: a high-yield savings account or a liquid/overnight mutual fund, not equity, and not locked in a long-tenure fixed deposit with a heavy early-withdrawal penalty. The goal isn't maximum return here — it's maximum reliability when you need it most.",
    ],
    relatedTool: { label: "Try the Emergency Fund Calculator", to: "/emergency-fund-calculator" },
  },
  {
    slug: "debt-management",
    title: "Debt Management",
    category: "Foundations",
    readTime: "4 min",
    summary: "Not all debt is equal — how to think about which debt to attack first.",
    body: [
      "The single most useful question for any debt is: 'what's the interest rate, and could I reliably beat it by investing instead?' A home loan at 8-9% is often reasonable to pay down slowly while investing surplus cash, because long-term equity returns can realistically exceed that rate. A credit card at 30-40% almost never makes sense to carry while investing elsewhere — no investment reliably beats that.",
      "When you have multiple debts, two common strategies are the avalanche method (pay off the highest interest rate first, mathematically optimal) and the snowball method (pay off the smallest balance first, for psychological momentum). The avalanche method saves more money; the snowball method is easier for many people to actually stick with. The best method is the one you'll actually follow through on.",
      "A detail people miss: minimum payments on high-interest debt are structured so a large share goes to interest, not principal, especially early on. This is why minimum-payment-only credit card debt can take years to clear even on a moderate balance — the effective payoff timeline is often far longer than it looks.",
      "Before taking on new debt, it's worth asking whether it's debt for an appreciating or productive asset (a home, an education with real earning potential) versus debt for a depreciating one (most consumer purchases). The first can be a reasonable tool; the second is usually worth avoiding or minimizing.",
    ],
    relatedTool: { label: "Try the Debt vs Invest Verdict", to: "/verdict/debt-vs-invest" },
  },
  {
    slug: "budgeting-basics",
    title: "Budgeting Basics",
    category: "Foundations",
    readTime: "3 min",
    summary: "A simple, durable framework for where your money should go each month.",
    body: [
      "The 50/30/20 rule is a reasonable starting framework: roughly 50% of take-home income toward needs (rent, groceries, utilities, minimum debt payments), 30% toward wants (dining out, entertainment, subscriptions), and 20% toward savings and extra debt payoff. It's not a rigid law — high cost-of-living areas often push needs above 50% — but it's a useful sanity check.",
      "The more durable habit than any specific ratio is paying yourself first: moving your savings/investment amount out of your account automatically, right when income arrives, rather than saving whatever happens to be left at the end of the month. What's 'left over' at month-end has a strong tendency to be very little, no matter how much you earn.",
      "Tracking expenses for even one month — genuinely writing down or categorizing every rupee spent — is disproportionately useful. Most people significantly underestimate how much goes to a handful of small, frequent categories (food delivery, subscriptions, small impulse purchases) until they actually see the total.",
      "Budgeting isn't about restriction for its own sake. It's about making sure your spending matches what you actually value, rather than drifting by default — and making sure your future goals get funded before your present wants absorb everything.",
    ],
    relatedTool: { label: "Try the SIP Calculator", to: "/sip-calculator" },
  },
  {
    slug: "understanding-inflation",
    title: "Understanding Inflation",
    category: "Core Skill",
    readTime: "4 min",
    summary: "Why the real enemy of long-term savings isn't market crashes — it's quietly rising prices.",
    body: [
      "Inflation is the rate at which prices rise and purchasing power falls. At a modest 6% average inflation, something that costs ₹100 today costs roughly ₹180 in 10 years and ₹320 in 20 years. This is why 'safe' money sitting in a savings account earning 3-4% is actually losing real value every single year — you're growing in rupee terms while shrinking in what those rupees can buy.",
      "This is the entire argument for taking on some investment risk for long-term goals. Fixed deposits at 6-7% barely keep pace with inflation before tax; after tax, they often lose to it. Equity has historically outpaced inflation by a meaningful margin over long periods precisely because it carries real short-term risk that FDs don't — the extra return is compensation for that risk, not a free lunch.",
      "Inflation isn't uniform either. Healthcare and education costs in India have historically risen faster than general inflation, often 8-10% a year. If your goals involve either — a child's college fund, a retirement corpus that must cover medical costs — using the general inflation rate to plan will systematically undershoot what you actually need.",
      "The practical habit: whenever you set a savings target for something more than 5 years away, inflate the target first, then work out the required monthly investment. Planning with today's prices for a goal a decade away is one of the most common and costly mistakes in personal financial planning.",
    ],
    relatedTool: { label: "Try the Inflation Calculator", to: "/inflation-calculator" },
  },
  {
    slug: "credit-score",
    title: "Credit Score Basics",
    category: "Foundations",
    readTime: "4 min",
    summary: "The three-digit number that quietly decides your loan rates — and how to actually move it.",
    body: [
      "Your credit score (CIBIL in India, typically 300-900) is a summary of how reliably you've repaid past debt. Lenders use it to decide not just whether to approve a loan, but what interest rate to offer — the gap between a 750+ score and a sub-650 score can easily mean 1-2% difference on a home loan, which compounds into lakhs over a 20-year tenure.",
      "The single biggest factor is payment history: even one missed credit card payment or EMI can meaningfully dent a score, and the effect lingers for months. The second biggest factor is credit utilization — how much of your available credit limit you're actually using. Regularly maxing out a card, even if you pay it off in full every month, can hurt your score more than people expect.",
      "A common misconception is that having no debt at all gives you a great score. In practice, a thin credit file (no credit cards, no loan history) often produces a mediocre score simply because there's no repayment track record to evaluate. Responsibly using one credit card and paying it in full monthly tends to build a stronger file than avoiding credit entirely.",
      "Practical moves that actually shift the number: pay every EMI and credit card bill on time, keep utilization under roughly 30% of your limit, avoid applying for multiple loans or cards in a short window (each hard inquiry dings your score slightly), and check your report periodically for errors — incorrect entries from a lender are more common than most people assume.",
    ],
    relatedTool: { label: "Explore Calculators", to: "/calculators" },
  },
  {
    slug: "health-insurance-basics",
    title: "Health Insurance Basics",
    category: "Guide",
    readTime: "5 min",
    summary: "Why relying only on your employer's health cover is a riskier bet than it feels like.",
    body: [
      "Employer-provided health insurance is convenient but temporary by definition — it disappears the moment you change jobs, get laid off, or retire, often exactly when you're least prepared to arrange new cover quickly. A personal health policy, held independently of your job, is what actually protects you across career changes and into retirement.",
      "Sum insured matters more than most people budget for. Metro-city hospitalization costs have risen sharply, and a ₹3-5 lakh cover that felt adequate a decade ago can be exhausted by a single serious hospitalization today. A common rule of thumb is a base cover of at least ₹5-10 lakh per person in a metro, topped up with a super top-up policy for a fraction of the cost of raising the base sum insured directly.",
      "Waiting periods are the detail that catches people off guard: most policies exclude pre-existing conditions for 2-4 years and have initial waiting periods for specific illnesses. Buying health insurance while young and healthy — before a condition exists to be 'pre-existing' — is one of the few financial moves where waiting genuinely costs you, rather than helps you.",
      "Before comparing premiums, compare claim settlement ratio, network hospital coverage in your city, and whether the policy covers modern treatment methods like day-care procedures. The cheapest policy that denies or delays a real claim is far more expensive than a slightly pricier one that pays out reliably.",
    ],
    relatedTool: { label: "Try the Term Insurance Verdict", to: "/verdict/insurance-need" },
  },
  {
    slug: "mutual-fund-types",
    title: "Mutual Fund Types",
    category: "Beginner",
    readTime: "5 min",
    summary: "Equity, debt, hybrid, index — a map of the mutual fund landscape before you pick one.",
    body: [
      "Equity mutual funds invest primarily in company shares and suit long-term goals (5+ years), given their volatility. Within equity, large-cap funds hold established, relatively stable companies; mid- and small-cap funds hold smaller, higher-growth-potential but more volatile companies. Most long-term portfolios are built primarily around large-cap and flexi-cap exposure, with smaller allocations to mid/small-cap for extra growth potential.",
      "Debt mutual funds invest in bonds and money-market instruments, offering more stability and liquidity than equity but lower expected returns — generally used for short-to-medium-term goals (under 3-5 years) or as the stable portion of a portfolio. Hybrid funds blend both in varying proportions, aiming for a middle ground between growth and stability.",
      "Index funds simply track a market index (like the Nifty 50) rather than having a manager pick stocks. They charge much lower fees than actively managed funds, and over long periods, a large share of actively managed funds fail to beat their benchmark index after fees — which is why index funds have become a popular 'default' core holding, especially for large-cap exposure.",
      "The practical filter before choosing any fund: match the fund category to your time horizon and risk tolerance first, then compare expense ratio and long-term (5-10 year) performance within that category — not the best 1-year return, which says very little about a fund's actual quality or repeatability.",
    ],
    relatedTool: { label: "Try the SIP Calculator", to: "/sip-calculator" },
  },
  {
    slug: "behavioral-investing-mistakes",
    title: "Behavioral Investing Mistakes",
    category: "Core Skill",
    readTime: "4 min",
    summary: "The numbers usually aren't the problem — your reaction to them is.",
    body: [
      "Loss aversion means people feel the pain of a loss roughly twice as intensely as the pleasure of an equivalent gain. This is why investors often sell winning investments too early (to 'lock in' the good feeling) and hold losing investments too long (to avoid 'realizing' the bad feeling) — the exact opposite of a sound strategy, which should judge each position on its future prospects, not its past cost.",
      "Recency bias makes people extrapolate recent performance forward: a fund that did well for two years suddenly looks like the obvious choice, and a market that's fallen for a few months starts to feel permanently broken. In reality, chasing recent top-performing funds is a well-documented way to underperform, since strong recent performance is often followed by reversion, not continuation.",
      "Panic-selling during downturns is the single most quantifiable way retail investors damage their own long-term returns. Studies consistently show that the average investor earns meaningfully less than the funds they're invested in, almost entirely because of poorly timed entries and exits driven by fear and greed rather than plan.",
      "The practical defense against all of this is mostly structural, not willpower-based: automate investments (SIPs) so they continue regardless of mood, set an asset allocation in advance and rebalance on a schedule rather than a feeling, and write down your reason for holding an investment before you buy it — so a future decision to sell can be checked against your original logic instead of the market's current mood.",
    ],
    relatedTool: { label: "Try the SIP Calculator", to: "/sip-calculator" },
  },
  {
    slug: "gold-and-alternative-assets",
    title: "Gold & Alternative Assets",
    category: "Markets",
    readTime: "4 min",
    summary: "Where gold, real estate and other alternatives actually fit in a portfolio — and where they don't.",
    body: [
      "Gold's main portfolio role isn't high growth — historically it has trailed equity returns over long periods — it's low correlation with equity markets. Gold has tended to hold up or rise during periods of high inflation, currency weakness, or geopolitical stress, exactly when equities often struggle, which makes a small allocation (commonly cited around 5-10%) a diversification tool rather than a growth engine.",
      "Sovereign Gold Bonds and gold ETFs are generally more efficient ways to hold gold than physical jewelry or coins for investment purposes — no making charges, no storage risk, and SGBs additionally pay a small annual interest on top of gold's price movement, with capital gains tax exemption if held to maturity.",
      "Real estate as an investment (separate from a home you live in) has high entry costs, poor liquidity, and returns that vary enormously by specific location — national average figures mean very little for a single property's outcome. It can build wealth, but it doesn't diversify a portfolio the way an uncorrelated asset does, since a large chunk of net worth becomes tied to a single illiquid asset in a single location.",
      "The general framework: alternatives like gold earn a small, deliberate slice of a portfolio for diversification, not because they're expected to be the top performer. A portfolio built mostly around asset classes you don't fully understand, chasing a hot trend, is speculation dressed up as diversification.",
    ],
    relatedTool: { label: "Explore Calculators", to: "/calculators" },
  },
  {
    slug: "home-loan-basics",
    title: "Home Loan Basics",
    category: "Planning",
    readTime: "5 min",
    summary: "The EMI is only the headline number — here's what actually determines the total cost.",
    body: [
      "A home loan EMI is calculated from three inputs: principal, interest rate, and tenure. Extending tenure lowers the EMI but sharply increases total interest paid — stretching a loan from 15 to 25 years might cut the EMI by roughly a third, while nearly doubling the total interest paid over the loan's life. Tenure should be chosen based on genuine affordability, not just to minimize the monthly number.",
      "Floating rate loans move with the broader interest rate environment (linked to an external benchmark like the repo rate in India), while fixed rates stay constant for a period but are usually set higher upfront to compensate the lender for that certainty. Most long-tenure home loans in India are floating rate, since a fixed rate over 15-20 years is rare and typically comes at a real premium.",
      "Prepayment — paying extra toward principal beyond the scheduled EMI — is one of the highest-value moves available on a home loan, especially in the early years when most of each EMI goes to interest rather than principal. Even a modest annual lump-sum prepayment (like a bonus) can meaningfully cut both total interest paid and the effective loan tenure.",
      "Before signing, look past the headline interest rate to the processing fee, prepayment/foreclosure charges (many loans now waive these for floating-rate loans by regulation, but it's worth confirming), and whether the rate is linked transparently to an external benchmark rather than an opaque internal one that the lender can adjust with less visibility.",
    ],
    relatedTool: { label: "Try the EMI Calculator", to: "/emi-calculator" },
  },
  {
    slug: "index-funds-vs-active-funds",
    title: "Index Funds vs Active Funds",
    category: "Beginner",
    readTime: "4 min",
    summary: "Low-cost tracking beats stock-picking more often than most investors expect — but not always.",
    body: [
      "An index fund simply buys every company in an index (like the Nifty 50) in proportion to its weight, with no manager trying to pick winners. An actively managed fund pays a manager to select stocks aiming to beat that same index — and charges a meaningfully higher expense ratio for the attempt, often 1-1.5% more per year.",
      "That fee gap compounds. On a ₹10 lakh investment held for 20 years, a 1.5% higher expense ratio can quietly cost several lakh rupees in reduced final value, even before asking whether the fund actually beat its benchmark. Over long periods, a large share of actively managed large-cap funds fail to beat their benchmark index after fees — which is exactly why index funds have become a popular default core holding.",
      "This isn't true everywhere, though. In less-tracked, less-efficient corners of the market — small-cap and mid-cap segments in India, for instance — skilled active managers have more historically demonstrated room to add value, since there's more mispricing for research to uncover. The efficient-market argument for indexing is strongest at the large-cap level.",
      "A reasonable middle path many investors use: index funds or ETFs for large-cap/flexi-cap exposure where beating the benchmark is hardest, and selectively active funds for mid-cap, small-cap, or thematic exposure where genuine skill has more room to show up — rather than treating it as an all-or-nothing choice.",
    ],
    relatedTool: { label: "Try the SIP Calculator", to: "/sip-calculator" },
  },
  {
    slug: "term-insurance-basics",
    title: "Term Insurance Basics",
    category: "Guide",
    readTime: "4 min",
    summary: "Pure protection, no savings component — why term insurance beats endowment plans for most people.",
    body: [
      "Term insurance pays a lump sum to your family if you die during the policy period — nothing else. No maturity payout if you survive the term, which is exactly why it's so cheap: a healthy 30-year-old can often get ₹1 crore of cover for roughly ₹10,000-15,000 a year, a fraction of what an endowment or money-back plan charges for similar cover.",
      "Endowment and money-back plans bundle insurance with a savings component, and the bundling is the problem: the investment portion inside these plans typically returns far less than what you'd earn investing the premium difference yourself in mutual funds or PPF, while the insurance portion still costs you real money. You end up with mediocre insurance and mediocre investing, instead of good versions of either.",
      "The right cover amount is typically framed as a multiple of income needed to replace your earnings for your dependents — commonly 10-15x annual income, adjusted for existing loans (a term plan large enough to also clear an outstanding home loan protects your family from inheriting that liability) and how many years of expenses your family would need covered.",
      "Buy term insurance while young and healthy: premiums are locked in at issue based on your age and health then, and a health condition that develops later can make cover far more expensive or harder to get at all. This is one of the few financial products where 'I'll get to it later' has a real, compounding cost.",
    ],
    relatedTool: { label: "Try the Term Insurance Verdict", to: "/verdict/insurance-need" },
  },
  {
    slug: "nps-vs-ppf-vs-epf",
    title: "NPS vs PPF vs EPF",
    category: "Planning",
    readTime: "5 min",
    summary: "India's three big retirement vehicles, and how their lock-ins and tax treatment actually differ.",
    body: [
      "EPF (Employees' Provident Fund) is the mandatory retirement scheme for salaried employees, with both employer and employee contributing a fixed percentage of basic salary. It earns a government-declared interest rate, is fully employer-linked, and is largely illiquid until retirement or specific permitted withdrawals (home purchase, medical emergencies, unemployment).",
      "PPF (Public Provident Fund) is open to anyone, salaried or not, with a 15-year lock-in (extendable in 5-year blocks) and a government-declared interest rate that resets quarterly. It's one of the few instruments in India that's fully tax-exempt at all three stages: contribution, interest earned, and withdrawal — genuinely rare, and worth using even by people who also have EPF.",
      "NPS (National Pension System) is market-linked, letting you choose an allocation between equity, corporate bonds and government securities, generally giving it higher long-term return potential than EPF or PPF, but with real market risk attached. It also carries an additional ₹50,000 tax deduction beyond the standard 80C limit, making it a common way to reduce taxable income further once 80C is maxed out elsewhere.",
      "A common approach: use EPF as the mandatory base (no choice involved for salaried employees), max out PPF for a genuinely risk-free, fully tax-exempt long-term component, and use NPS for the extra deduction plus some market-linked growth — while noting NPS requires compulsorily annuitizing a portion of the corpus at retirement, which reduces its overall flexibility compared to the other two.",
    ],
    relatedTool: { label: "Try the Retirement Calculator", to: "/retirement-calculator" },
  },
  {
    slug: "rebalancing-a-portfolio",
    title: "Rebalancing a Portfolio",
    category: "Core Skill",
    readTime: "4 min",
    summary: "The mechanical habit that forces you to sell high and buy low, without needing to predict anything.",
    body: [
      "Say you start with a 70% equity / 30% debt allocation. After a strong equity year, that might drift to 80/20 — you're now carrying more risk than originally intended, simply because equity grew faster. Rebalancing means selling enough equity (and buying debt) to bring the mix back to 70/30, which mechanically means selling some of what just went up.",
      "This is valuable precisely because it removes emotion from a genuinely hard decision. Selling part of a rising asset feels wrong in the moment — most people want to let winners run — but disciplined rebalancing does exactly what a 'buy low, sell high' strategy requires, on a schedule, without needing to predict where markets go next.",
      "A common approach is calendar rebalancing (once or twice a year, regardless of drift) or threshold rebalancing (whenever an allocation drifts more than roughly 5 percentage points from target). Threshold rebalancing reacts faster to large moves; calendar rebalancing is simpler to maintain and generates fewer unnecessary transactions.",
      "One practical detail in taxable accounts: rebalancing by selling triggers capital gains tax. Where possible, rebalancing by directing new contributions toward the underweight asset class — rather than selling the overweight one — achieves a similar effect with less tax drag, though it works more slowly and needs ongoing new money to be effective.",
    ],
    relatedTool: { label: "Explore Calculators", to: "/calculators" },
  },
  {
    slug: "understanding-cagr",
    title: "Understanding CAGR",
    category: "Markets",
    readTime: "4 min",
    summary: "The single smoothed number that makes messy year-to-year returns comparable — and where it can mislead.",
    body: [
      "CAGR (Compound Annual Growth Rate) answers 'what steady annual return, compounded, would have produced this same total result?' An investment that grew from ₹1 lakh to ₹2 lakh over 6 years has a CAGR of about 12.2% — even if the actual path was bumpy: up 40% one year, down 10% another, and so on.",
      "This smoothing is exactly what makes CAGR useful for comparing two very different investments over the same period — a fund, a fixed deposit, gold — on a like-for-like basis, without needing to eyeball a year-by-year table of returns.",
      "It's also exactly what can mislead. Two funds can have identical CAGR over 5 years while having wildly different volatility along the way — one might have swung 30% both directions, the other stayed within a narrow 8% band. CAGR alone tells you nothing about that ride, which matters enormously if you might need the money before the full period is up.",
      "CAGR is also sensitive to the exact start and end dates chosen. A CAGR calculated from a market bottom to a market peak will look far better than the same fund's CAGR measured from peak to peak — always check what period is being used before comparing CAGR figures across sources.",
    ],
    relatedTool: { label: "Try the CAGR Calculator", to: "/cagr-calculator" },
  },
  {
    slug: "sinking-funds",
    title: "Sinking Funds",
    category: "Foundations",
    readTime: "3 min",
    summary: "The underused technique for expenses you can see coming, so they never feel like an emergency.",
    body: [
      "A sinking fund is money set aside gradually, in advance, for a specific known future expense — an annual insurance premium, a festival season, a friend's wedding gift, an appliance replacement. Unlike an emergency fund (for the unexpected), a sinking fund is for the entirely expected, just not immediate.",
      "The mechanism is simple: divide the expected cost by the number of months until you need it, and set that amount aside automatically each month in a separate account or sub-account. A ₹24,000 annual insurance premium becomes a painless ₹2,000/month set-aside, rather than a jarring lump-sum hit once a year.",
      "Without sinking funds, predictable annual expenses tend to get paid for out of whatever cash is on hand when they arrive — often meaning a dip into the emergency fund, a credit card balance carried forward, or a delayed SIP that month. None of these are dramatic individually, but they quietly undermine the rest of a financial plan.",
      "A practical starting list: insurance premiums (health, term, vehicle), annual subscriptions, festival/gifting season, vehicle maintenance, and any known irregular expense that repeats yearly. Naming them and setting aside monthly turns 'surprise' expenses that aren't actually surprises into a routine, budgeted line item.",
    ],
    relatedTool: { label: "Try the Emergency Fund Calculator", to: "/emergency-fund-calculator" },
  },
  {
    slug: "salary-structuring-and-tax",
    title: "Salary Structuring & Tax",
    category: "Planning",
    readTime: "5 min",
    summary: "How to actually read a CTC breakup, and what in it genuinely changes your take-home pay.",
    body: [
      "A CTC (Cost to Company) figure bundles your base salary with components that don't reach your bank account as cash: employer's EPF contribution, gratuity provision, and sometimes insurance premiums the company pays on your behalf. A ₹12 lakh CTC offer can easily translate to a noticeably lower actual take-home, and comparing two job offers purely by CTC without checking the breakup is a common, costly mistake.",
      "Within the breakup, certain allowances are more tax-efficient than others if structured well: HRA (House Rent Allowance) can be significantly tax-exempt if you pay rent and submit proof, and reimbursement-based components (like meal cards or telephone bills, where offered) are typically tax-free up to a limit against actual bills, rather than being taxed as regular salary.",
      "India now runs two parallel tax regimes — the older one with various deductions and exemptions (80C, HRA, etc.) and a newer default regime with lower slab rates but few deductions. Which one results in lower tax depends heavily on how much you actually invest in 80C-eligible instruments and how much HRA you can claim — there's no universally correct choice, and it's worth calculating both ways each year.",
      "A practical habit: whenever CTC changes (a new offer, an appraisal), don't just look at the headline number — ask for the fixed take-home component specifically, and separately check which tax regime results in lower tax for your specific deduction profile that year, since the better regime can change as your deductions change.",
    ],
    relatedTool: { label: "Explore Calculators", to: "/calculators" },
  },
  {
    slug: "sip-vs-lump-sum",
    title: "SIP vs Lump Sum",
    category: "Beginner",
    readTime: "4 min",
    summary: "Averaging in beats investing all at once more often than intuition suggests — but not universally.",
    body: [
      "A SIP (Systematic Investment Plan) invests a fixed amount at regular intervals, buying more units when prices are low and fewer when prices are high — a mechanism called rupee-cost averaging. A lump sum invests everything at once, fully exposed to whatever the market does immediately afterward.",
      "When markets are volatile or you're unsure of the near-term direction, SIPs reduce the risk of catastrophically bad timing — investing a large lump sum right before a downturn is a specific, painful scenario that SIPs largely avoid by spreading entry points across time.",
      "However, if you genuinely have a lump sum sitting idle (a bonus, an inheritance, maturity proceeds) and markets are reasonably valued, historical data across most long periods shows lump-sum investing outperforms SIP-ing the same amount in on average — simply because markets rise more often than they fall, and money invested earlier has more time compounding.",
      "A practical middle ground many people use for a large lump sum: invest a portion immediately and stagger the rest via SIP into a liquid or debt fund over 3-6 months, deploying gradually into equity. This balances the 'time in market beats timing the market' argument for immediate investing against the real discomfort of a lump sum landing right before a downturn.",
    ],
    relatedTool: { label: "Try the SIP Calculator", to: "/sip-calculator" },
  },
  {
    slug: "reading-a-mutual-fund-factsheet",
    title: "Reading a Mutual Fund Factsheet",
    category: "Guide",
    readTime: "4 min",
    summary: "The handful of numbers on a dense factsheet that actually matter for your decision.",
    body: [
      "Expense ratio is the annual fee, expressed as a percentage of your investment, charged whether the fund gains or loses. On a ₹5 lakh investment, the difference between a 0.3% index fund and a 1.5% active fund is ₹6,000 a year, every year, regardless of performance — a fixed cost worth checking before anything else.",
      "Look at 5-year and 10-year returns, not 1-year returns. A fund's 1-year number is heavily influenced by short-term market conditions and says very little about manager skill or repeatability; longer periods smooth this out and reveal whether outperformance (if any) has actually been consistent, not a lucky recent stretch.",
      "Portfolio turnover ratio shows how frequently the fund buys and sells holdings. High turnover generally means higher transaction costs and, in taxable contexts, more frequent capital gains realization — a fund with 150%+ annual turnover is trading far more actively than one with 20-30%, with cost implications beyond the headline expense ratio.",
      "Standard deviation and Sharpe ratio, when available, describe volatility and risk-adjusted return respectively. A fund with a higher return but also a much higher standard deviation than a peer isn't necessarily 'better' — it may simply have taken more risk to get there, which the Sharpe ratio (return per unit of risk taken) helps make comparable.",
    ],
    relatedTool: { label: "Explore Calculators", to: "/calculators" },
  },
  {
    slug: "life-stages-and-asset-allocation",
    title: "Life Stages and Asset Allocation",
    category: "Core Skill",
    readTime: "4 min",
    summary: "How your mix of equity, debt and cash should shift as decades pass — and why most people don't adjust enough.",
    body: [
      "In your 20s and early 30s, time is the biggest asset you have. A heavy equity allocation (often 70-90%) is generally appropriate for long-term goals, since decades remain to ride out any downturn — a 30-40% market drop is recoverable when there's no near-term need to withdraw.",
      "Through your 40s, as retirement moves from abstract to a real 15-20 year horizon and obligations grow (children's education, aging parents, a home loan), a gradual shift toward a more balanced mix — commonly 50-65% equity — starts to make sense, trading some upside for reduced volatility on a growing, harder-to-replace corpus.",
      "In the 5-10 years before retirement, protecting the corpus becomes more important than maximizing growth. Money you'll need to withdraw within a few years of retiring shouldn't be riding out a downturn — a bad sequence of returns right at retirement can permanently impair a plan in a way it wouldn't for someone decades from needing the money.",
      "A commonly cited rough starting rule is '(100 minus your age)% in equity,' though it's a starting point, not a formula to follow blindly — actual risk tolerance, other income sources (like a pension), and specific goal timelines should adjust it meaningfully in either direction.",
    ],
    relatedTool: { label: "Try the Retirement Calculator", to: "/retirement-calculator" },
  },
];

export function getLessonBySlug(slug) {
  return LESSONS.find((l) => l.slug === slug);
}

// Deterministic shuffle (simple seeded LCG) — same seed always produces the
// same order, so this is reproducible and identical for every visitor, but
// the order isn't just array order, and it reshuffles once per year so the
// sequence doesn't feel like the same fixed loop indefinitely.
function seededShuffle(items, seed) {
  const arr = [...items];
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  const next = () => {
    s = (s * 48271) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Deterministic daily rotation — genuinely changes once per real calendar
// day, the same for everyone, not random on each page load. Reshuffles
// order once per calendar year so new lessons added mid-year get mixed in
// and the sequence doesn't repeat identically forever.
export function getTodaysLesson() {
  const now = new Date();
  const year = now.getFullYear();
  const dayOfYear = Math.floor((now - new Date(year, 0, 0)) / 86400000);
  const order = seededShuffle(LESSONS, year);
  return order[dayOfYear % order.length];
}
