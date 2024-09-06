import TimeTrackingPage from "components/sn-time-tracking";
import Wrapper from "components/sn-time-tracking/Wrapper";
export const metadata = {
  title: "Time tracking | Taskcover",
};

export default function Page() {
  return (
    <Wrapper>
      <TimeTrackingPage />
    </Wrapper>
  );
}
