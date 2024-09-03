import { Stack } from "@mui/material";
import AppLogo from "components/AppLogo";
import Link from "components/Link";
import { Text } from "components/shared";
import SwitchLanguage from "components/SwitchLanguage";
import SwitchTheme from "components/SwitchTheme";
import { DataStatus } from "constant/enums";
import { HOME_PATH, PROJECTS_PATH } from "constant/paths";
import { patternUrlDetailDoc, patternUrlDocAdd } from "constant/regex";
import useBreakpoint from "hooks/useBreakpoint";
import useToggle from "hooks/useToggle";
import ChevronIcon from "icons/ChevronIcon";
import { usePathname, useRouter } from "next-intl/client";
import Image from "next/image";
import { memo } from "react";
import { useHeaderConfig } from "store/app/selectors";
import { useProjects } from "store/project/selectors";
import { getPath } from "utils/index";
import { AccountInfo, Drawer } from "./components";

const Header = () => {
  const { title, searchPlaceholder, prevPath, key, imageUrl } =
    useHeaderConfig();
  const { breakpoint } = useBreakpoint();
  const { push } = useRouter();
  const pathname = usePathname();
  const { pageSize, filters, status, onGetProjects } = useProjects();

  const [isFocused, onFocused, onUnFocused] = useToggle();

  const onSearch = (name: string, newValue?: string) => {
    const isFirstFetchedSuccess = status === DataStatus.SUCCEEDED;
    const queries = {
      pageIndex: 1,
      pageSize,
      [name]: newValue,
    };
    if (isFirstFetchedSuccess) {
      onGetProjects(queries);
    }
    const path = getPath(PROJECTS_PATH, queries);
    push(path);
  };

  if (patternUrlDetailDoc.test(pathname) || patternUrlDocAdd.test(pathname)) {
    return null;
  }
  return (
    <Stack
      height={HEADER_HEIGHT}
      flexShrink={0}
      borderBottom="1px solid"
      borderColor="grey.100"
      bgcolor="background.paper"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      px={{ xs: 2, md: 3 }}
      width="100%"
    >
      <Link href={HOME_PATH} underline="none">
        <AppLogo height={48} className="only-mobile" />
      </Link>
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        overflow="hidden"
        flex={1}
      >
        {prevPath ? (
          <Link
            href={prevPath}
            sx={{ height: 24, display: { xs: "none", sm: "initial" } }}
            underline="none"
          >
            <Stack
              sx={{
                height: 28,
                display: "flex",
                gap: 1,
                flexDirection: "row",
              }}
            >
              <ChevronIcon
                sx={{ color: "text.primary", transform: "rotate(90deg)" }}
                fontSize="medium"
              />
              {!!imageUrl && (
                <Image
                  src={imageUrl}
                  width={24}
                  height={24}
                  alt="Image"
                  className="rounded"
                />
              )}
              {!!title && (
                <Text
                  variant="h5"
                  sx={{ justifyContent: "center", margin: "auto" }}
                  display={{ xs: "none", sm: "initial" }}
                >
                  {title ?? ""}
                </Text>
              )}
            </Stack>
          </Link>
        ) : (
          <Text variant="h5" display={{ xs: "none", sm: "initial" }} noWrap>
            {title ?? ""}
          </Text>
        )}
      </Stack>
      {/* {breakpoint}-{width} */}
      <Stack direction="row" alignItems="center" spacing={3}>
        {/* {Boolean(searchPlaceholder && key) && (
          <Search
            sx={{ display: { xs: "none", sm: "initial" } }}
            placeholder={searchPlaceholder}
            name={key as string}
            onChange={onSearch}
            InputProps={{
              onFocus: onFocused,
              onBlur: onUnFocused,
            }}
            hasClear={false}
            emitWhenEnter={isFocused}
            value={filters?.[key as string]}
          />
        )} */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <SwitchLanguage />
          <SwitchTheme />
        </Stack>
        <AccountInfo />
      </Stack>
      <Drawer />
    </Stack>
  );
};

export default memo(Header);

export const HEADER_HEIGHT = 60;
