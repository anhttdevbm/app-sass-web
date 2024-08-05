"use client";

import { Stack } from "@mui/material";
import { Endpoint } from "api";
import Wrapper from "components/Wrapper";
import { TabList, TopContent } from "components/sn-project-detail/components";
import { NS_COMMON, NS_PROJECT, SCROLL_ID } from "constant/index";
import { PROJECTS_PATH, PROJECT_MEMBERS_PATH } from "constant/paths";
import useTheme from "hooks/useTheme";
import { useTranslations } from "next-intl";
import { usePathname } from "next-intl/client";
import { useEffect, useMemo, useRef } from "react";
import { useHeaderConfig } from "store/app/selectors";
import { useProject, useProjects } from "store/project/selectors";
import { getPath } from "utils/index";
import useBreakpoint from "../hooks/useBreakpoint";

type ProjectDetailLayoutProps = {
  children: React.ReactNode;
  id: string;
};

const ProjectDetailLayout = ({ children, id }: ProjectDetailLayoutProps) => {
  const { onGetProject, item } = useProject();
  const { filters, pageIndex, pageSize } = useProjects();
  const { onUpdateHeaderConfig } = useHeaderConfig();
  const { isDarkMode } = useTheme();
  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);
  const { isLgBigger } = useBreakpoint();

  const pathname = usePathname();

  const isMembersOfProjectPath = useMemo(
    () => pathname.replace(id, "{id}") === PROJECT_MEMBERS_PATH,
    [id, pathname],
  );

  const dataStringifyRef = useRef<string | undefined>();

  useEffect(() => {
    if (!id) return;
    onGetProject(id);
  }, [id, onGetProject]);

  useEffect(() => {
    dataStringifyRef.current = JSON.stringify({
      ...filters,
      pageIndex,
      pageSize,
    });
  }, [filters, pageIndex, pageSize]);

  useEffect(() => {
    const parsedQueries = dataStringifyRef.current
      ? JSON.parse(dataStringifyRef.current)
      : {};

    const prevPath = getPath(PROJECTS_PATH, parsedQueries);

    onUpdateHeaderConfig({
      title: item?.name,
      imageUrl: item?.avatar?.link,
      searchPlaceholder: commonT("searchBy", { name: projectT("list.key") }),
      prevPath,
      endpoint: Endpoint.PROJECTS,
      key: "name",
    });
    return () => {
      onUpdateHeaderConfig({
        title: undefined,
        imageUrl: undefined,
        searchPlaceholder: undefined,
        prevPath: undefined,
        endpoint: undefined,
        key: undefined,
      });
    };
  }, [commonT, item?.name, item?.avatar?.link, onUpdateHeaderConfig, projectT]);

  return (
    <Wrapper
      sx={{
        overflow: "hidden",
        padding: `${isLgBigger ? "24" : "16"}px!important`,
        paddingTop: "0px!important",
      }}
      id={SCROLL_ID}
      overflow="auto"
      inFrame={isMembersOfProjectPath}
    >
      <Stack
        position="relative"
        zIndex={12}
        bgcolor={isDarkMode ? "background.default" : "background.paper"}
      >
        <TopContent />
        <TabList />
      </Stack>
      {children}
    </Wrapper>
  );
};

export default ProjectDetailLayout;
