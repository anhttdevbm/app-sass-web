"use client";

import { memo, useMemo } from "react";
import { Stack, StackProps } from "@mui/material";
import Link from "components/Link";
import ChevronIcon from "icons/ChevronIcon";
import { Button, Text } from "components/shared";
import { useHeaderConfig } from "store/app/selectors";
import useBreakpoint from "hooks/useBreakpoint";
import { usePathname } from "next-intl/client";
import { useParams } from "next/navigation";
import { PROJECT_MEMBERS_PATH, PROJECT_TASKS_PATH } from "constant/paths";
import PlusIcon from "icons/PlusIcon";
import { useTranslations } from "next-intl";
import { NS_PROJECT } from "constant/index";

const TopContent = () => {
  const { title, prevPath } = useHeaderConfig();
  const { isMdSmaller } = useBreakpoint();
  const projectT = useTranslations(NS_PROJECT);

  const pathname = usePathname();
  const { id } = useParams() as { id: string };

  const [isMembersOfProjectPath, isTasksOfProjectPath] = useMemo(() => {
    const pattern = pathname.replace(id, "{id}");
    return [pattern === PROJECT_MEMBERS_PATH, pattern === PROJECT_TASKS_PATH];
  }, [id, pathname]);

  const onAddNew = () => {
    const addNewButton = document.getElementById("add_new_id");

    if (!addNewButton) return;

    addNewButton.click();
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={3}
      pb={2}
      display={{ md: "none" }}
      zIndex={1}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        flex={1}
        width="50%"
      >
        {!!prevPath && (
          <Link
            href={prevPath}
            sx={{ height: { xs: 20, md: 24 }, display: { sm: "none" } }}
          >
            <ChevronIcon
              sx={{
                color: "text.primary",
                transform: "rotate(90deg)",
              }}
              fontSize={isMdSmaller ? "small" : "medium"}
            />
          </Link>
        )}
        <Text
          fontWeight={600}
          variant={{ xs: "body2", md: "h4" }}
          display={{ sm: "none" }}
        >
          {title ?? ""}
        </Text>
      </Stack>
      {(isTasksOfProjectPath || isMembersOfProjectPath) && (
        <Button
          startIcon={<PlusIcon />}
          onClick={onAddNew}
          size="small"
          variant="primary"
          sx={{
            minHeight: isTasksOfProjectPath ? 40 : 32,
            height: isTasksOfProjectPath ? 40 : 32,
            px: 1.75,
          }}
        >
          {projectT(
            isTasksOfProjectPath
              ? "detailTasks.createNewTaskList"
              : "detailMembers.addMember",
          )}
        </Button>
      )}
    </Stack>
  );
};

export default memo(TopContent);
