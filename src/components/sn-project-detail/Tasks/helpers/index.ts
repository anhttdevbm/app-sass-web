import { Selected } from "components/sn-project-detail/Tasks/components";

export const isTaskListChecked = (selected: Selected[], id: string) => {
  return selected.some(
    (item) => item?.taskListId === id && !item?.taskId && !item?.subTaskId,
  );
};

export const isTaskChecked = (selected: Selected[], id: string) => {
  return selected.some((item) => item?.taskId === id && !item?.subTaskId);
};

export const isSubTaskChecked = (selected: Selected[], id: string) => {
  return selected.some((item) => item?.subTaskId === id);
};

export const replaceDescriptionBr = (text: string, replaceString?: string) => {
  let htmlString = text;

  const arr = htmlString.match(new RegExp("<p><br></p>", "g")) ?? [];

  for (let i = 0; i < arr.length; i++) {
    htmlString = htmlString.replace("<p><br></p>", replaceString ?? "<br>");
  }

  return htmlString;
};
