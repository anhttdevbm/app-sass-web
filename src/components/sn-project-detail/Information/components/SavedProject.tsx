import { memo } from "react";
import { IconButton } from "components/shared";
import BookmarkIcon from "icons/BookmarkIcon";
import { useProject, useProjects } from "store/project/selectors";
import ConfirmDialog from "components/ConfirmDialog";
import useToggle from "hooks/useToggle";
import { useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import { NS_COMMON, NS_PROJECT } from "constant/index";
import { useTranslations } from "next-intl";

const SavedProject = () => {
  const { item } = useProject();
  const { onUpdateProject } = useProjects();
  const { onAddSnackbar } = useSnackbar();
  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);

  const [isShow, onShow, onHide] = useToggle();

  const onSubmit = async () => {
    if (!item?.id) return;
    try {
      const newData = await onUpdateProject(item.id, { saved: !item.saved });
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

  if (!item) return null;
  return (
    <>
      <IconButton
        onClick={onShow}
        sx={{ bgcolor: "grey.50", p: 0.5, borderRadius: 1 }}
      >
        <BookmarkIcon
          sx={{ fontSize: 20 }}
          color="primary"
          active={item.saved}
        />
      </IconButton>

      <ConfirmDialog
        open={isShow}
        onClose={onHide}
        title={projectT("detail.confirmChangeSaveStatus.title")}
        content={projectT("detail.confirmChangeSaveStatus.content", {
          value: projectT(item.saved ? "detail.unSave" : "detail.save"),
        })}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default memo(SavedProject);
