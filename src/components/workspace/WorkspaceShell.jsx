import { useState } from "react";

import WorkspaceSidebar from "./WorkspaceSidebar";
import WorkspaceContent from "./WorkspaceContent";

import GoalWizard from "./wizard/GoalWizard";

export default function WorkspaceShell({ workspace }) {
  const [activeView, setActiveView] = useState("overview");

  const [showGoalWizard, setShowGoalWizard] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  return (
    <>
      <section className="mx-auto grid max-w-[1700px] gap-10 px-6 py-8 lg:grid-cols-[320px_minmax(0,1fr)] xl:px-10">

        <WorkspaceSidebar
          activeView={activeView}
          onChange={setActiveView}
        />

       <WorkspaceContent
  workspace={workspace}
  activeView={activeView}
  onCreateGoal={() => {
    setEditingGoal(null);
    setShowGoalWizard(true);
  }}
  onEditGoal={(goal) => {
    console.log("Edit Goal:", goal);

    setEditingGoal(goal);
    setShowGoalWizard(true);
  }}
/>

      </section>

      {showGoalWizard && (
        <GoalWizard
        initialGoal={editingGoal}
          onClose={() => setShowGoalWizard(false)}
          onComplete={() => {
            window.dispatchEvent(
              new CustomEvent("finaiw:goals-updated")
            );

            setShowGoalWizard(false);
          }}
        />
      )}
    </>
  );
}