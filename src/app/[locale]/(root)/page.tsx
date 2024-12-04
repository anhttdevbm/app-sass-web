"use client";

import Wrapper from "components/Wrapper";
import Dashboard from "components/sn-dashboard/Dashboard";
import WaitingApprove from "components/sn-waiting-approve/index"; // Import the WaitingApprove component
import { useAuth } from "store/app/selectors"; // Assuming useAuth provides user information

// export const metadata = {
//   title: "Dashboard | Taskcover",
// };

export default function Page() {
  const { user } = useAuth();
  // Check the user's status and company
  const shouldShowWaitingApprove = user?.status === 2 && user?.company !== null;

  return (
    <Wrapper overflow="auto" spacing={3} transparent>
      {shouldShowWaitingApprove ? <WaitingApprove /> : <Dashboard />}
    </Wrapper>
  );
}
