import { useEffect, useState } from "react";
import { getWorkspaceState } from "../services/workspaceEngine";

export default function useWorkspace() {
  const [workspace, setWorkspace] = useState(
    getWorkspaceState()
  );

  useEffect(() => {
    const refreshWorkspace = () => {
      setWorkspace(getWorkspaceState());
    };

    window.addEventListener(
      "finaiw:goals-updated",
      refreshWorkspace
    );

    return () =>
      window.removeEventListener(
        "finaiw:goals-updated",
        refreshWorkspace
      );
  }, []);

  return workspace;
}