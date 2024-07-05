import { memo, useEffect, useState } from "react";
import { useEmployeeOptions } from "store/company/selectors";

import { NS_COMMON, NS_PROJECT } from "constant/index";
import { useTranslations } from "next-intl";
import { useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI, getPath } from "utils/index";

import { useProjects } from "store/project/selectors";
import useQueryParams from "hooks/useQueryParams";
import { Dropdown } from "components/Filters";

type AssignerProps = {
  value?: string;
  id: string;
  rootSx?: object;
  placeholder?: string;
};

const Assigner = (props: AssignerProps) => {
  const { value, id } = props;

  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);
  const { initQuery, isReady, query } = useQueryParams();

  const {
    options: employeeOptions,
    onGetOptions,
    isFetching,
    filters,
    pageSize,
    pageIndex,
    totalPages,
  } = useEmployeeOptions();
  const { onUpdateProject, onGetProjects } = useProjects();
  const { onAddSnackbar } = useSnackbar();

  useEffect(() => {
    onGetOptions({ pageIndex: 1, pageSize: 20 });
  }, [onGetOptions]);

  useEffect(() => {
    setFilteredOptions(employeeOptions)
  }, [employeeOptions])

  const [filteredOptions, setFilteredOptions] = useState(employeeOptions);

  const handleAssigner = async (newAssigner, value) => {
    try {
      await onUpdateProject(id, { owner: value });
      onAddSnackbar(
        projectT("taskDetail.notification.assignSuccess"),
        "success",
      );
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  const onChangeSearch = (name: string, newValue?: string | number) => {
    const searchTerm = newValue?.toString().toLowerCase();

    if (searchTerm) {
      const filtered = employeeOptions.filter((option) =>
        option?.label?.toLowerCase().includes(searchTerm) ||
        option?.subText?.toLowerCase()?.includes(searchTerm)
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(employeeOptions);
    }
  };

  return (
    <Dropdown
      hasAll={false}
      options={filteredOptions}
      hasAvatar
      name="owner.id"
      onChangeSearch={onChangeSearch}
      sx={{
        display: { xs: "none", md: "initial" },
        minWidth: "0 !important",
        overflowX: "unset !important",
      }}
      onChange={handleAssigner}
      {...props}
    />
  );
};

export default memo(Assigner);
