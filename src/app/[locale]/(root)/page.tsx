"use client";

import Wrapper from "components/Wrapper";
import Dashboard from "components/sn-dashboard/Dashboard";
import JoinWorkspace from "components/sn-join-workspace";
import WaitingApprove from "components/sn-waiting-approve/index";
import { Permission } from "constant/enums";
import { useAuth } from "store/app/selectors";

export default function Page() {
  const { user } = useAuth();

  // Check the user's status, company, and roles
  const shouldShowWaitingApprove = user?.status === 2 && user?.company !== null;
  const shouldShowJoinWorkspace = user?.status === 1 && user?.company === null && user?.roles?.includes(Permission.EU);

  return (
    <Wrapper overflow="auto" spacing={3} transparent>
      { shouldShowJoinWorkspace ? <JoinWorkspace /> : shouldShowWaitingApprove ? <WaitingApprove /> : <Dashboard />}
    </Wrapper>
  );
}
