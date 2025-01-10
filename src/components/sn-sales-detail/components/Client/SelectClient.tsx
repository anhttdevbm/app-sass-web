import { Stack, StackProps, Theme, selectClasses } from "@mui/material";
import Avatar from "components/Avatar";
import { Dropdown, DropdownProps } from "components/Filters";
import { Text } from "components/shared";
import { Option } from "constant/types";
import Image from "next/image";
import LogoPlaceholderImage from "public/images/img-user-placeholder.webp";
import { memo, useEffect, useState } from "react";

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
        height: "auto",
        minHeight: 58,
        minWidth: "300",
        maxWidth: "unset",
        backgroundColor: "grey.50",
        py: "8px!important",
        px: "12px!important",
        "& >svg": {
          fontSize: 20,
          position: "absolute",
          top: "50%",
          right: 12,
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
    <Stack direction="row" gap={1} minHeight={42}>
      <Stack sx={{ marginBottom: "auto", marginTop: "auto" }}>
        {/* {!!item?.avatar?.length && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item?.avatar}
            style={{ width: 42, height: 42 }}
            alt={item?.label ?? item?.subText ?? ""}
            className="rounded"
          />
        )}
        {!item?.avatar?.length && (
          <Image
            src={LogoPlaceholderImage}
            alt={item?.label ?? ""}
            style={{ width: 32, height: 32 }}
            className="rounded"
          ></Image>
        )} */}
        <Avatar src={item?.avatar} alt={item?.label ?? ""} size={32} />
      </Stack>
      <Stack>
        <Text
          sx={{
            fontSize: 20,
            lineHeight: "24px",
            fontWeight: 600,
            width: "auto",
            maxWidth: { xs: "calc(100vw - 140px)", sm: "unset" },
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item?.label}
        </Text>
        <Text
          sx={{
            fontSize: 14,
            color: "#666666",
            lineHeight: "18px",
            width: "auto",
            maxWidth: "unset",
            whiteSpace: "normal",
          }}
        >
          {item?.subText}
        </Text>
      </Stack>
    </Stack>
  );
};
