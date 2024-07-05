import { ChangeEvent, memo, useMemo, useState } from "react";
import { Select, SelectProps } from "components/shared";
import ChevronIcon from "icons/ChevronIcon";
import { TagOutlined } from "@mui/icons-material";
import { Stack } from "@mui/material";
import TagIcon from "icons/TagIcon";

export type DropdownProps = Omit<SelectProps, "name" | "onChange"> & {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (name: string, value: any) => void;
};

const Dropdown = (props: DropdownProps) => {
  const {
    rootSx,
    name,
    onChange,
    value,
    sx,
    options,
    hasAll = false,
    ...rest
  } = props;

  const hasValue = useMemo(
    () => options.some((option) => option.value === value),
    [options, value],
  );

  const [open, setOpen] = useState<boolean>(false);

  const onChangeSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    onChange(name, value);
  };
  return (
    <Stack direction={"row"} alignItems={"center"}>
      {/* {!value && value?.toString().length == 0 ? (
        <TagIcon sx={{ color: "grey.400" }} />
      ) : (
        ""
      )} */}

      <Select
        size="small"
        hasAll={hasAll}
        onlyContent
        defaultValue={"all"}
        rootSx={{
          color: hasValue ? "primary.main" : "grey.400",
          fontWeight: 600,
          height: 32,
          "&": {
            position: "relative",
            width: "100%",
          },
          "& .text-option": {
            fontWeight: 600,
            color: "grey.400",
            whiteSpace: "wrap",
            textAlign: "left",
            width: "100% important",
          },
          "& >svg": {
            fontSize: 20,
            position: "absolute",
            top: "50%",
            right: 0,
            zIndex: 0,
            transform: "translateY(-50%)",
          },

          ...rootSx,
        }}
        name={name}
        onChange={onChangeSelect}
        value={value}
        showPlaceholder
        SelectProps={{
          renderValue(value) {
            const selected = options?.find((item) => item.value === value);
            return selected?.label ?? <TagIcon sx={{ color: "grey.400" }} />;
          },
          MenuProps: {
            sx: {
              height: "320px",
            },
          },
        }}
        sx={{
          minWidth: "fit-content",
          height: 32,
          fontWeight: 600,
          ...sx,
        }}
        options={options}
        {...rest}
      />
    </Stack>
  );
};

export default memo(Dropdown);
