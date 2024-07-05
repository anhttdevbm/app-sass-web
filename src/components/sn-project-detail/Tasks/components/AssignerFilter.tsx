import { memo, useEffect } from "react";
import { Dropdown, DropdownProps } from "components/Filters";
import { NS_COMMON, NS_MANAGER } from "constant/index";
import { useTranslations } from "next-intl";
import { useEmployeeOptions } from "store/company/selectors";
import { useMemberOptions } from "store/project/selectors";
import { useParams } from "next/navigation";

const AssignerFilter = (
  props: Omit<DropdownProps, "options" | "name"> & { name?: string },
) => {
  const {
    options,
    onGetOptions,
    isFetching,
    totalPages,
    pageIndex,
    pageSize,
    filters,
  } = useMemberOptions();
  const commonT = useTranslations(NS_COMMON);

  const { id: projectId } = useParams() as { id: string };

  const onEndReached = () => {
    if (isFetching || (totalPages && pageIndex >= totalPages)) return;
    onGetOptions(projectId, { ...filters, pageSize, pageIndex: pageIndex + 1 });
  };

  const onChangeSearch = (name: string, newValue?: string | number) => {
    onGetOptions(projectId, {
      ...filters,
      pageIndex: 1,
      pageSize,
      [name]: newValue,
    });
  };

  return (
    <Dropdown
      placeholder={commonT("form.title.assigner")}
      options={options}
      name="tasks.owner"
      onEndReached={onEndReached}
      onChangeSearch={onChangeSearch}
      searchProps={{
        name: "members.email",
      }}
      {...props}
    />
  );
};

export default memo(AssignerFilter);
