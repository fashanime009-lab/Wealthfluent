import PropertyPriceStep from "../components/PropertyPriceStep";
import DownPaymentStep from "../components/DownPaymentStep";
import MonthlyIncomeStep from "../components/MonthlyIncomeStep";
import MonthlyExpensesStep from "../components/MonthlyExpensesStep";
import ExistingEMIStep from "../components/ExistingEMIStep";
import DecisionSummaryStep from "../components/DecisionSummaryStep";
import LoanTenureStep from "../components/LoanTenureStep";
import InterestRateStep from "../components/InterestRateStep";
import AffordabilityAnalysisStep from "../components/AffordabilityAnalysisStep";

const homeBuyingJourney = {
  id: "home-buying",

  title: "Home Buying Journey",

  steps: [
    {
      id: "property",
      title: "Property",
      component: PropertyPriceStep,
    },
    {
      id: "down-payment",
      title: "Down Payment",
      component: DownPaymentStep,
    },
    {
      id: "income",
      title: "Monthly Income",
      component: MonthlyIncomeStep,
    },
    {
      id: "expenses",
      title: "Monthly Expenses",
      component: MonthlyExpensesStep,
    },
    {
      id: "existing-emi",
      title: "Existing EMI",
      component: ExistingEMIStep,
    },
    {
  id: "loan-tenure",
  title: "Loan Tenure",
  component: LoanTenureStep,
},
{
  id: "interest-rate",
  title: "Interest Rate",
  component: InterestRateStep,
},
    {
  id: "summary",
  title: "Review",
  component: DecisionSummaryStep,
},
{
  id: "analysis",
  title: "Analysis",
  component: AffordabilityAnalysisStep,
},
  ],
};

export default homeBuyingJourney;