import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  SxProps,
} from "@mui/material";
import ButtonWithDropdown from "components/sn-projects/components/ButtonWithDropdown";
import { DataAction } from "constant/enums";
import { NS_PROJECT } from "constant/index";
import useToggle from "hooks/useToggle";
import AIGradientIcon from "icons/AIGradientIcon";
import DocumentTextIcon from "icons/DocumentTextIcon";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { title } from "process";
import { useMemo } from "react";
import { TaskListData } from "store/project/actions";
import { useTasksOfProject } from "store/project/selectors";
import TaskListAiForm from "../TaskListAiForm";
import TaskListForm from "../TaskListForm";

const INITIAL_VALUES = {
  name: "",
} as TaskListData;

const CreateNewTaskListButton = (props: { sx?: SxProps }) => {
  const projectT = useTranslations(NS_PROJECT);
  const { onCreateTaskList: onCreateTaskListAction } = useTasksOfProject();

  const [isShow, onShow, onHide] = useToggle();
  const [isShowAiForm, onShowAiForm, onHideAiForm] = useToggle();
  const params = useParams();
  const projectId = useMemo(() => params.id, [params.id]) as string;

  const onCreateTaskList = async (values: Omit<TaskListData, "project">) => {
    return await onCreateTaskListAction({
      project: projectId,
      name: values.name,
    });
  };

  return (
    <>
      <ButtonWithDropdown
        text={projectT("detailTasks.createNewTaskList")}
        onClick={onShow}
        sx={props.sx}
      >
        {(handleClose) => (
          <Paper>
            <MenuList>
              <MenuItem
                onClick={() => {
                  handleClose();
                  onShowAiForm();
                }}
              >
                <ListItemIcon>
                  <AIGradientIcon />
                </ListItemIcon>
                <ListItemText>AI Assistant</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  onShow();
                }}
              >
                <ListItemIcon>
                  <DocumentTextIcon sx={{ color: "transparent" }} />
                </ListItemIcon>
                <ListItemText>New list</ListItemText>
              </MenuItem>
            </MenuList>
          </Paper>
        )}
      </ButtonWithDropdown>

      {isShow && (
        <TaskListForm
          open={isShow}
          onClose={onHide}
          type={DataAction.CREATE}
          initialValues={INITIAL_VALUES}
          onSubmit={onCreateTaskList}
        />
      )}
      {isShowAiForm && (
        <TaskListAiForm
          open={isShowAiForm}
          onClose={onHideAiForm}
          content={title || ""}
        />
      )}
    </>
  );
};

export default CreateNewTaskListButton;

