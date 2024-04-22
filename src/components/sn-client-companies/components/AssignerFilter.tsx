import { Dropdown, DropdownProps } from "components/Filters";
import { NS_COMMON, NS_COMPANY } from "constant/index";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { useClientCompanies } from "store/company/selectors";

const AssignerFilter = (
  props: Omit<DropdownProps, "options" | "name"> & { name?: string },
) => {
  const {
    options,
    onGetMemberOptions,
    isFetching,
    totalPages,
    pageIndex,
    pageSize,
    optionsFilters,
  } = useClientCompanies();
  const commonT = useTranslations(NS_COMMON);
  const companyT = useTranslations(NS_COMPANY);

  const onEndReached = () => {
    if (isFetching || (totalPages && pageIndex >= totalPages)) return;
    onGetMemberOptions({
      ...optionsFilters,
      pageSize,
      pageIndex: pageIndex + 1,
    });
  };

  const onChangeSearch = (name: string, newValue?: string | number) => {
    onGetMemberOptions({
      ...optionsFilters,
      pageIndex: 1,
      pageSize,
      [name]: newValue,
    });
  };

  return (
    <Dropdown
      placeholder={companyT("clientCompany.createBy")}
      options={options}
      name="fullname"
      onChangeSearch={onChangeSearch}
      searchProps={{
        name: "fullname",
      }}
      {...props}
    />
  );
};

export default memo(AssignerFilter);
