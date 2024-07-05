import Wrapper from "components/Wrapper";
import { Actions, ItemList } from "components/sn-statement-history";

export const metadata = {
  title: "Lịch sử báo cáo | Taskcover",
};

export default function Page() {
  return (
    <Wrapper overflow="auto">
      <Actions />
      <ItemList />
    </Wrapper>
  );
}
