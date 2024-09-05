import { MenuItem, Stack } from "@mui/material";
import { Text, Checkbox } from "components/shared";
import Avatar from "components/Avatar";
import { IMember } from "../../FilterMember";

export default function MemberListSelect({
  member,
  checked,
  onChangeMember,
}: {
  member: IMember;
  checked: boolean;
  onChangeMember: (id: string, fullname: string) => void;
}) {
  return (
    <MenuItem key={member.id} sx={{ height: "100%", width: "100%" }}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        onClick={() => onChangeMember(member.id,  member.fullname)}
        sx={{
          cursor: "pointer",
        }}
      >
        <Checkbox checked={checked} />
        <Stack direction={{ sm: "row" }} spacing={1.5} flex={1}>
          <Avatar size={40} src={member.avatar?.link} />
          <Stack>
            <Text variant="h6">{member.fullname}</Text>
            <Text variant="body2">{member.email}</Text>
          </Stack>
        </Stack>
      </Stack>
    </MenuItem>
  );
}
