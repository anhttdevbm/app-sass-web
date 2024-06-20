// import Meeting from "components/sn-meeting";
// import { NS_MEETING } from "constant/index";
// import { Metadata } from "next";
// import { getTranslations } from "next-intl/server";

import Wrapper from "components/Wrapper";
import Meeting from "components/sn-meeting";
import MeetingLayout from "components/sn-meeting/meeting-layout/MeetingLayout";
import { NS_MEETING } from "constant/index";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Video call | Taskcover",
};

export default function Page() {
  return <MeetingLayout />;
}
