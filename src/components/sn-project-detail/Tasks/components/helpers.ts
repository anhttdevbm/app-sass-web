import { Status } from "constant/enums";
import { TaskData } from "store/project/actions";
import { formatDate } from "utils/index";

export const reorder = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: any[],
  startIndex: number,
  endIndex: number,
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export type TaskFormData = Omit<TaskData, "taskListId" | "task">;

export type Selected = {
  taskListId?: string;
  taskListName?: string;

  taskId?: string;
  taskName?: string;

  subTaskId?: string;
  subTaskName?: string;
  checked?:boolean;
};

export const genName = (
  nameList: string[],
  name: string,
  count = 0,
  continueName?: string,
) => {
  const compareName = continueName ?? name;
  const nameExisted = nameList.find((nameValue) => nameValue === compareName);

  if (nameExisted) {
    return genName(nameList, name, count + 1, name + `(${count + 1})`);
  }

  return name + `(${count})`;
};

export const TASK_TEXT_STATUS: { [key in Status]: string } = {
  [Status.ACTIVE]: "statusEnum.inprogress",
  [Status.PAUSE]: "statusEnum.pause",
  [Status.CLOSE]: "statusEnum.close",
};

export const TASK_STATUS_OPTIONS = [
  { label: TASK_TEXT_STATUS.ACTIVE, value: Status.ACTIVE },
  { label: TASK_TEXT_STATUS.PAUSE, value: Status.PAUSE },
  { label: TASK_TEXT_STATUS.CLOSE, value: Status.CLOSE },
];
