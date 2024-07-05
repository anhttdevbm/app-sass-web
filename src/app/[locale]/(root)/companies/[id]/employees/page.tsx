import { Actions, ItemList } from "components/sn-company-detail/Employees";

export const metadata = {
  title: "Danh sách nhân viên | Taskcover",
};

export default function Page() {
  return (
    <>
      <Actions />
      <ItemList />
    </>
  );
}
