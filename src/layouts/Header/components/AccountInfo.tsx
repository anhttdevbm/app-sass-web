import { memo, useState, MouseEvent, useId, useRef, ChangeEvent, useMemo } from "react";
import {
  ButtonBase,
  Divider,
  Popover,
  popoverClasses,
  Stack,
} from "@mui/material";
import { Button, Text } from "components/shared";
import ChevronIcon from "icons/ChevronIcon";
import { useAuth } from "store/app/selectors";
import Link from "components/Link";
import { UPGRADE_ACCOUNT_PATH, ACCOUNT_INFO_PATH } from "constant/paths";
import Avatar from "components/Avatar";
import CrownIcon from "icons/CrownIcon";
import { useAppDispatch } from "store/hooks";
import { reset as appReset } from "store/app/reducer";
import { reset as projectReset } from "store/project/reducer";
import { reset as managerReset } from "store/manager/reducer";
import { reset as companyReset } from "store/company/reducer";
import { useTranslations } from "next-intl";
import {  NS_ACCOUNT, NS_COMMON, NS_LAYOUT } from "constant/index";
import { Permission } from "constant/enums";
import UserActions from "./UserActions";

const AccountInfo = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const popoverId = useId();
  const { user, onSignOut: onSignOutAuth } = useAuth();
  const dispatch = useAppDispatch();
  const accountT = useTranslations(NS_ACCOUNT);
  const commonT = useTranslations(NS_COMMON);
  const t = useTranslations(NS_LAYOUT);


  const onOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onSignOut = () => {
    onSignOutAuth();
    dispatch(appReset());
    dispatch(projectReset());
    dispatch(managerReset());
    dispatch(companyReset());
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  if (!user) return null;
  
  return (
    <>
      <Stack
        component={ButtonBase}
        disableRipple
        direction="row"
        alignItems="center"
        borderRadius={1}
        spacing={1}
        color="common.white"
        sx={{
          cursor: "pointer",
        }}
        onClick={onOpen}
        display={{ xs: "none", sm: "flex" }}
      >
        <Avatar size={32} alt={user.fullname} src={user?.avatar?.link} />

        <ChevronIcon fontSize="medium" sx={{ color: "grey.900" }} />
      </Stack>

      <Popover
        id={popoverId}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          [`& .${popoverClasses.paper}`]: {
            backgroundImage: "none",
            minWidth: 216,
            maxWidth: 236,
          },
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 1,
              mt: 0.5,
            },
          },
        }}
      >
        <Stack
          p={2}
          sx={{
            boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.1)",
            border: "1px solid",
            borderColor: "grey.100",
            borderBottomLeftRadius: 1,
            borderBottomRightRadius: 1,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} py={2}>
          <Link href={ACCOUNT_INFO_PATH} underline="none" onClick={onClose}>
            <Avatar
                size={60}
                alt={user.fullname}
                src={user?.avatar?.link}
              />
          </Link>
            
            <Stack flex={1} overflow="hidden">
              <Text
                variant="h6"
                color="grey.400"
                sx={{ wordBreak: "break-all" }}
              >
                {user.fullname}
              </Text>
              <Text
                variant="caption"
                color="grey.400"
                sx={{ wordBreak: "break-all" }}
              >
                {user?.position?.name ?? "--"}
              </Text>
              <Text
                variant="body2"
                color="grey.400"
                sx={{ wordBreak: "break-all" }}
              >
                {user.email}
              </Text>
            </Stack>
          </Stack>
          <Divider sx={{ backgroundColor: "grey.100" }} />
          {!user?.company && !user?.roles?.includes(Permission.SA) && (
            <Link href={UPGRADE_ACCOUNT_PATH} underline="none">
              <Button
                variant="secondary"
                startIcon={<CrownIcon sx={{ fontSize: 20 }} />}
                size="extraSmall"
                sx={{ mt: 1 }}
              >
                {commonT("upgradeAccount")}
              </Button>
            </Link>
          )}
          <UserActions onClose={onClose} />
        </Stack>
      </Popover>
    </>
  );
};

export default memo(AccountInfo);
