import { memo, useEffect, MouseEvent, useId, useState } from "react";
import {
  ButtonBase,
  IconButton,
  Drawer as MuiDrawer,
  Popover,
  Stack,
  drawerClasses,
  popoverClasses,
} from "@mui/material";
import { Menu } from "layouts/components";
import useToggle from "hooks/useToggle";
import BarsIcon from "icons/BarsIcon";
import CloseIcon from "icons/CloseIcon";
import AppLogo from "components/AppLogo";
import { useAuth } from "store/app/selectors";
import { Button, Text } from "components/shared";
import Avatar from "components/Avatar";
import useBreakpoint from "hooks/useBreakpoint";
import Link from "components/Link";
import { HOME_PATH, UPGRADE_ACCOUNT_PATH } from "constant/paths";
import CrownIcon from "icons/CrownIcon";
import { Permission } from "constant/enums";
import { useTranslations } from "next-intl";
import { NS_COMMON } from "constant/index";
import { usePathname } from "next-intl/client";
import { useAppDispatch } from "store/hooks";
import UserActions from "./UserActions";

const Drawer = () => {
  const [isShow, onShow, onHide] = useToggle(false);

  const pathname = usePathname();
  const { isSmSmaller } = useBreakpoint();
  const { user } = useAuth();
  const commonT = useTranslations(NS_COMMON);

  useEffect(() => {
    onHide();
  }, [isSmSmaller, onHide, pathname]);

  return (
    <>
      <IconButton onClick={onShow} className="only-mobile" sx={{ height: 40 }}>
        <BarsIcon color="primary" />
      </IconButton>
      <MuiDrawer
        anchor="left"
        sx={{
          [`& .${drawerClasses.paper}`]: {
            backgroundColor: "background.paper",
            backgroundImage: "none",
            width: "100%",
            px: 3,
            py: 1.5,
          },
        }}
        open={isShow}
        onClose={onHide}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Link href={HOME_PATH} underline="none">
            <AppLogo width={156} />
          </Link>

          <IconButton onClick={onHide} sx={{ color: "grey.900" }}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <UserInfo />

        {!user?.company && !user?.roles?.includes(Permission.SA) && (
          <Link
            href={UPGRADE_ACCOUNT_PATH}
            underline="none"
            sx={{ mb: 2, mt: 1 }}
          >
            <Button
              variant="secondary"
              startIcon={<CrownIcon sx={{ fontSize: 20 }} />}
              size="small"
              fullWidth
            >
              {commonT("upgradeAccount")}
            </Button>
          </Link>
        )}

        <Menu />
      </MuiDrawer>
    </>
  );
};

export default memo(Drawer);

const UserInfo = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const popoverId = useId();
  const { user, onSignOut: onSignOutAuth } = useAuth();
  const dispatch = useAppDispatch();

  const onOpen = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  if (!user) return null;

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        py={2}
        sx={{
          cursor: "pointer",
        }}
        onClick={onOpen}
      >
        <Avatar size={64} alt={user.fullname} src={user?.avatar?.link} />
        <Stack>
          <Text fontWeight={600} sx={{ wordBreak: "break-all" }}>
            {user.fullname}
          </Text>
          <Text
            variant="caption"
            color="grey.400"
            sx={{ wordBreak: "break-all" }}
          >
            {user?.position?.name ?? "--"}
          </Text>
          <Text variant="body2" sx={{ wordBreak: "break-all" }}>
            {user.email}
          </Text>
        </Stack>
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
            maxWidth: 300,
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
          <UserActions onClose={onClose} />
        </Stack>
      </Popover>
    </>
  );
};
