import { Stack, StackProps } from "@mui/material";
import Link from "components/Link";
import { Text } from "components/shared";
import {
  EditProject,
  SavedProject,
  StatusProject,
} from "components/sn-project-detail/Information/components";
import { NS_PROJECT } from "constant/index";
import {
  PROJECT_BUDGET_PATH,
  PROJECT_DOCUMENT_PATH,
  PROJECT_INFORMATION_PATH,
  PROJECT_MEMBERS_PATH,
  PROJECT_TASKS_PATH
} from "constant/paths";
import useTheme from "hooks/useTheme";
import { useTranslations } from "next-intl";
import { usePathname } from "next-intl/client";
import { useParams } from "next/navigation";
import { memo, useMemo } from "react";
import { getPath } from "utils/index";

type TabItemProps = {
  href: string;
  label: string;
};

const TabList = () => {
  const { id } = useParams() as { id: string };
  const pathname = usePathname();

  const isMembersOfProjectPath = useMemo(
    () => pathname.replace(id, "{id}") === PROJECT_MEMBERS_PATH,
    [id, pathname],
  );

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        borderBottom={{ md: "1px solid" }}
        justifyContent="space-between"
        borderColor={{ md: "grey.100" }}
        width="100%"
        overflow="auto"
        bgcolor="background.paper"
        py={1}
        px={2}
        borderRadius="1rem 1rem 0 0"
      >
        <Stack
          direction="row"
          alignItems="center"
          border="solid 1px"
          borderColor="grey.100"
          borderRadius="2rem"
        >
          {TABS.map((tab) => (
            <TabItem key={tab.label} {...tab} />
          ))}
        </Stack>

        <TabActions />
      </Stack>
    </>
  );
};

export default memo(TabList);

const TabItem = (props: TabItemProps) => {
  const { href, label } = props;

  const projectT = useTranslations(NS_PROJECT);
  const { isDarkMode } = useTheme();

  const pathname = usePathname();
  const params = useParams();

  const isActiveLink = useMemo(() => {
    const suffixPath = getSuffixPath(pathname);
    const suffixHref = getSuffixPath(href);
    return suffixPath === suffixHref;
  }, [href, pathname]);

  return (
    <Link
      href={getPath(href, undefined, { id: params.id as string })}
      underline="none"
      sx={{
        minWidth: 120,
        bgcolor: isActiveLink
          ? isDarkMode
            ? "grey.50"
            : "primary.light"
          : "transparent",
        "&:hover": {
          bgcolor: isDarkMode ? "grey.50" : "primary.light",
        },
        py: { xs: 1, sm: 1 },
        px: { xs: 2, sm: 3.5 },
        borderRadius: "2rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Text
        variant="body2"
        color={isActiveLink ? "blue.500" : "grey.300"}
        fontWeight={600}
        whiteSpace="nowrap"
      >
        {projectT(label)}
      </Text>
    </Link>
  );
};

const TabActions = (props: StackProps) => {
  const pathname = usePathname();

  const isDetailPath = useMemo(() => {
    const suffixPath = getSuffixPath(pathname);
    const suffixDetail = getSuffixPath(PROJECT_INFORMATION_PATH);
    return suffixPath === suffixDetail;
  }, [pathname]);

  if (!isDetailPath) return null;

  return (
    <Stack direction="row" alignItems="center" spacing={3} px={3} {...props}>
      <StatusProject />
      <SavedProject />
      <EditProject />
    </Stack>
  );
};

const TABS = [
  { label: "tabList.tasks", href: PROJECT_TASKS_PATH },
  // { label: "tabList.activities", href: PROJECT_ACTIVITIES_PATH },
  { label: "tabList.budget", href: PROJECT_BUDGET_PATH },
  { label: "tabList.documents", href: PROJECT_DOCUMENT_PATH },
  { label: "tabList.members", href: PROJECT_MEMBERS_PATH },
  { label: "tabList.information", href: PROJECT_INFORMATION_PATH },
];

const getSuffixPath = (path: string) => {
  const url = new URL(path, window.location.origin);
  const arrSplit = url.pathname.split("/");
  return arrSplit[3];
};
