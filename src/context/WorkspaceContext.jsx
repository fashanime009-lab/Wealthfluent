import { createContext, useContext, useEffect, useState } from "react";

const WorkspaceContext = createContext();

const STORAGE_KEY = "finaiw-workspace";

const defaultWorkspace = {
  profile: {
    name: "",
    currency: "INR",
  },

  goals: [],

  recentActivity: [],

  calculations: {
    sip: null,
    emi: null,
    fd: null,
    fire: null,
    retirement: null,
    netWorth: null,
  },

  dashboard: {
  financialScore: null,

  netWorth: null,

  monthlyInvestment: null,

  emergencyFund: null,

  emergencyFundMonths: null,

  passiveIncome: null,

  retirementCorpus: null,

  retirementShortfall: null,

  retirementAge: null,

  activeGoalId: null,

  todaysFocus: null,

  lastUpdated: null,
},
 history: {
  netWorth: [],
  monthlyInvestment: [],
  financialScore: [],

  retirementCorpus: [],
  passiveIncome: [],
  emergencyFund: [],
},
};

export function WorkspaceProvider({ children }) {
  const [workspace, setWorkspace] = useState(defaultWorkspace);
  const saveCalculation = (type, data) => {
  setWorkspace((prev) => ({
    ...prev,
    calculations: {
      ...prev.calculations,
      [type]: data,
    },
  }));
};

const addRecentActivity = (activity) => {
  setWorkspace((prev) => ({
    ...prev,
    recentActivity: [
      {
        id: Date.now(),
        date: new Date().toISOString(),
        ...activity,
      },
      ...prev.recentActivity,
    ].slice(0, 20),
  }));
};

const updateDashboard = (values) => {
  setWorkspace((prev) => {
    const updatedDashboard = {
      ...prev.dashboard,
      ...values,
    };
updatedDashboard.lastUpdated = new Date().toISOString();
    const updatedHistory = {
      ...prev.history,
    };

    if (values.netWorth !== undefined) {
      updatedHistory.netWorth = [
        ...prev.history.netWorth,
        {
          value: values.netWorth,
          date: new Date().toISOString(),
        },
      ].slice(-50);
    }

    if (values.monthlyInvestment !== undefined) {
      updatedHistory.monthlyInvestment = [
        ...prev.history.monthlyInvestment,
        {
          value: values.monthlyInvestment,
          date: new Date().toISOString(),
        },
      ].slice(-50);
    }

    if (values.financialScore !== undefined) {
      updatedHistory.financialScore = [
        ...prev.history.financialScore,
        {
          value: values.financialScore,
          date: new Date().toISOString(),
        },
      ].slice(-50);
    }
if (values.retirementCorpus !== undefined) {
  updatedHistory.retirementCorpus = [
    ...prev.history.retirementCorpus,
    {
      value: values.retirementCorpus,
      date: new Date().toISOString(),
    },
  ].slice(-50);
}
if (values.passiveIncome !== undefined) {
  updatedHistory.passiveIncome = [
    ...prev.history.passiveIncome,
    {
      value: values.passiveIncome,
      date: new Date().toISOString(),
    },
  ].slice(-50);
}
if (values.emergencyFund !== undefined) {
  updatedHistory.emergencyFund = [
    ...prev.history.emergencyFund,
    {
      value: values.emergencyFund,
      date: new Date().toISOString(),
    },
  ].slice(-50);
}
    return {
      ...prev,
      dashboard: updatedDashboard,
      history: updatedHistory,
    };
  });
};

const createGoal = (goal) => {
  setWorkspace((prev) => ({
    ...prev,
    goals: [
      ...prev.goals,
      {
    id: crypto.randomUUID(),

    type: goal.type,

    title: goal.title,

    targetAmount: goal.targetAmount,

    currentAmount: goal.currentAmount ?? 0,

    monthlyContribution: goal.monthlyContribution ?? 0,

    targetDate: goal.targetDate,

    completed: false,

    createdAt: new Date().toISOString(),
}
    ],
  }));
};
const updateGoal = (id, values) => {
  setWorkspace((prev) => ({
    ...prev,
    goals: prev.goals.map((goal) =>
      goal.id === id
        ? {
            ...goal,
            ...values,
          }
        : goal
    ),
  }));
};
const completeGoal = (id) => {
  setWorkspace((prev) => ({
    ...prev,
    goals: prev.goals.map((goal) =>
      goal.id === id
        ? {
            ...goal,
            completed: true,
        }
        : goal
    ),
  }));
};
const removeGoal = (id) => {
  setWorkspace((prev) => ({
    ...prev,
    goals: prev.goals.filter((goal) => goal.id !== id),
  }));
};

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

setWorkspace({
  ...defaultWorkspace,
  ...parsed,
  history: {
    ...defaultWorkspace.history,
    ...(parsed.history || {}),
  },
});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
  }, [workspace]);

  return (
    <WorkspaceContext.Provider
      value={{
  workspace,

  saveCalculation,

  addRecentActivity,

  updateDashboard,

  createGoal,

  updateGoal,

  completeGoal,

  removeGoal,
}}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  return useContext(WorkspaceContext);
}