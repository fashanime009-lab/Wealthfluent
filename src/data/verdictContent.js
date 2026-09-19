// Written content for each verdict page. Every figure quoted here was
// computed from the verdict's own engine (src/verdict/logic/*) at the
// page's default slider values — the amounts are in rupees, the same as the
// lessons, and your currency setting only changes how the tool's own
// numbers are displayed, not the maths. If a default slider or an engine
// changes, re-run the numbers before trusting the quoted figures.

export const RENT_VS_BUY = {
  sections: [
    {
      title: "How this verdict is calculated",
      paragraphs: [
        "The comparison is only fair if both people start with the same money and spend the same amount every month, so that's how the simulation is built. The buyer puts the down payment into the home, then pays the loan EMI plus upkeep every month — upkeep is fixed at 1% of the home's value per year. The renter invests that same down payment in the market instead, pays rent, and invests whatever is left of what the buyer would have spent. If rent ever comes out higher than the buyer's monthly cost, the renter draws the shortfall from the portfolio instead.",
        "Nothing here is a single formula, because rent, the home's value and the invested gap all change over time. The tool steps through your time horizon month by month: rent grows at the rent-growth rate, the home appreciates once a year, and the invested pile compounds monthly. At the end it compares net worth — for the buyer, the home's value minus the loan still owed; for the renter, the investment portfolio. If your horizon ends before the loan does, the tool uses the real remaining balance at that point, not the original loan.",
      ],
    },
    {
      title: "What the default numbers say",
      paragraphs: [
        "With the default setup — an ₹80 lakh home, 20% down (₹16 lakh), an 8.5% loan over 20 years, ₹25,000 monthly rent growing 5% a year, 6% home appreciation and a 12% investment return over 10 years — the EMI comes to about ₹55,500. Add upkeep and the buyer is spending roughly ₹62,000 a month at the start, against ₹25,000 for the renter.",
        "After 10 years the home is worth about ₹1.35 crore with ₹44.8 lakh of loan still owed, so the buyer's net worth is about ₹90 lakh. The renter's portfolio has grown to about ₹1.31 crore. Renting and investing finishes roughly ₹40 lakh ahead. That is a result, not a rule: it comes from investing a monthly gap of about ₹37,000 at 12% and beating a home that appreciates at 6%. Change those assumptions and the answer changes with them.",
      ],
    },
    {
      title: "What flips the answer",
      paragraphs: [
        "Holding everything else at its default, these are the tipping points the simulation finds. They are the numbers worth testing against your own situation.",
      ],
      grid: [
        {
          title: "Monthly rent",
          text: "Buying only catches up when rent reaches about ₹39,600 a month — roughly 5.9% of the home's price per year. Below that, renting stays ahead. The lower your rent is relative to the price, the harder buying has to work.",
        },
        {
          title: "Home appreciation",
          text: "The home would need to appreciate about 9.3% a year, against the 6% default, for buying to come out on top. A few points of extra appreciation is worth far more than it sounds because it applies to the whole price, not just your down payment.",
        },
        {
          title: "Investment return",
          text: "If the market return falls to about 7%, the two paths tie; below that, buying wins. Set the return equal to the appreciation rate — both at 6% — and buying wins by about ₹6.5 lakh. The verdict is largely a bet on the gap between those two rates.",
        },
        {
          title: "Time horizon",
          text: "With the default inputs, renting stays ahead at every horizon from 3 to 20 years, and its lead widens: about ₹8.5 lakh at 3 years, ₹40 lakh at 10 and ₹2.4 crore at 20. Time doesn't rescue buying on its own — the rate gap does.",
        },
      ],
    },
    {
      title: "What this tool leaves out",
      paragraphs: [
        "Every real decision has costs a slider can't capture. Here is what isn't modelled, and which way each omission pushes the numbers:",
      ],
      bullets: [
        "Stamp duty, registration, brokerage and legal fees when buying — a one-off cost that is gone the moment you sign. Leaving it out flatters buying.",
        "Selling costs at the end of your horizon. Leaving them out flatters buying.",
        "Property tax and any running costs above the 1% maintenance allowance. Leaving them out flatters buying.",
        "Tax on the renter's investment gains. Leaving it out flatters renting.",
        "Home-loan tax deductions, available in many countries under rules that change often. Leaving them out flatters renting.",
        "Whether the renter would really invest the difference every month. A mortgage is forced saving; a monthly investing habit isn't. Assuming perfect discipline flatters renting.",
        "Market volatility. The model compounds a smooth 12%, while real returns arrive unevenly and a bad decade can fall far short.",
      ],
    },
    {
      title: "How to use your result",
      paragraphs: [
        "Treat the headline as a starting point and stress-test it. Get a real rent quote for a comparable home rather than guessing, enter a market return you'd still defend after a poor decade rather than the best one you remember, and then move rent, appreciation and return towards the tipping points above to see how far your situation sits from them.",
        "The tool labels any result within 8% as a close call. When it lands there, the money side is genuinely a wash and the deciding factors are non-financial: stability for a family, freedom to renovate, protection from rent increases, and how likely you are to move in the next few years. When the gap is large, check whether it survives a lower investment return and a higher purchase cost before acting on it.",
      ],
    },
  ],
  related: [
    { label: "Rent vs Buy a Home", to: "/learn/rent-vs-buy-a-home", note: "the lesson behind this verdict, including why 'rent is wasted money' skips the maths" },
    { label: "Home Loan Basics", to: "/learn/home-loan-basics", note: "how tenure, rate and prepayment change the true cost of a loan" },
    { label: "EMI Calculator", to: "/emi-calculator", note: "work out the monthly payment for any loan amount, rate and tenure" },
    { label: "Home Affordability Calculator", to: "/home-affordability-calculator", note: "check whether a specific price fits your income before comparing it to renting" },
    { label: "SIP Calculator", to: "/sip-calculator", note: "the rent-and-invest side — see what a monthly amount grows to at the return you assume" },
  ],
  faqs: [
    { q: "Does this include stamp duty, registration, or brokerage?", a: "Not by default — those are one-time costs that vary a lot by city. If you know yours, mentally add them to the down payment slider." },
    { q: "Why does renting sometimes win even though rent 'feels like throwing money away'?", a: "Because the alternative isn't spending nothing — it's investing the gap. When rent is well below the true cost of owning, that monthly gap compounding in the market can outgrow the home's appreciation." },
    { q: "What if I plan to sell before the loan is paid off?", a: "The tool already accounts for this — it uses the actual remaining loan balance at your chosen time horizon, not the full loan term." },
    { q: "How much does my time horizon matter?", a: "Under the default inputs, renting stays ahead at every horizon from 3 to 20 years and its lead widens with time — roughly ₹8.5 lakh at 3 years, ₹40 lakh at 10 and ₹2.4 crore at 20. The horizon matters mostly because it compounds the monthly gap between owning and renting, so test it with your own rent and appreciation numbers rather than assuming a longer stay always favours buying." },
    { q: "What if I wouldn't actually invest the difference?", a: "Then the renter's column overstates what you'd end up with. Owning is a forced-savings plan — every EMI builds equity whether or not you feel like saving that month. If you know you wouldn't invest the gap consistently, mentally shave the renter's number before deciding." },
    { q: "Is a 12% investment return realistic?", a: "It's the default assumption, not a promise, and any single decade can fall well short of it. With the other defaults unchanged, renting is still ahead by about ₹22 lakh at a 10% return and about ₹6.5 lakh at 8%, and the two tie at roughly 7%. Try the lower figures for a more cautious view." },
    { q: "Does it count property tax, society charges or insurance?", a: "Only through the fixed allowance of 1% of the home's value per year for maintenance. If your real running costs are higher, buying is worse than the tool shows, so read a narrow win for buying with caution." },
  ],
};

export const LEASE_VS_BUY = {
  sections: [
    {
      title: "How this verdict is calculated",
      paragraphs: [
        "Both paths begin with the same pot of cash, so whichever option needs less upfront invests the difference. The buyer pays the down payment, finances the rest with a loan and pays the EMI each month. The lessee pays the due-at-signing amount and then a monthly lease, and owns nothing at the end. Each month the lessee also invests the gap between the buyer's EMI and the lease payment — or draws from that portfolio if the lease is the higher of the two.",
        "At the end of your time horizon the tool compares net worth. The buyer's is the car's depreciated resale value — the price reduced by the annual depreciation rate for each year you hold it — minus any loan still owed. The lessee's is simply the investment portfolio. If you keep the car longer than the loan runs, the buyer's payments stop while the lessee's keep going, which is why holding period matters so much here.",
      ],
    },
    {
      title: "What the default numbers say",
      paragraphs: [
        "The defaults describe a ₹12 lakh car, 20% down (₹2.4 lakh), a 9% loan over 5 years (an EMI of about ₹19,900), against an ₹18,000 monthly lease with ₹1 lakh due at signing. Depreciation is 15% a year, invested money earns 10%, and the horizon is 5 years.",
        "After 5 years the car is worth about ₹5.3 lakh — 44% of its price — and the loan is cleared, so the buyer is ahead with about ₹5.3 lakh of net worth against about ₹3.8 lakh in the lessee's portfolio: a lead of roughly ₹1.5 lakh for buying. The reason is that this lease is only about ₹1,900 a month cheaper than the EMI, so the lessee has very little to invest, while the buyer keeps most of the car's value.",
      ],
    },
    {
      title: "What flips the answer",
      paragraphs: [
        "These tipping points come from moving one input at a time while everything else stays at its default.",
      ],
      grid: [
        {
          title: "Monthly lease payment",
          text: "Leasing only wins when the payment drops below about ₹16,000 a month. A lease priced close to the EMI leaves too little to invest to make up for owning nothing at the end.",
        },
        {
          title: "Depreciation",
          text: "Buying's edge disappears at roughly 20.6% depreciation a year. Push it to 25% and leasing wins by about ₹95,000. Models that lose value steeply in the early years are the ones where leasing makes the most sense.",
        },
        {
          title: "Loan interest rate",
          text: "A pricier loan chips away at buying. At 12% the buyer's lead shrinks to about ₹42,000 and the tool calls it a close call; at 7% it grows to about ₹2.2 lakh.",
        },
        {
          title: "How long you keep it",
          text: "At a 2-year horizon buying leads by only about ₹18,000 — effectively a toss-up. At 7 years the lead is about ₹4 lakh, because the buyer stops paying once the loan is cleared while lease payments continue.",
        },
      ],
    },
    {
      title: "What this tool leaves out",
      paragraphs: [
        "A lease quote has more moving parts than a monthly figure and a signing amount. Here is what isn't modelled:",
      ],
      bullets: [
        "Mileage limits and excess-wear charges at lease end, which reduce leasing's appeal if you drive a lot.",
        "Lease-end fees, and any option to buy the car at a fixed price.",
        "Differences in insurance, registration and servicing — some leases bundle maintenance, which the tool doesn't credit.",
        "The shape of real depreciation. Cars often lose the most value in the first year, while the tool applies one smooth annual rate, so a real resale price can come in below the modelled one.",
        "The flexibility of swapping into a newer car every few years, which has real value to some drivers that no net-worth figure captures.",
      ],
    },
    {
      title: "How to use your result",
      paragraphs: [
        "Turn a lease quote into one honest monthly number: the monthly payment plus the due-at-signing amount and any fees spread across the months. Compare that against the roughly ₹16,000 tipping point for a car like this one. For depreciation, don't guess — look up what a five-year-old example of the same model sells for and work back to a yearly rate.",
        "If buying wins narrowly — anything the tool marks as a close call — the deciding factors are how long you'll really keep the car, how far you'll drive it, and whether you'd rather own an asset at the end or keep the option to change. If the result is clear, check that it still holds at a slightly higher depreciation rate and a slightly lower lease price before treating it as settled.",
      ],
    },
  ],
  related: [
    { label: "Time Value of Money", to: "/learn/time-value-of-money", note: "why comparing money at different points in time needs more than a monthly figure" },
    { label: "Compound Interest", to: "/learn/compound-interest", note: "the mechanic behind the invested savings on the leasing side" },
    { label: "EMI Calculator", to: "/emi-calculator", note: "the loan payment for any price, rate and tenure" },
    { label: "Rent vs Buy a home", to: "/verdict/rent-vs-buy", note: "the same rent-and-invest logic applied to housing" },
    { label: "SIP Calculator", to: "/sip-calculator", note: "the lease-and-invest side — see what the monthly saving grows to at the return you assume" },
  ],
  faqs: [
    { q: "Doesn't leasing always cost more in the end?", a: "Not always — it depends on the specific car's depreciation rate and your investment return. Fast-depreciating cars make leasing more attractive." },
    { q: "What about mileage limits and wear-and-tear charges?", a: "This tool doesn't model those — if you drive well above typical limits, factor in likely lease-end penalties by adding them to your monthly lease cost." },
    { q: "Which numbers should I take from a real quote?", a: "The monthly lease payment and the amount due at signing come straight from the quote; the price, loan rate and tenure from the dealer or your bank. Depreciation is the one to research yourself — check what a used example of the same model sells for after a few years, then work back to a yearly rate." },
    { q: "Is leasing ever clearly better?", a: "Yes. With the default inputs it wins when the monthly lease falls below about ₹16,000, or when the car loses value faster than roughly 20.6% a year. It also tends to suit anyone who wants a newer car every two to three years, which no net-worth comparison can price." },
    { q: "What if I buy a used car instead?", a: "A used car has already absorbed the steepest part of depreciation, so try a lower depreciation rate. At 10% a year buying's lead over leasing grows to about ₹3.3 lakh, and at 8% to about ₹4.1 lakh, with the other defaults unchanged." },
    { q: "Why does the down payment affect the leasing side?", a: "Because the tool assumes both paths start with the same cash. Whichever option needs less upfront keeps the rest and invests it, so a bigger down payment gives the lessee more to invest, and a lease that costs more at signing than your down payment gives the buyer the spare cash instead." },
  ],
};

export const INSURANCE_NEED = {
  sections: [
    {
      title: "How this verdict is calculated",
      paragraphs: [
        "This uses the needs-based method — the standard approach used by insurers and fee-only advisors — rather than a multiple of income. It asks what your dependents would actually have to replace, then subtracts what they already have.",
      ],
      steps: [
        "Income replacement: your annual income multiplied by the number of years your dependents would need it.",
        "Add your outstanding loans, so the family isn't left to service them.",
        "Add the cost of future goals such as your children's education or a marriage.",
        "That total is what your dependents would need. Subtract your existing savings and existing life cover.",
        "What remains, if anything, is the additional cover a term policy should provide.",
      ],
    },
    {
      title: "What the default numbers say",
      paragraphs: [
        "The defaults are an annual income of ₹12 lakh, 15 years of income to replace, ₹30 lakh of loans, ₹20 lakh of future goals, ₹10 lakh of savings and ₹10 lakh of existing cover. Replacing 15 years of income comes to ₹1.8 crore; add loans and goals and the total need is ₹2.3 crore. Against ₹20 lakh already in place, the gap is ₹2.1 crore.",
        "Compare that with the rules of thumb. Ten times income would suggest ₹1.2 crore and fifteen times ₹1.8 crore — both fall well short of the needs-based figure, because a multiple of income can't see the ₹30 lakh of loans or the ₹20 lakh of goals. The reverse can happen too: someone with no debt and large savings can be over-insured by a rule of thumb. The maths is simple, which is why every number you enter matters.",
        "Each extra ₹10 lakh of loans adds exactly ₹10 lakh to the need, and each extra year of income to replace adds one more year of salary — stretching the default from 15 years to 30 adds ₹1.8 crore.",
      ],
    },
    {
      title: "Choosing each input",
      grid: [
        {
          title: "Years of income to replace",
          text: "Think about how long your dependents would rely on your salary: until your youngest child is independent, until a non-earning spouse could realistically become self-supporting, or until the date you'd have retired. Ranges of 10 to 20 years are common; there is no single right number.",
        },
        {
          title: "Outstanding loans",
          text: "Include all of them — home, car, personal and education loans. Covering them means the family keeps the home and doesn't inherit repayments on top of losing your income.",
        },
        {
          title: "Future goals",
          text: "Add costs you'd expect to pay for, such as a child's education or a wedding. These are costs that rise over time, so enter a figure you'd expect to pay when the bill arrives, not today's price.",
        },
        {
          title: "Existing savings and cover",
          text: "Count only what your family could actually use. The home you live in and money locked into retirement accounts don't help cover expenses, and employer group cover usually ends when your job does, so count it cautiously.",
        },
      ],
    },
    {
      title: "How the result is labelled",
      paragraphs: [
        "If your savings and existing cover already meet the need, the verdict is a clear green — you're adequately covered. If there is a gap of up to three times your annual income, the tool calls it a close call. A gap larger than three times your annual income is flagged as a meaningful gap. With the default income, that threshold is ₹36 lakh; the default gap of ₹2.1 crore is about 17 times income, so it shows as a meaningful gap.",
      ],
    },
    {
      title: "What this tool leaves out",
      paragraphs: [
        "The method is deliberately simple. Some of what it ignores makes the answer too high and some makes it too low, so treat the figure as a sound working number rather than an actuarial one:",
      ],
      bullets: [
        "It doesn't earn returns on the payout. A lump sum invested for your family would generate income, so replacing every year of salary in full overstates the need.",
        "It doesn't subtract your own personal spending, which would stop if you were gone. This also overstates the need.",
        "It ignores your partner's income. If they earn, the true gap is smaller — run the tool separately for each of you.",
        "It doesn't inflate future expenses or goals. Costs that rise over time make the need larger than shown.",
        "It doesn't include final expenses or medical costs, and it counts savings at face value even if part of them isn't readily available.",
      ],
    },
    {
      title: "After you have the number",
      paragraphs: [
        "Use the result to decide the order of magnitude of cover, then round to a standard policy size. Match the policy term to your longest obligation — the date your youngest dependent becomes independent, your loans are repaid or you plan to retire, whichever runs longest. Buy while you're young and healthy, because term premiums are set at purchase on the basis of your age and health then.",
        "The need isn't permanent. It shrinks as loans are repaid and savings grow, and it jumps when you take on a new loan, marry or have a child, so recalculate at each of those points and yearly otherwise. Be accurate about your health and habits when you apply — a misstatement can put a future claim at risk.",
      ],
    },
  ],
  related: [
    { label: "Term Insurance Basics", to: "/learn/term-insurance-basics", note: "why pure protection beats bundled policies for most people" },
    { label: "Term Insurance vs Endowment/ULIP", to: "/verdict/term-vs-endowment", note: "once you know the amount, compare the two ways of buying protection" },
    { label: "Health Insurance Basics", to: "/learn/health-insurance-basics", note: "life cover doesn't replace a medical policy" },
    { label: "Net Worth Calculator", to: "/networth-calculator", note: "work out the savings figure to enter here" },
  ],
  faqs: [
    { q: "Why not just use '10-15x annual income'?", a: "That rule ignores your actual debts, goals, and existing savings — it can leave you under- or over-insured. The needs-based method here accounts for your specific numbers instead." },
    { q: "Should I include my spouse's income?", a: "This calculates cover for one person's income being lost. If both partners work, run it separately for each." },
    { q: "How many years of income should I choose?", a: "Pick the number of years your dependents would realistically rely on your salary — until your youngest child is independent, or until you would have retired, whichever is longer. Ten to twenty years is a common range. If you're unsure, run it at two values and see how much the answer moves." },
    { q: "Should I count my employer's group cover?", a: "Cautiously. Group cover normally ends when you leave the job or are laid off, which is exactly when a family might be most exposed. Many people leave it out and treat it as a bonus on top of the cover they buy themselves." },
    { q: "Do I need life cover if nobody depends on my income?", a: "Often not. If you have no dependents and no debts a family member would inherit, the need can be close to zero — the tool will show you're adequately covered. It matters most when someone relies on your income or would be left with your loans." },
    { q: "How often should I recalculate?", a: "At every major life change — marriage, a child, a new loan or a big change in income — and roughly once a year otherwise. As loans are repaid and savings grow, the gap shrinks, and you can sometimes reduce or stop topping up cover." },
    { q: "Is a bigger number always safer?", a: "Not necessarily. A larger sum assured means a higher premium, and cover beyond what your family would actually need is money spent for no benefit. The aim is a policy that closes the real gap, not the largest one you can afford." },
  ],
};

export const DEBT_VS_INVEST = {
  sections: [
    {
      title: "How this verdict is calculated",
      paragraphs: [
        "Both paths deploy exactly the same cash every month: your minimum payment plus the extra amount you have available. What differs is where it goes. In the debt-first path, all of it goes to the debt until the balance is gone; after that, the entire amount is invested for the rest of your horizon. In the invest-first path, only the minimum goes to the debt, and everything else is invested — including the minimum payment itself once the debt is finally cleared, since that money is no longer needed.",
        "Interest on the debt accrues monthly, and investments compound monthly at your expected return. At the end of the horizon the tool compares net worth: investments minus any debt still outstanding. The chart shows how each path's net worth evolves year by year.",
      ],
    },
    {
      title: "What the default numbers say",
      paragraphs: [
        "The defaults are a ₹5 lakh debt at 16%, a ₹15,000 minimum payment, ₹10,000 a month extra, a 12% investment return and a 5-year horizon. Debt-first clears the balance in month 24 and finishes with about ₹10.98 lakh; invest-first ends with about ₹10.69 lakh. Debt-first is ahead by roughly ₹29,000 — a 2.6% difference, which the tool labels a close call.",
        "It's a close call because the two rates are close: a guaranteed 16% saved by clearing the debt against an expected, not guaranteed, 12% from investing. When the rates are this near each other, the gap in rupees is small and the sensible choice depends more on your appetite for risk than on the arithmetic.",
      ],
    },
    {
      title: "Where it tips",
      paragraphs: [
        "The break-even is simple. Paying off debt is a guaranteed return equal to its interest rate. Investing earns an expected return that isn't guaranteed. So the verdict flips exactly where the two rates meet: with a 12% investment return, that's a debt rate of 12%; with a 16% debt rate, it's an investment return of 16%.",
      ],
      grid: [
        {
          title: "Low-rate debt (6–10%)",
          text: "Investing wins on paper — by about ₹30,000 at a 6% debt rate, ₹21,000 at 8% and ₹11,000 at 10% — but only by small margins, all inside the tool's close-call zone.",
        },
        {
          title: "Debt near the return (12–14%)",
          text: "This is the coin-flip zone. At 12% the two paths finish level; at 14% debt-first leads by only about ₹13,000.",
        },
        {
          title: "High-rate debt (20% and up)",
          text: "Debt-first pulls ahead: about ₹69,000 at 20%, still a close call, and about ₹2.8 lakh at 30% — a gap of roughly 30% that the tool marks as a clear verdict.",
        },
        {
          title: "Longer horizons",
          text: "The gap in rupees grows with time — about ₹21,000 at 3 years, ₹29,000 at 5 and ₹52,000 at 10 with the default numbers — because more months of compounding amplify whichever side is ahead.",
        },
      ],
    },
    {
      title: "Why risk matters more than the maths",
      paragraphs: [
        "The tool compounds a smooth 12%, but real investment returns arrive unevenly, and a five-year stretch can fall well short of any expected return. The interest you save by clearing a debt can't have a bad year. That's why, even when investing edges ahead on paper, someone who would be uncomfortable holding a loan while markets fall may reasonably choose debt-first — and why a credit card at 30–40% should almost never wait for an investment to beat it.",
        "A useful rule of thumb: treat your debt's rate as the return you're comparing against. If you can't confidently expect to beat it after risk and tax, clear the debt.",
      ],
    },
    {
      title: "What this tool leaves out",
      bullets: [
        "Tax. Interest on some loans, such as education or home loans, may be deductible, which lowers the debt's effective rate; gains on investments may be taxed, which lowers their effective return.",
        "Prepayment fees or penalties some lenders charge for paying a loan off early.",
        "Variable interest rates. The debt rate is assumed constant, while many loans and all credit cards can change.",
        "Employer matching and other free money. A match on retirement contributions is an instant return that usually beats both options here.",
        "Liquidity. Cash sent to a lender is gone, while invested money can be reached in an emergency — which is why an emergency fund should come before either.",
        "The peace of mind of being debt-free, which is worth something the numbers don't try to price.",
      ],
    },
  ],
  related: [
    { label: "Debt Payoff Strategy Planner", to: "/debt-payoff-planner", note: "if you have several debts, compare snowball and avalanche across all of them" },
    { label: "Debt Management", to: "/learn/debt-management", note: "how to think about which debt to attack first" },
    { label: "Emergency Funds", to: "/learn/emergency-funds", note: "why a cash buffer comes before paying down or investing" },
    { label: "Compound Interest", to: "/learn/compound-interest", note: "why debt and investments both grow faster than they look" },
    { label: "SIP Calculator", to: "/sip-calculator", note: "the invest side — see what a monthly amount grows to at the return you assume" },
    { label: "Emergency Fund Calculator", to: "/emergency-fund-calculator", note: "work out how many months of cash to hold before you commit to either path" },
  ],
  faqs: [
    { q: "Isn't paying off debt always the 'safe' choice?", a: "Paying off debt is a guaranteed return equal to the interest rate. Investing can lose money. If your debt rate is high, that guarantee is hard to beat; if it's low, investing often wins but carries real risk." },
    { q: "What about high-interest credit card debt specifically?", a: "Credit card rates (often 30-40%+) are almost always higher than realistic investment returns — the debt-first path will virtually always win." },
    { q: "Does this account for the psychological value of being debt-free?", a: "No — this only compares net worth. Being debt-free has real value beyond the math that this tool doesn't try to quantify." },
    { q: "What if I have several debts?", a: "Enter the most expensive one here to see whether paying it down beats investing. To decide the order in which to clear all of them, use the Debt Payoff Strategy Planner, which simulates snowball and avalanche across as many debts as you have." },
    { q: "What if my debt is a home loan at 8–9%?", a: "That's below what many investors expect from equities over long periods, so investing alongside a normal repayment schedule can be reasonable — but the margin is small and not guaranteed. Set the debt rate to your loan's rate and try a cautious return, such as 8–10%, to see how narrow the gap gets." },
    { q: "Which investment return should I enter?", a: "Use a figure you'd still defend after a poor decade, not the best one you've seen. The verdict flips exactly where the return equals the debt rate, so it's worth checking whether your result survives a lower assumption." },
    { q: "Should I build an emergency fund first?", a: "Yes. Money sent to a lender can't be recovered in a crisis, while invested money can be reached. Having a few months of expenses in cash means neither path forces you into new debt when something goes wrong." },
  ],
};

export const TERM_VS_ENDOWMENT = {
  sections: [
    {
      title: "How this verdict is calculated",
      paragraphs: [
        "Both paths spend the same total budget every year, so the comparison is on equal footing. In the first, you buy a term policy for its premium and invest everything else in the market. In the second, the whole budget goes into an endowment or ULIP policy, which grows at whatever return it delivers after its charges. Both are simulated year by year, and the tool compares the maturity value of each at the end of your horizon. Total premiums paid are identical.",
      ],
    },
    {
      title: "What the default numbers say",
      paragraphs: [
        "The defaults are a ₹40,000 annual budget, a ₹12,000 term premium, a 20-year horizon, a 12% market return and a 5.5% net return on the endowment. The term path invests ₹28,000 a year and ends with about ₹20.2 lakh; the endowment path puts in the full ₹40,000 a year and ends with about ₹13.9 lakh. Both have paid ₹8 lakh in premiums. Term plus investing is ahead by roughly ₹6.2 lakh.",
        "The gap comes entirely from the return: the endowment puts more money in every year, but it earns much less on it.",
      ],
    },
    {
      title: "Where it stops being obvious",
      paragraphs: [
        "The verdict is more sensitive to the assumptions than a headline suggests, and it's worth knowing where it flips.",
      ],
      grid: [
        {
          title: "Market return",
          text: "The two tie at a market return of about 8.8%. Below that, the endowment's maturity value is higher on paper — by about ₹1.1 lakh at 8% and about ₹3.6 lakh at 6% — because it puts more of the budget to work each year.",
        },
        {
          title: "Endowment return",
          text: "Against a 12% market, the endowment would need to net about 8.9% a year to match. That's why the return your specific policy actually delivers after charges is the number to find out.",
        },
        {
          title: "Time horizon",
          text: "Compounding needs time. At 10 years the two are nearly tied — the endowment is ahead by about ₹24,000 — while at 30 years term plus investing is ahead by about ₹38.6 lakh.",
        },
        {
          title: "Size of the term premium",
          text: "The comparison works because term cover is cheap. If the term premium rose to ₹30,000 out of the ₹40,000 budget, only ₹10,000 a year would be invested and the endowment would be ahead by about ₹6.7 lakh.",
        },
      ],
    },
    {
      title: "The number this tool doesn't show: cover",
      paragraphs: [
        "The verdict compares maturity values only. It doesn't put a price on the death benefit, and that's where the two options differ most. A term plan typically delivers far more cover per rupee of premium — the Term Insurance Basics lesson notes a healthy 30-year-old can often get ₹1 crore of cover for ₹10,000–15,000 a year — while an endowment's cover is usually only a modest multiple of its premium.",
        "So even when the returns look close, or the endowment edges ahead, the real question is whether your family would be protected. If people depend on your income, closing the cover gap matters more than a few lakh at maturity. The Insurance Need verdict gives you the amount to aim for.",
      ],
    },
    {
      title: "What this tool leaves out",
      bullets: [
        "Tax treatment of premiums and maturity proceeds on both sides, which depends on current rules and your policy.",
        "Surrender penalties and lock-ins. Exiting an endowment or ULIP early usually costs money, and ULIPs commonly carry a multi-year lock-in.",
        "Certainty. An endowment's return is more predictable than the market's, and the tool compounds a smooth market return that real markets don't deliver.",
        "Discipline. A policy forces you to keep paying, while investing on your own only works if you keep doing it.",
        "Charges that vary over the life of a policy, which are folded into a single net return here.",
      ],
    },
    {
      title: "How to find your real numbers",
      paragraphs: [
        "For the endowment or ULIP return, don't use the headline figure in a brochure. Ask the insurer for the benefit illustration and its surrender value schedule, then work out the effective annual return from what you'd pay in against what it projects at maturity — that's the number to enter. For the term premium, get quotes for your age, health and the cover amount you need. For the market return, try a cautious figure such as 8–10% next to the default, since the verdict depends on where that number sits against the break-even.",
      ],
    },
  ],
  related: [
    { label: "Term Insurance Basics", to: "/learn/term-insurance-basics", note: "why pure protection beats bundled plans for most people" },
    { label: "How Much Term Insurance Do You Need?", to: "/verdict/insurance-need", note: "work out the cover amount before you compare products" },
    { label: "Index Funds vs Active Funds", to: "/learn/index-funds-vs-active-funds", note: "a low-cost way to invest the premium difference" },
    { label: "SIP Calculator", to: "/sip-calculator", note: "see what a monthly investment grows to" },
  ],
  faqs: [
    { q: "Isn't an endowment or ULIP better because it combines insurance and investment?", a: "Bundling is exactly the problem, not the benefit. The insurance portion inside these plans is far more expensive per rupee of cover than a term plan, and the investment portion typically returns less than investing the same money directly — you end up with a mediocre version of both instead of a good version of either." },
    { q: "What if I've already bought an endowment or ULIP policy?", a: "Surrendering early usually comes with a real cost, so it's worth checking the surrender value and any remaining lock-in before deciding — this tool is best used before buying, to compare the two paths up front." },
    { q: "Does this account for the tax treatment of maturity proceeds?", a: "No — this only compares raw maturity value from the premium and assumed returns. Tax treatment on both sides can matter and depends on current rules and your specific policy, so it's worth checking separately." },
    { q: "Isn't the endowment's return guaranteed?", a: "Parts of it may be, depending on the plan, and that predictability is a genuine benefit. But a guaranteed low return is still a low return: enter the effective return your policy actually delivers and see how far it sits below the break-even of about 8.9% against a 12% market." },
    { q: "How do I work out an endowment plan's real return?", a: "Ask for the benefit illustration and surrender schedule, then calculate the effective annual return from the premiums you'd pay against the maturity amount it projects. That figure, after all charges, is what to enter as the endowment return." },
    { q: "How much cover should the term plan have?", a: "Enough to close the gap between what your dependents would need and what you already have. The Insurance Need verdict does this calculation from your income, loans, goals and savings, rather than guessing at a multiple of your salary." },
    { q: "Can I keep an existing policy and add a term plan?", a: "Yes, and that's common. Existing cover counts toward what you already have, so add term cover to close the remaining gap, and decide separately whether the older policy is worth continuing given its surrender value." },
  ],
};

export const VERDICT_INDEX = {
  sections: [
    {
      title: "How every verdict works",
      paragraphs: [
        "A calculator gives you a number. A verdict gives you a decision. Each of these tools sets two realistic paths side by side — renting versus buying, paying off debt versus investing, and so on — funds both with the same money, and simulates them month by month or year by year. Then it compares where you end up: net worth for most of them, maturity value for the term-versus-endowment comparison, and the gap between what your family would need and what you have for the insurance one.",
        "None of them is a single formula with a hidden answer. Every input is a slider you can move, the method is written out under each tool, and the tipping points are stated so you can see what would change the result.",
      ],
    },
    {
      title: "How to read a verdict",
      paragraphs: [
        "Each result is labelled by how decisive it is, not by which side won. A clear verdict means the two paths end up at least 8% apart. A close call means they're within 8%, and the money alone doesn't settle it — the deciding factors are the ones no tool can measure, such as stability, flexibility and your comfort with risk. For insurance, a meaningful gap means the cover you'd need exceeds what you have by more than three times your annual income.",
        "Which side wins is shown by its position on the scale, never by colour. The colour only tells you how confident the result is.",
      ],
    },
    {
      title: "Why the answer is different for everyone",
      paragraphs: [
        "Every verdict turns on a small number of inputs, and the answer flips when they cross a tipping point. Paying off debt beats investing when the debt's interest rate is above your expected return. Buying beats renting when rent is high relative to the home's price, or when the home appreciates faster than invested money grows. Leasing beats buying when the lease is cheap or the car loses value quickly. Term-plus-investing beats an endowment when the market return is comfortably above what the endowment delivers.",
        "That's why two people with different rates, rents or incomes can get opposite results from the same tool, and why it's worth testing your own numbers instead of trusting a rule of thumb.",
      ],
    },
    {
      title: "What a verdict can't do",
      paragraphs: [
        "These are planning models, not personal advice. They assume steady returns, leave out taxes and one-off costs unless a page says otherwise, and can't price things like the security of owning a home or the value of being debt-free. Use them to understand what drives a decision and to stress-test your assumptions, then confirm the details with a qualified adviser before committing large sums.",
      ],
    },
  ],
  faqs: [
    { q: "Are these verdicts financial advice?", a: "No. They're planning tools that show what happens under the assumptions you enter. They don't know your full circumstances, taxes or goals, so treat them as a way to understand a decision — then check the details with a qualified adviser." },
    { q: "Why do some verdicts say 'close call'?", a: "Because the two options end up within 8% of each other on the measure being compared. When that happens the money side is roughly a wash, and the decision should rest on things like stability, flexibility and how much risk you're comfortable with." },
    { q: "Are my numbers saved or sent anywhere?", a: "No. Every verdict calculates in your browser as you move the sliders. Nothing you enter is sent to a server." },
    { q: "Which verdict should I start with?", a: "The one matching the decision in front of you. If you're deciding on a big purchase, start with Rent vs Buy or Lease vs Buy. If you have spare cash each month, start with Debt vs Invest. If people rely on your income, start with the insurance verdict." },
  ],
};
