import { Stack } from "@mui/material";
import { User } from "constant/types";
import { memo } from "react";
import { Billing } from "store/billing/reducer";
import CommentSection from "../components/Comment";

type TabProps = {
  title: string;
  bill: Billing;
  user: User;
};
const TabFeed = (props: TabProps) => {
  const { title, bill, user } = props;
  return (
    <Stack gap={4}>
      {/* <TodoList /> */}
      {/* <Text variant={"body1"}>Write your comment</Text> */}
      <CommentSection billing={bill} user={user} />
    </Stack>
  );
};
export default memo(TabFeed);
