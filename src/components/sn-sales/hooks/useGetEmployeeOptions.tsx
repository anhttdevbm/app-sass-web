import { useEffect, useMemo } from "react";
import { useEmployeeOptions } from "store/company/selectors";
import { useSaleDetail } from "store/sales/selectors";
import { useFormContext, useWatch } from "react-hook-form";

const useGetEmployeeOptions = () => {
  const {
    options,
    onGetOptions,
    isFetching,
    totalPages,
    pageIndex,
    pageSize,
    filters,
  } = useEmployeeOptions();
  const onEndReachedEmployeeOptions = () => {
    if (isFetching || (totalPages && pageIndex >= totalPages)) return;
    onGetOptions({ ...filters, pageSize, pageIndex: pageIndex + 1 });
  };

  const onSearchEmployee = (name: string, value = "") => {
    onGetOptions({
      pageIndex: 1,
      pageSize: 20,
      email: (value as string) || "",
      fullname: (value as string) || "",
      searchType: "or",
    });
  };

  return {
    employeeOptions: options,
    employeeIsFetching: isFetching,
    onEndReachedEmployeeOptions,
    onGetEmployeeOptions: onGetOptions,
    onSearchEmployee,
  };
};
export const useGetMemberOptions = () => {
  const { options } = useEmployeeOptions();
  const { control } = useFormContext() || { control: null };

  const members = useWatch({
    control,
    name: "members",
  });

  const filteredOptions = useMemo(() => {
    return options.filter((option) => {
      return members?.find((member) => member.id === option.value);
    });
  }, [options, members]);

  return { memberOptions: filteredOptions };
};

export const useFetchEmployeeOptions = () => {
  const { onGetOptions } = useEmployeeOptions();

  useEffect(() => {
    onGetOptions({ pageIndex: 1, pageSize: 20 });
  }, [onGetOptions]);
};
export default useGetEmployeeOptions;
