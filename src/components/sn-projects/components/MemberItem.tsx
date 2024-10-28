import { Stack } from "@mui/material";
import Avatar from "components/Avatar";
import { Checkbox, Text } from "components/shared";
import { memo } from "react";
import { Employee } from "store/company/reducer";

type MemberItemProps = Employee & {
  onChange: (id: string, fullname: string) => void;
  checked: boolean;
};

const MemberItem = (props: MemberItemProps) => {
  const { id, fullname, email, avatar, onChange, checked } = props;

  const onSelect = () => {
    onChange(id, fullname);
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
      <Checkbox checked={checked} />
      <Stack direction={{ sm: "row" }} spacing={1.5} flex={1}>
        <Avatar size={40} src={avatar} />
        <Stack>
          <Text variant="h6">{fullname}</Text>
          <Text variant="body2">{email}</Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default memo(MemberItem);
