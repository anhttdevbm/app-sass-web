import { memo, useState, useEffect } from "react";

import { NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import { Dropdown, DropdownProps } from "components/Filters";
import { useMemberOptions } from "store/project/selectors";

type AssignerTaskProps = Omit<
  DropdownProps,
  "options" | "name" | "onChange"
> & {
  onHandler: (newValue: string) => void;
};

const AssignerTask = (props: AssignerTaskProps) => {
  const { options: initialOptions } = useMemberOptions();
  const commonT = useTranslations(NS_COMMON);

  const [options, setOptions] = useState(initialOptions);

  const { onHandler } = props;
  const handleAssigner = async (owner, newValue) => {
    onHandler(newValue);
  };

  const onChangeSearch = (name: string, newValue?: string | number) => {
    const searchTerm = newValue?.toString().toLowerCase();

    if (!searchTerm) {
      setOptions(initialOptions);
      return;
    }

    const filtered = initialOptions.filter(
      (option) =>
        option?.label?.toLowerCase().includes(searchTerm) ||
        option?.subText?.toLowerCase()?.includes(searchTerm),
    );
    setOptions(filtered);
  };

  return (
    <Dropdown
      hasAll={false}
      options={options}
      hasAvatar
      name="owner.id"
      onChangeSearch={onChangeSearch}
      sx={{
        display: { xs: "none", md: "initial" },
        minWidth: "0 !important",
        overflowX: "unset !important",
        width: "100% !important",
        "* > svg": {
          display: "none",
        },
      }}
      onChange={handleAssigner}
      {...props}
    />
  );
};

export default memo(AssignerTask);
