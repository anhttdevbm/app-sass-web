import { memo } from "react";
import { Box, ButtonBase, MenuItem, MenuList } from "@mui/material";
import { Text } from "components/shared";
import { useAuth } from "store/app/selectors";
import Link from "components/Link";
import UserIcon from "icons/UserIcon";
import { ACCOUNT_INFO_PATH, CHANGE_PASSWORD_PATH } from "constant/paths";
import SignOutIcon from "icons/SignOutIcon";
import KeyIcon from "icons/KeyIcon";
import { useAppDispatch } from "store/hooks";
import { reset as appReset } from "store/app/reducer";
import { reset as projectReset } from "store/project/reducer";
import { reset as managerReset } from "store/manager/reducer";
import { reset as companyReset } from "store/company/reducer";
import { reset as aiChatReset } from "store/aiChat/reducer";
import { useTranslations } from "next-intl";
import { NS_LAYOUT } from "constant/index";

type UserActionsProps = {
  onClose: () => void;
};

const UserActions = ({ onClose }: UserActionsProps) => {
  const { user, onSignOut: onSignOutAuth } = useAuth();
  const dispatch = useAppDispatch();
  const t = useTranslations(NS_LAYOUT);

  const onSignOut = () => {
    onSignOutAuth();
    dispatch(appReset());
    dispatch(projectReset());
    dispatch(managerReset());
    dispatch(companyReset());
    dispatch(aiChatReset())
  };

  if (!user) return null;

  return (
    <MenuList component={Box} sx={{ pb: 0 }}>
      {OPTIONS.map((item) => (
        <MenuItem
          className="row-center"
          component={Link}
          onClick={onClose}
          href={item.href}
          sx={{
            py: 1,
            px: 0,

            color: "grey.400",
            "& svg": {
              color: "grey.400",
            },
            "&:hover": {
              color: "primary.main",
              backgroundColor: "transparent",
            },
          }}
          key={item.href}
          underline="none"
        >
          {item.icon}
          <Text ml={1.5} variant="body2" color="inherit">
            {t(item.label)}
          </Text>
        </MenuItem>
      ))}
      <MenuItem
        component={ButtonBase}
        onClick={onSignOut}
        sx={{
          width: "100%",
          py: 1,
          px: 0,
          "&:hover": {
            color: "error.main",
            backgroundColor: "transparent",
            "& svg": {
              color: "grey.900",
            },
          },
        }}
      >
        <SignOutIcon />
        <Text ml={1.5} variant="body2" color="inherit">
          {t("header.account.signOut")}
        </Text>
      </MenuItem>
    </MenuList>
  );
};

export default memo(UserActions);

export const OPTIONS = [
  {
    label: "header.account.accountInformation",
    icon: <UserIcon />,
    href: ACCOUNT_INFO_PATH,
  },
  {
    label: "header.account.changePassword",
    icon: <KeyIcon />,
    href: CHANGE_PASSWORD_PATH,
  },
];
