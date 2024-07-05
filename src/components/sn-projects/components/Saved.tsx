import { memo } from "react";
import BookmarkIcon from "icons/BookmarkIcon";
import { IconButton } from "components/shared";
import { useProjects } from "store/project/selectors";
import { getMessageErrorByAPI } from "utils/index";
import { useSnackbar } from "store/app/selectors";
import { useTranslations } from "next-intl";
import { NS_COMMON, NS_PROJECT } from "constant/index";

type SavedProps = {
  value?: boolean;
  id: string;
};

const Saved = (props: SavedProps) => {
  const { value, id } = props;
  const { onUpdateProject } = useProjects();
  const { onAddSnackbar } = useSnackbar();
  const projectT = useTranslations(NS_PROJECT);
  const commonT = useTranslations(NS_COMMON);

  const onToggleSaved = async () => {
    try {
      await onUpdateProject(id, { saved: !value });
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  return (
    <IconButton onClick={onToggleSaved} noPadding>
      <BookmarkIcon color="primary" fontSize="medium" active={value} />
    </IconButton>
  );
};

export default memo(Saved);
