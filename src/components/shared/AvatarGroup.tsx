import React from "react";
import {
  Avatar,
  AvatarGroup as AvatarGroupCore,
  AvatarGroupProps as AvatarGroupCoreProps,
} from "@mui/material";

export interface AvatarProps {
  src?: string | undefined;
}

export interface AvatarGroupProps extends AvatarGroupCoreProps {
  avatars?: AvatarProps[];

  size?: number;
  fontSize?: number;
}

const AvatarGroup = ({
  avatars,
  max = 3,
  size = 28,
  fontSize = 18,
  ...rest
}: AvatarGroupProps) => {
  return (
    <AvatarGroupCore
      max={max}
      componentsProps={{
        additionalAvatar: {
          sx: {
            width: size,
            height: size,
            fontSize: fontSize,
          },
        },
      }}
      {...rest}
    >
      {avatars?.map((avatar, index) => (
        <Avatar
          key={index}
          sx={{
            width: size,
            height: size,
            fontSize: fontSize,
          }}
          src={avatar?.src}
        />
      ))}
    </AvatarGroupCore>
  );
};

export default AvatarGroup;
