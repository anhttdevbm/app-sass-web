import {
  Paper,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  SvgIconProps,
  SvgIcon,
  SxProps,
} from "@mui/material";
import ButtonWithDropdown from "components/sn-projects/components/ButtonWithDropdown";
import { DataAction } from "constant/enums";
import { NS_PROJECT } from "constant/index";
import AIGradientIcon from "icons/AIGradientIcon";
import { useTranslations } from "next-intl";
import { title } from "process";
import TaskListAiForm from "../TaskListAiForm";
import TaskListForm from "../TaskListForm";
import { TaskListData } from "store/project/actions";
import useToggle from "hooks/useToggle";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useTasksOfProject } from "store/project/selectors";

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
        containerSx={props.sx}
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

const DocumentTextIcon = (props: SvgIconProps) => (
  <SvgIcon
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M17.5 5.83464V14.168C17.5 16.668 16.25 18.3346 13.3333 18.3346H6.66667C3.75 18.3346 2.5 16.668 2.5 14.168V5.83464C2.5 3.33464 3.75 1.66797 6.66667 1.66797H13.3333C16.25 1.66797 17.5 3.33464 17.5 5.83464Z"
      stroke="#212121"
      stroke-width="1.5"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12.0835 3.75V5.41667C12.0835 6.33333 12.8335 7.08333 13.7502 7.08333H15.4168"
      stroke="#212121"
      stroke-width="1.5"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M6.6665 10.832H9.99984"
      stroke="#212121"
      stroke-width="1.5"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M6.6665 14.168H13.3332"
      stroke="#212121"
      stroke-width="1.5"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </SvgIcon>
);
