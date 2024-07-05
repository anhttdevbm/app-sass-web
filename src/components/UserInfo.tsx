import { memo } from "react";
import { Stack, StackProps } from "@mui/material";
import Avatar from "./Avatar";
import { Text } from "./shared";
import { User } from "constant/types";

type UserInfoProps = {
  user?: User;
  size?: number;
} & StackProps;

const UserInfo = (props: UserInfoProps) => {
  const { user, size = 40, ...rest } = props;

  if (!user) return null;

  return (
    <Stack direction="row" alignItems="center" spacing={1} {...rest}>
      <Avatar size={size} src={user?.avatar?.link} alt={user.fullname} />
      <Stack>
        <Text variant="h5" color="text.primary" textAlign="left">
          {user.fullname}
        </Text>
        <Text variant="body2" color="grey.400" textAlign="left">
          {user?.position?.name}
        </Text>
        <Text variant="body2" color="grey.400" textAlign="left">
          {user.email}
        </Text>
      </Stack>
    </Stack>
  );
};

export default memo(UserInfo);
