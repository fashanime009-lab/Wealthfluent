import { useState } from "react";
import DashboardToolbar from "./DashboardToolbar";
import DashboardLayout from "./DashboardLayout";

export default function Dashboard() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <DashboardToolbar
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing((v) => !v)}
      />

      <DashboardLayout
        isEditing={isEditing}
      />
    </>
  );
}