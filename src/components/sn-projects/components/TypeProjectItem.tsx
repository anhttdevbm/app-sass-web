import { memo } from "react";
import { Stack } from "@mui/material";
import { Text } from "components/shared";

type TypeProjectItemProps =  {
  onChange: (value: string | number, label: string) => void;
  checked: boolean;
  value: string | number;
  label: string;
};

const TypeProjectItem = (props: TypeProjectItemProps) => {
  const { value, label, onChange, checked } = props;

  const onSelect = () => {
    onChange(value, label);
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
      onClick={onSelect}
      sx={{
        cursor: "pointer",
      }}
    >
      {/* <Checkbox checked={checked} /> */}
      <Stack direction={{ sm: "row" }} spacing={1.5} flex={1}>
        <Stack>
          <Text variant="body2">{label}</Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default memo(TypeProjectItem);
