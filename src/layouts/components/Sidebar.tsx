import { memo, useMemo } from "react";
import { Stack, StackProps } from "@mui/material";
import DoubleArrowIcon from "icons/DoubleArrowIcon";
import Menu from "./Menu";
import AppLogo from "components/AppLogo";
import Link from "components/Link";
import { HOME_PATH, UPGRADE_ACCOUNT_PATH } from "constant/paths";
import CrownIcon from "icons/CrownIcon";
import { Button, IconButton } from "components/shared";
import { useAuth, useSidebar } from "store/app/selectors";
import useBreakpoint from "hooks/useBreakpoint";
import { useTranslations } from "next-intl";
import { NS_LAYOUT, NS_COMMON } from "constant/index";
import { Permission } from "constant/enums";

const Sidebar = (props: StackProps) => {
  const { isExpandedSidebar, onToggleExpandSidebar } = useSidebar();
  const { isLgSmaller } = useBreakpoint();
  const { user } = useAuth();
  const t = useTranslations(NS_LAYOUT);
  const commonT = useTranslations(NS_COMMON);

  const isShowLarge = useMemo(
    () => isExpandedSidebar && !isLgSmaller,
    [isExpandedSidebar, isLgSmaller],
  );

  const onToggle = () => {
    onToggleExpandSidebar();
  };

  return (
    <Stack
      height="100%"
      p={isShowLarge ? { sm: 1.5, xl: 3 } : 1}
      sx={{
        transition: "width .3s",
        backgroundColor: "background.paper",
        "&::-webkit-scrollbar": {
          width: 4,
          height: 4,
        },
      }}
      alignItems="center"
      width={isShowLarge ? { xs: LARGE_SIZE, xl: LARGEST_SIZE } : SMALL_SIZE}
      maxWidth={{ xs: LARGE_SIZE, xl: LARGEST_SIZE }}
      overflow="hidden"
      spacing={isShowLarge ? { xs: 2, xl: 3 } : 2.5}
      display={{ xs: "none", sm: "flex" }}
      borderRight="1px solid"
      borderColor="grey.100"
      {...props}
    >
      <Stack
        width={{ lg: "100%" }}
        direction={isShowLarge ? "row" : "column-reverse"}
        alignItems="center"
        justifyContent={isShowLarge ? "space-between" : "center"}
        spacing={2.5}
      >
        <Link href={HOME_PATH} underline="none">
          <AppLogo
            width={isShowLarge ? 156 : 32}
            height={isShowLarge ? undefined : 32}
            icon={!isShowLarge}
          />
        </Link>
        {!isLgSmaller && (
          <IconButton
            onClick={onToggle}
            noPadding
            tooltip={
              isExpandedSidebar ? t("sidebar.shrink") : t("sidebar.expand")
            }
          >
            <DoubleArrowIcon
              fontSize="medium"
              color="success"
              sx={{
                transform: isExpandedSidebar ? undefined : "rotate(-180deg)",
              }}
            />
          </IconButton>
        )}
      </Stack>
      {!user?.company && !user?.roles?.includes(Permission.SA) && (
        <Link
          href={UPGRADE_ACCOUNT_PATH}
          underline="none"
          sx={{ width: isShowLarge ? "100%" : undefined }}
        >
          {isShowLarge ? (
            <Button
              variant="primary"
              startIcon={
                <CrownIcon
                  sx={{ fontSize: "24px!important", color: "common.white" }}
                  filled
                />
              }
              size="small"
              fullWidth
            >
              {commonT("upgradeAccount")}
            </Button>
          ) : (
            <IconButton
              tooltip={commonT("upgradeAccount")}
              variant="contained"
              size="small"
              sx={{ backgroundColor: "primary.light" }}
            >
              <CrownIcon color="primary" />
            </IconButton>
          )}
        </Link>
      )}
      <Menu />
    </Stack>
  );
};

export default memo(Sidebar);

const LARGEST_SIZE = 340;
const LARGE_SIZE = 280;
const SMALL_SIZE = 60;
