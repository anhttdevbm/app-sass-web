import Wrapper from "components/Wrapper";
import { Actions, ItemList } from "components/sn-companies";

export const metadata = {
  title: "Danh sách công ty | Taskcover",
};

export default function Page() {
  return (
    <Wrapper overflow="auto" inFrame>
      <Actions />
      <ItemList />
    </Wrapper>
  );
}
