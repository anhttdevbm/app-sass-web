import { Stack } from "@mui/material";
import "@sweetalert2/theme-material-ui/material-ui.css";
import { Button, Editor } from "components/shared";
import { AN_ERROR_TRY_AGAIN, NS_COMMON, NS_PROJECT } from "constant/index";
import { useTranslations } from "next-intl";
import { memo, useEffect, useRef, useState } from "react";
import { useSnackbar } from "store/app/selectors";
import { useTaskDetail } from "store/project/selectors";
import Swal from "sweetalert2";
import { getMessageErrorByAPI } from "utils/index";
import { replaceDescriptionBr } from "../../helpers";

type DescriptionTaskProps = {
  onClose: () => void;
  open: boolean;
  textEdit?: string;
  title?: string;
  sx?: object;
  taskId?: string;
  taskListId?: string;
  subTaskId?: string;
};

const DescriptionTask = (props: DescriptionTaskProps) => {
  const { open, onClose: onCloseProps, textEdit, title, sx } = props;
  const [text, setText] = useState<string | undefined>(textEdit ?? "");
  const hasEdit = useRef("");
  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);
  const { onAddSnackbar } = useSnackbar();

  const { task, taskListId, taskId, subTaskId, onUpdateTask } = useTaskDetail();

  useEffect(() => {
    return () => {
      if (!!hasEdit.current) {
        // TODO: Update locale for this
        Swal.fire({
          icon: "warning",
          text: projectT("detailTasks.unsaveMessage"),
          showCancelButton: true,
          showConfirmButton: true,
        }).then((resullt) => {
          if (resullt.isConfirmed) {
            onSubmit();
          }
        });
      }
    };
  }, []);

  const onChangeText = (_, newValue?: string) => {
    setText(newValue);
    if (newValue) hasEdit.current = newValue;
  };

  const onClose = () => {
    onCloseProps();
  };

  const onSubmit = async () => {
    try {
      if ((!taskListId || !taskId) && (!props.taskId || !props.taskListId)) {
        throw AN_ERROR_TRY_AGAIN;
      }
      const data = { description: hasEdit.current };
      if (hasEdit.current) {
        data.description = replaceDescriptionBr(hasEdit.current);

        const newData = await onUpdateTask(
          data,
          taskListId || props.taskListId + "",
          taskId || props.taskId + "",
          subTaskId || props.subTaskId,
        );
        if (newData) {
          hasEdit.current = "";
          onAddSnackbar(
            commonT("notification.success", { label: commonT("form.save") }),
            "success",
          );
          onClose();
        }
      }
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    } finally {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <>
      <Stack spacing={2}>
        <Editor
          value={text ?? ""}
          onChange={onChangeText}
          title={title ?? ""}
          name="description"
          editorKey={DESCRIPTION_EDITOR}
        />
        <Stack direction="row" alignItems="center" spacing={3}>
          <Button
            sx={{ width: 100 }}
            onClick={onSubmit}
            type="button"
            variant="primary"
            size="small"
          >
            {commonT("form.save")}
          </Button>
          <Button
            sx={{ width: 100 }}
            onClick={onClose}
            type="button"
            variant="primaryOutlined"
            size="small"
          >
            {commonT("form.cancel")}
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default memo(DescriptionTask);

const DESCRIPTION_EDITOR = "descriptionEditor";
