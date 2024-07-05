import { memo, useMemo } from "react";
import PencilIcon from "icons/PencilIcon";
import { IconButton } from "components/shared";
import { useProject, useProjects } from "store/project/selectors";
import Form, { ProjectDataForm } from "components/sn-projects/Form";
import { INITIAL_VALUES } from "components/sn-projects/components/helpers";
import { DataAction } from "constant/enums";
import useToggle from "hooks/useToggle";
import { ProjectData } from "store/project/actions";
import PencilUnderlineIcon from "icons/PencilUnderlineIcon";
import useTheme from "hooks/useTheme";

const EditProject = () => {
  const { item } = useProject();
  const { onUpdateProject: onUpdateProjectAction } = useProjects();
  const { isDarkMode } = useTheme();

  const [isShow, onShow, onHide] = useToggle();

  const initValues = useMemo(
    () =>
      item
        ? {
            name: item.name,
            description: item?.description,
            owner: item?.owner?.id,
            type_project: item?.type_project?.id,
            start_date: item?.start_date
              ? new Date(item.start_date).getTime()
              : undefined,
            end_date: item?.end_date
              ? new Date(item.end_date).getTime()
              : undefined,
            expected_cost: item?.expected_cost,
            working_hours: item?.working_hours,
            currency: item?.currency,
            members: item?.members.map(({ id, fullname, ...rest }) => ({
              id,
              fullname,
              position_project: rest?.position_project?.id,
            })),
            avatar: item?.avatar?.link,
          }
        : INITIAL_VALUES,
    [item],
  );

  const onUpdateProject = async (data: ProjectData) => {
    if (!item?.id) return;
    return await onUpdateProjectAction(item.id, data);
  };

  if (!item) return null;
  return (
    <>
      <IconButton
        onClick={onShow}
        sx={{
          backgroundColor: isDarkMode ? "grey.50" : "primary.light",
          color: "text.primary",
          borderRadius: 1,
          p: 0.5,
          "&:hover svg": {
            color: "common.white",
          },
        }}
      >
        <PencilUnderlineIcon sx={{ fontSize: 20 }} />
      </IconButton>

      {isShow && (
        <Form
          open
          onClose={onHide}
          type={DataAction.UPDATE}
          initialValues={initValues as unknown as ProjectDataForm}
          onSubmit={onUpdateProject}
        />
      )}
    </>
  );
};

export default memo(EditProject);
