import NotSupportBrowser from "components/sn-meeting/components/NotSupportBrowser";
import MeetingWrapper from "components/sn-meeting/MeetingWrapper";
import { headers } from "next/headers";

export const metadata = {
  title: "Video call | Taskcover",
};

export default function Page() {
  const userAgent = headers().get("user-agent") || "";
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);

  if (isSafari) {
    return <NotSupportBrowser />;
  }
  return <MeetingWrapper />;
}
