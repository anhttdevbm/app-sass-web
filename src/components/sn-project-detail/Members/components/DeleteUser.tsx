import { memo } from "react";
import { IconButton } from "components/shared";
import DeleteUserIcon from "icons/DeleteUserIcon";
import ConfirmDialog from "components/ConfirmDialog";
import useToggle from "hooks/useToggle";
import {
  useMembersOfProject,
  useProject,
  useProjects,
} from "store/project/selectors";
import { useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import { AN_ERROR_TRY_AGAIN, NS_COMMON, NS_PROJECT } from "constant/index";
import { useTranslations } from "next-intl";
import useTheme from "hooks/useTheme";

type DeleteUserProps = {
  id: string;
};

const DeleteUser = ({ id }: DeleteUserProps) => {
  const [isShow, onShow, onHide] = useToggle();

  const { onUpdateProject } = useProjects();
  const { item } = useProject();
  const { onAddSnackbar } = useSnackbar();
  const { onDeleteMember } = useMembersOfProject();
  const { isDarkMode } = useTheme();
  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);

  const onClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    onShow();
  };
  const onSubmit = async () => {
    if (!item?.id) return;
    const newMembers = [...(item?.members ?? [])];

    const indexSelected = newMembers.findIndex((member) => member.id === id);

    try {
      if (indexSelected === -1) {
        throw AN_ERROR_TRY_AGAIN;
      }
      newMembers.splice(indexSelected, 1);
      const members = newMembers.map((member) => ({
        id: member.id,
      }));
      const newData = await onUpdateProject(item.id, { members });
      if (newData) {
        onAddSnackbar(
          projectT("detailMembers.notification.removeSuccess"),
          "success",
        );
        onDeleteMember(id);
        onHide();
      }
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  return (
    <>
      <IconButton
        onClick={onClick}
        tooltip={projectT("detailMembers.removeFromProject")}
        variant="contained"
        size="small"
        sx={{
          backgroundColor: 'inherit',
          color: "text.primary",
          p: 1,
          "&:hover": {
            color: "common.white",
            backgroundColor: 'common.white'
          },
        }}
      >
        <DeleteUserIcon />
      </IconButton>

      <ConfirmDialog
        sx={{
          maxWidth: { xs: "calc(100vw - 24px)", sm: 420 },
          minWidth: { xs: "calc(100vw - 24px)", sm: 420 },
        }}
        open={isShow}
        onClose={onHide}
        title={projectT("detailMembers.confirmRemove.title")}
        content={projectT("detailMembers.confirmRemove.content")}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default memo(DeleteUser);
