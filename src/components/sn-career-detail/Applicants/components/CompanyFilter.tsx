import { memo, useEffect } from "react";
import { Dropdown, DropdownProps } from "components/Filters";
import { useCompanyOptions } from "store/manager/selectors";
import { NS_COMMON, NS_MANAGER } from "constant/index";
import { useTranslations } from "next-intl";

const CompanyFilter = (props: Omit<DropdownProps, "options" | "name">) => {
  const {
    options,
    onGetOptions,
    isFetching,
    totalPages,
    pageIndex,
    pageSize,
    filters,
  } = useCompanyOptions();
  const commonT = useTranslations(NS_COMMON);
  const managerT = useTranslations(NS_MANAGER);

  const onEndReached = () => {
    if (isFetching || (totalPages && pageIndex >= totalPages)) return;
    onGetOptions({ ...filters, pageSize, pageIndex: pageIndex + 1 });
  };

  const onChangeSearch = () => {
    //
  };

  useEffect(() => {
    onGetOptions({ pageIndex: 1, pageSize: 20 });
  }, [onGetOptions]);

  return (
    <Dropdown
      placeholder={managerT("employeeList.company")}
      options={options}
      name="status"
      onEndReached={onEndReached}
      {...props}
    />
  );
};

export default memo(CompanyFilter);
