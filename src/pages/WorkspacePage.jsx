import PageContainer from "../components/layout/PageContainer";
import useWorkspace from "../hooks/useWorkspace";

import WorkspaceShell from "../components/workspace/WorkspaceShell";

export default function WorkspacePage() {
  const workspace = useWorkspace();

  return (
    <PageContainer className="py-10">
      <WorkspaceShell workspace={workspace} />
    </PageContainer>
  );
}