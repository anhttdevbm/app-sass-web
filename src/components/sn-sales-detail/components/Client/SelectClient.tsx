import { Stack, StackProps, Theme, selectClasses } from "@mui/material";
import { Dropdown, DropdownProps } from "components/Filters";
import { Text } from "components/shared";
import { Option } from "constant/types";
import Image from "next/image";
import LogoPlaceholderImage from "public/images/img-logo-placeholder.webp";
import { ChangeEvent, memo, useEffect, useMemo, useState } from "react";

type SelectValueProps = StackProps & {
  value: string | number;
  options: Option[];
  children?: string | number | React.ReactNode;
};

const SelectClient = (
  props: Omit<DropdownProps, "options" | "name"> & {
    name?: string;
    options: Option[];
  },
) => {
  const { rootSx, onChange, value, hasAll = true, options } = props;

  return (
    <Dropdown
      size="small"
      hasAll={hasAll}
      onlyContent
      name="clientId"
      rootSx={{
        height: 58,
        backgroundColor: "grey.50",
        "& >svg": {
          fontSize: 20,
          position: "absolute",
          top: "50%",
          right: 0,
          zIndex: 0,
          transform: "translateY(-50%)",
          px: "0px!important",
          [`& .${selectClasses.multiple}}`]: {
            color: "red",
          },
          [`& .${selectClasses.outlined}`]: {
            pr: "0!important",
            mr: ({ spacing }: { spacing: Theme["spacing"] }) =>
              `${spacing(4)}!important`,
            "& .sub": {
              display: "none",
            },
          },
        },
        ...rootSx,
      }}
      renderValue={(value) => <SelectValue value={value} options={options} />}
      {...props}
    />
  );
};

export default memo(SelectClient);

const SelectValue = (props: SelectValueProps) => {
  const { options, value } = props;
  const [item, setItem] = useState<Option>();

  useEffect(() => {
    const option = options.find((item) => item.value === value);
    setItem(option);
  }, [value, setItem, options]);

  return (
    <Stack direction="row" gap={1}>
      <Stack sx={{ marginBottom: "auto", marginTop: "auto" }}>
        {!!item?.avatar?.length && (
          <Image src={item?.avatar} alt={item?.label}></Image>
        )}
        {!item?.avatar?.length && (
          <Image src={LogoPlaceholderImage} alt={item?.label ?? ""}></Image>
        )}
      </Stack>
      <Stack>
        <Text>{item?.label}</Text>
        <Text sx={{ fontSize: 14 }}>{item?.subText}</Text>
      </Stack>
    </Stack>
  );
};
