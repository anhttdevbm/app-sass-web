import { memo, useEffect, useState } from "react";
import { Button, Text } from "components/shared";
import { useProject, useProjects } from "store/project/selectors";
import FormLayout from "components/FormLayout";
import useToggle from "hooks/useToggle";
import { STATUS_OPTIONS } from "components/sn-projects/components/helpers";
import { Radio, Stack } from "@mui/material";
import CircleTickIcon from "icons/CircleTickIcon";
import { useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import { ProjectStatus } from "store/project/actions";
import { useTranslations } from "next-intl";
import { NS_COMMON, NS_PROJECT } from "constant/index";

const StatusProject = () => {
  const { onUpdateProject } = useProjects();
  const { onAddSnackbar } = useSnackbar();
  const { item } = useProject();
  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);

  const [isShow, onShow, onHide] = useToggle();
  const [status, setStatus] = useState<ProjectStatus | undefined>();

  const onChange = (newStatus: ProjectStatus) => {
    return () => {
      setStatus(newStatus);
    };
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!status || !item?.id) return;
    try {
      const newData = await onUpdateProject(item.id, { status });
      if (newData) {
        onAddSnackbar(
          projectT("detail.notification.changeStatusSuccess"),
          "success",
        );
        onHide();
      }
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  useEffect(() => {
    setStatus(item?.status);
  }, [isShow, item?.status]);

  if (!item) return null;

  return (
    <>
      <Button onClick={onShow} variant="secondary" size="extraSmall">
        {projectT("detail.changeStatus")}
      </Button>

      <FormLayout
        open={isShow}
        onClose={onHide}
        label={projectT("detail.changeStatusProject")}
        onSubmit={onSubmit}
        disabled={!status}
        sx={{
          maxWidth: 320,
          minWidth: { xs: 320, sm: 400 },
          minHeight: "fit-content",
        }}
        contentProps={{
          sx: {
            "&>div": {
              alignItems: "center",
            },
          },
        }}
      >
        <Stack>
          {STATUS_OPTIONS.map((item) => (
            <Stack key={item.value} direction="row" alignItems="center">
              <Radio
                checked={item.value === status}
                onClick={onChange(item.value)}
                checkedIcon={<CircleTickIcon color="success" />}
                sx={{ color: "grey.300" }}
              />
              <Text variant="body2">{commonT(item.label)}</Text>
            </Stack>
          ))}
        </Stack>
      </FormLayout>
    </>
  );
};

export default memo(StatusProject);
