import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "api/client";
import { Endpoint } from "api/endpoint";
import { HttpStatusCode, Status } from "constant/enums";
import {
  AI_CHAT_API_URL,
  AN_ERROR_TRY_AGAIN,
  AN_ERROR_TRY_RELOAD_PAGE,
  API_URL
} from "constant/index";
import { BaseQueries, Option } from "constant/types";
import StringFormat from "string-format";
import { refactorRawItemListResponse, serverQueries } from "utils/index";
import { Task } from "./reducer";

export enum ProjectStatus {
  ACTIVE = "ACTIVE",
  PAUSE = "PAUSE",
  CLOSE = "CLOSE",
}

export enum DependencyStatus {
  BLOCKING = "BLOCK",
  WAITING_ON = "WAIT",
  LINKED_TO = "LINK",
}

export type GetProjectListQueries = BaseQueries & {
  sort?: string;
};

export type GetMembersOfProjectQueries = BaseQueries & {
  ["members.email"]?: string;
  id?: string;
};

export type GetTasksOfProjectQueries = BaseQueries & {
  owner?: string;
  date?: string;
  status?: Status;
  project?: string;
  name?: string;
};

export type GetTaskLogQueries = {
  task_id: string;
  subtask_id?: string;
};

export type ProjectData = {
  name: string;
  owner: string;
  start_date: string;
  end_date: string;
  expected_cost?: number;
  working_hours?: number;
  description: string;
  members?: {
    id: string;
  }[];
  type_project: Option;
  status?: ProjectStatus;
  saved?: boolean;
  avatar?: string[];
  currency?: string;
};

export type CreateProjectPrompt = {
  tone: string;
  persona: string;
  prompt: string;
};

export type AiProjectData = {
  title: string;
  expectedCost: string;
  workingHours: string;
  description: string;
  taskList: {
    title: string;
    tasks: string[];
  }[];
};

export type TaskListData = {
  name: string;
  project: string;
};

export type TaskDataDependency = {
  task_current: string;
  task_list_current: string;
  task_list_update: string;
  task_update: string;

  sub_task_current?: string;
  sub_task_update?: string;
  sub_task?: string;
  status: DependencyStatus;
};

export type TaskData = {
  name: string;
  task_list: string;
  task?: string;
  sub_task?: string;
  start_date?: string | null;
  end_date?: string | null;
  estimated_hours?: number | null;
  description?: string;
  owner?: string | null;
  status?: Status;
  attachments?: string[];
  dependencies?: TaskDataDependency[];
  todo_list?: {
    name: string;
    owner?: string;
  }[];
};

export type CreateTaskPrompt = {
  tone: string;
  persona: string;
  method: string;
  content: string;
};

export type AiTaskData = {
  task: string;
  subtask: string[];
} & { content: string };

export type MoveTaskData = {
  task_list_current: string;
  task_current: string[];
  task_list_move: string;
  task_move?: string;
  tasks?: string[];
};

export type CommentTaskData = {
  task: string;
  task_list: string;
  sub_task: string;
  content: string;
  attachments?: string[];
};

export type DeleteTaskListsData = {
  project: string;
  tasks_list: string[];
};

export type DeleteTasksData = {
  task_list: string;
  tasks: string[];
};

export type DeleteSubTasksData = {
  task_list: string;
  task: string;
  sub_tasks: string[];
};

export type GetActivitiesQueries = {
  start_date: string;
  end_date: string;
};

export type ChangeParentTaskData = {
  task_list_current: string;
  task_current: string;
  sub_task: string;
  task_list_change: string;
  task_change: string;
};

export type TodoData = {
  task_list: string;
  task: string;
  id_todo_list: string;
  sub_task?: string;
};

export type DependencyData = {
  task_list: string;
  task: string;
  id_dependence: string;
  sub_task?: string;
};

export type UpdateTodoStatus = TodoData & {
  is_done: boolean;
};

export type ConvertSubTaskToTaskData = {
  task_list: string;
  task: string;
  sub_task: string;
};

export type OrderTodoData = {
  task_list: string;
  task: string;
  sub_task?: string;
  id_priorities: string[];
};

export const getProjectList = createAsyncThunk(
  "project/getProjectList",
  async (queries: GetProjectListQueries) => {
    let newQueries = { ...queries };

    if (newQueries?.sort !== "updated_time=-1") {
      newQueries.sort = "created_time=-1";
    }

    newQueries = serverQueries(
      newQueries,
      ["name"],
      ["saved"],
    ) as GetProjectListQueries;

    try {
      // console.log("newQueries khi gui--> ", newQueries);
      const response = await client.get(Endpoint.PROJECTS, newQueries);

      if (response?.status === HttpStatusCode.OK) {
        return refactorRawItemListResponse(response.data);
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getProject = createAsyncThunk(
  "project/getProject",
  async (id: string) => {
    try {
      const response = await client.get(
        StringFormat(Endpoint.PROJECT_ITEM, { id }),
      );

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getProjectAttachment = createAsyncThunk(
  "project/getProjectAttachment",
  async (id: string | string[]) => {
    try {
      const response = await client.get(
        StringFormat(Endpoint.PROJECT_FILE, { id }),
      );

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const createProject = createAsyncThunk(
  "project/createProject",
  async (data: ProjectData) => {
    try {
      const response = await client.post(Endpoint.PROJECTS, data);

      if (response?.status === HttpStatusCode.CREATED) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const createProjectWithAI = createAsyncThunk(
  "project/createProjectWithAI",
  async (data: CreateProjectPrompt) => {
    const response = await client.post(Endpoint.AI_PROJECT_GENERATE, data, {
      baseURL: AI_CHAT_API_URL,
    });
    if (response?.status === HttpStatusCode.CREATED) {
      return response.data as AiProjectData;
    }
    throw AN_ERROR_TRY_AGAIN;
  },
);

export const updateProject = createAsyncThunk(
  "project/updateProject",
  async ({ id, ...data }: Partial<ProjectData> & { id: string }) => {
    try {
      const response = await client.put(
        StringFormat(Endpoint.PROJECT_ITEM, { id }),
        data,
      );

      if (response?.status === HttpStatusCode.CREATED) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async (id: string) => {
    try {
      const response = await client.delete(
        StringFormat(Endpoint.PROJECT_ITEM, { id }),
      );

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getMembersOfProject = createAsyncThunk(
  "project/getMembersOfProject",
  async ({
    id,
    concat,
    ...queries
  }: GetMembersOfProjectQueries & { id: string; concat?: boolean }) => {
    queries = serverQueries(queries, ["members.email"]) as BaseQueries;

    try {
      const response = await client.get(
        StringFormat(Endpoint.PROJECT_MEMBERS, { id }),
        queries,
      );

      if (response?.status === HttpStatusCode.OK) {
        return { ...refactorRawItemListResponse(response.data), concat };
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getTasksOfProject = createAsyncThunk(
  "project/getTasksOfProject",
  async ({
    prefixKey,
    project,
    ...queries
  }: GetTasksOfProjectQueries & { prefixKey: "taskOptions" | "tasks" }) => {
    queries = serverQueries(queries, ["tasks.name"], undefined, undefined, {
      "tasks.start_date": "gte",
    }) as GetTasksOfProjectQueries;
    try {
      const response = await client.get(
        StringFormat(Endpoint.PROJECT_TASK_ITEM, { id: project }),
        queries,
      );

      if (response?.status === HttpStatusCode.OK) {
        return { ...refactorRawItemListResponse(response.data), prefixKey };
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const createTaskList = createAsyncThunk(
  "project/createTaskList",
  async (data: TaskListData) => {
    try {
      const response = await client.post(Endpoint.PROJECT_TASKS, data);

      if (response?.status === HttpStatusCode.CREATED) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateTaskList = createAsyncThunk(
  "project/updateTaskList",
  async ({ id, name }: { id: string; name: string }) => {
    try {
      const response = await client.put(
        StringFormat(Endpoint.PROJECT_TASK_ITEM, { id }),
        { name },
      );

      if (response?.status === HttpStatusCode.CREATED) {
        return response.data.task;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateTaskListOrder = createAsyncThunk(
  "project/updateTaskList",
  async ({ id, order }: { id: string; order: number }) => {
    try {
      const response = await client.put(
        StringFormat(Endpoint.PROJECT_TASK_ITEM, { id }),
        { order },
      );

      if (response?.status === HttpStatusCode.CREATED) {
        return response.data.task;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const createTask = createAsyncThunk(
  "project/createTask",
  async (data: TaskData) => {
    try {
      const url = data?.task ? Endpoint.SUB_TASKS : Endpoint.TASKS;
      const response = await client.post(url, data);

      if (response?.status === HttpStatusCode.CREATED) {
        return {
          task: response.data?.tasks as Task,
          subTask: response.data?.subtasks as Task,
          taskId: data?.task,
          taskListId: data.task_list,
        };
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const createTaskWithAI = createAsyncThunk(
  "project/createTaskWithAI",
  async (data: CreateTaskPrompt) => {
    const response = await client.post(Endpoint.AI_TASK_GENERATE, data, {
      baseURL: AI_CHAT_API_URL,
    });
    if (response.status === HttpStatusCode.CREATED) {
      return response.data as AiTaskData;
    }
    throw AN_ERROR_TRY_AGAIN;
  },
);

export const updateTask = createAsyncThunk(
  "project/updateTask",
  async (data: Partial<TaskData>) => {
    try {
      const url = data?.sub_task ? Endpoint.SUB_TASK : Endpoint.TASK_ITEM;

      const response = await client.put(url, data);

      if (response?.status === HttpStatusCode.CREATED) {
        const taskListUpdatedResponse = await client.get(
          StringFormat(Endpoint.TASK_LIST, { id: data.task_list }),
        );

        if (taskListUpdatedResponse.status === HttpStatusCode.OK) {
          return {
            taskList: taskListUpdatedResponse.data,
            task: {
              ...data,
              ...(response.data?.sub_task ?? response.data?.task),
              taskListId: data.task_list,
              taskId: data.task,
              subTaskId: data?.sub_task,
            },
          };
        }
        throw AN_ERROR_TRY_RELOAD_PAGE;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const moveTask = createAsyncThunk(
  "project/moveTask",
  async (data: MoveTaskData) => {
    try {
      const response = await client.post(Endpoint.TASK_MOVE, data);

      if (response?.status === HttpStatusCode.OK) {
        return true;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const commentTask = createAsyncThunk(
  "project/commentTask",
  async (data: CommentTaskData) => {
    try {
      const url = data?.sub_task
        ? Endpoint.SUB_TASK_COMMENT
        : Endpoint.TASK_COMMENT;

      const response = await client.post(url, data);

      if (response?.status === HttpStatusCode.CREATED) {
        return {
          comment: response.data.comment,
          taskId: data.task,
          taskListId: data.task_list,
          subTaskId: data.sub_task,
        };
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const deleteTaskLists = createAsyncThunk(
  "project/deleteTaskLists",
  async (data: DeleteTaskListsData) => {
    try {
      const response = await client.put(Endpoint.TASK_LIST_INACTIVE, data);

      if (response?.status === HttpStatusCode.OK) {
        return true;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const deleteTasks = createAsyncThunk(
  "project/deleteTasks",
  async (data: DeleteTasksData) => {
    try {
      const response = await client.put(Endpoint.TASKS_INACTIVE, data);

      if (response?.status === HttpStatusCode.OK) {
        return true;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const deleteSubTasks = createAsyncThunk(
  "project/deleteSubTasks",
  async (data: DeleteSubTasksData) => {
    try {
      const response = await client.put(Endpoint.SUB_TASKS_INACTIVE, data);

      if (response?.status === HttpStatusCode.OK) {
        return true;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const changeParentTask = createAsyncThunk(
  "project/changeParentTask",
  async (data: ChangeParentTaskData) => {
    try {
      const response = await client.post(Endpoint.CHANGE_PARENT_TASK, data);

      if (response?.status === HttpStatusCode.OK) {
        return true;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateTodoStatus = createAsyncThunk(
  "project/updateTodoStatus",
  async (data: UpdateTodoStatus) => {
    try {
      const response = await client.put(Endpoint.TODO_DONE, data);

      if (response?.status === HttpStatusCode.OK) {
        return true;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const convertToTask = createAsyncThunk(
  "project/convertToTask",
  async (data: TodoData) => {
    try {
      const response = await client.post(Endpoint.CONVERT_TASK, data);

      if (response?.status === HttpStatusCode.OK) {
        return true;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const convertToSubTask = createAsyncThunk(
  "project/convertToSubTask",
  async (data: TodoData) => {
    try {
      const response = await client.post(Endpoint.CONVERT_SUB_TASK, data);

      if (response?.status === HttpStatusCode.OK) {
        return true;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);
export const convertSubTaskToTask = createAsyncThunk(
  "project/convertSubTaskToTask",
  async (data: ConvertSubTaskToTaskData) => {
    try {
      const response = await client.post(
        Endpoint.CONVERT_SUB_TASK_TO_TASK,
        data,
      );

      if (response?.status === HttpStatusCode.OK) {
        return true;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const deleteTodo = createAsyncThunk(
  "project/deleteTodo",
  async (data: TodoData) => {
    try {
      const response = await client.put(Endpoint.DELETE_TO_DO, data);

      if (response?.status === HttpStatusCode.OK) {
        return true;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const deleteDependency = createAsyncThunk(
  "project/deleteDependency",
  async (data: DependencyData) => {
    try {
      const response = await client.put(Endpoint.DELETE_DEPENDENCY, data);

      if (response?.status === HttpStatusCode.OK) {
        return true;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const orderTodo = createAsyncThunk(
  "project/orderTodo",
  async (data: OrderTodoData) => {
    try {
      const url = data?.sub_task
        ? Endpoint.ORDER_SUB_TASK
        : Endpoint.ORDER_TASK;
      const response = await client.put(url, data);

      if (response?.status === HttpStatusCode.OK) {
        return true;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getTaskList = createAsyncThunk(
  "project/getTaskList",
  async (id: string) => {
    try {
      const response = await client.get(
        StringFormat(Endpoint.TASK_LIST, { id }),
      );

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getActivitiesOfProject = createAsyncThunk(
  "project/getActivitiesOfProject",
  async (queries: GetActivitiesQueries & { id: string }) => {
    queries = serverQueries(queries) as GetActivitiesQueries & { id: string };

    try {
      // const response = await client.get(Endpoint.PROJECT_ACTIVITIES, queries);

      // if (response?.status === HttpStatusCode.OK) {
      //   return response.data;
      // }

      // throw AN_ERROR_TRY_AGAIN;

      return [
        {
          id: "01",
          action: "Lập tài liệu design",
          note: "date-fns is the modular path to date/time manipulation. Where I work, it helped us get our bundle sizes down, especially because we are able to include only the functionality we need. date-fns is the modular path to date/time manipulation. Where I work, it helped us get our bundle sizes down, especially because we are able to include only the functionality we need.",
          created_time: "2023-06-29T02:37:49.149Z",
          user: {
            fullname: "Bùi Quang Huy",
            position: {
              id: "222",
              name: "UI/UX Designer",
            },
          },
        },
        {
          id: "02",
          action: "Lập tài liệu design",
          note: "Ghi chú: Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur ma",
          created_time: "2023-06-29T02:37:49.149Z",
          user: {
            fullname: "Bùi Quang Huy",
            position: {
              id: "222",
              name: "UI/UX Designer",
            },
          },
        },
        {
          id: "03",
          action: "Lập tài liệu design",
          note: "Ghi chú: Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur ma",
          created_time: "2023-06-29T02:37:49.149Z",
          user: {
            fullname: "Bùi Quang Huy",
            position: {
              id: "222",
              name: "UI/UX Designer",
            },
          },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any[];
    } catch (error) {
      throw error;
    }
  },
);

export const getTaskLog = createAsyncThunk(
  "project/getTaskLog",
  async (queries: GetTaskLogQueries) => {
    const newQueries = { ...queries };

    try {
      const response = await client.get(Endpoint.TASKS_LOG, newQueries, {
        baseURL: API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);