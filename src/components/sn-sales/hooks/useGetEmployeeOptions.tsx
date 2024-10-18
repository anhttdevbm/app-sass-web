import { useEffect, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useEmployeeOptions } from "store/company/selectors";

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

  useEffect(() => {
    onGetOptions({ pageIndex: 0, pageSize: 20 });
  }, [onGetOptions]);

  const onSearchEmployee = (name: string, value?: string) => {
    onGetOptions({
      pageIndex: 0,
      pageSize: 20,
      email: value as string,
      fullname: value as string,
      // searchType: value ? "or" : undefined,
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
