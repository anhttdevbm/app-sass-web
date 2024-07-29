import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  CommentTaskData,
  DeleteTasksData,
  GetProjectListQueries,
  GetTasksOfProjectQueries,
  ProjectData,
  TaskData,
  TaskListData,
  commentTask,
  createProject,
  createTask,
  createTaskList,
  deleteTasks,
  deleteTaskLists,
  getMembersOfProject,
  getProject,
  getProjectList,
  getTasksOfProject,
  moveTask,
  updateProject,
  updateTask,
  updateTaskList,
  deleteProject,
  DeleteSubTasksData,
  DeleteTaskListsData,
  deleteSubTasks,
  getActivitiesOfProject,
  GetActivitiesQueries,
  GetMembersOfProjectQueries,
  ChangeParentTaskData,
  changeParentTask,
  getTaskList,
  TodoData,
  convertToTask,
  UpdateTodoStatus,
  updateTodoStatus,
  convertToSubTask,
  deleteTodo,
  convertSubTaskToTask,
  ConvertSubTaskToTaskData,
  DependencyData,
  deleteDependency,
  orderTodo,
  OrderTodoData,
  getProjectAttachment,
  createProjectWithAI,
  CreateProjectPrompt,
  createTaskWithAI,
  CreateTaskPrompt,
} from "./actions";
import { DataStatus } from "constant/enums";
import { useMemo, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { BaseQueries, Option } from "constant/types";
import { getFiltersIgnoreId } from "utils/index";
import {
  TaskDetail,
  TaskParent,
  removeMember,
  resetTasks,
  updateTaskDetail,
  updateTaskParent,
} from "./reducer";

export const useProjects = () => {
  const dispatch = useAppDispatch();
  const { items, status, error, filters } = useAppSelector(
    (state) => state.project,
    shallowEqual,
  );
  const { pageIndex, pageSize, totalItems, totalPages } = useAppSelector(
    (state) => state.project.paging,
    shallowEqual,
  );

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetProjects = useCallback(
    async (queries: GetProjectListQueries) => {
      await dispatch(getProjectList(queries));
    },
    [dispatch],
  );

  const onCreateProject = useCallback(
    async (data: ProjectData) => {
      return await dispatch(createProject(data)).unwrap();
    },
    [dispatch],
  );

  const onCreateProjectWithAI = useCallback(
    async (data: CreateProjectPrompt) => {
      return await dispatch(createProjectWithAI(data)).unwrap();
    },
    [dispatch],
  );

  const onUpdateProject = useCallback(
    async (id: string, data: Partial<ProjectData>) => {
      try {
        return await dispatch(updateProject({ id, ...data })).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const onDeleteProject = useCallback(
    async (id: string) => {
      try {
        return await dispatch(deleteProject(id)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  return {
    items,
    status,
    error,
    filters,
    isIdle,
    isFetching,
    pageIndex,
    pageSize,
    totalItems,
    totalPages,
    onGetProjects,
    onCreateProject,
    onCreateProjectWithAI,
    onUpdateProject,
    onDeleteProject,
  };
};

export const useProject = () => {
  const dispatch = useAppDispatch();
  const {
    item,
    itemStatus: status,
    itemError: error,
  } = useAppSelector((state) => state.project, shallowEqual);

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetProject = useCallback(
    async (id: string) => {
      await dispatch(getProject(id));
    },
    [dispatch],
  );

  return {
    item,
    status,
    error,
    isIdle,
    isFetching,
    onGetProject,
  };
};

export const useProjectAttachment = () => {
  const dispatch = useAppDispatch();
  const {
    attachments: items,
    itemStatus: status,
    itemError: error,
  } = useAppSelector((state) => state.project, shallowEqual);
  const onGetProjectAttachment = useCallback(
    async (id: string | string[]) => {
      await dispatch(getProjectAttachment(id));
    },
    [dispatch],
  );

  return {
    items,
    status,
    error,
    onGetProjectAttachment,
  };
};

export const useMembersOfProject = () => {
  const dispatch = useAppDispatch();
  const {
    members: items,
    membersStatus: status,
    membersError: error,
    membersFilters: storeFilters,
  } = useAppSelector((state) => state.project, shallowEqual);
  const { pageIndex, pageSize, totalItems, totalPages } = useAppSelector(
    (state) => state.project.membersPaging,
    shallowEqual,
  );

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);
  const filters = useMemo(
    () => getFiltersIgnoreId(storeFilters),
    [storeFilters],
  );

  const onGetMembersOfProject = useCallback(
    async (id: string, queries: BaseQueries) => {
      await dispatch(getMembersOfProject({ ...queries, id }));
    },
    [dispatch],
  );

  const onDeleteMember = (id: string) => {
    dispatch(removeMember(id));
  };

  return {
    items,
    status,
    error,
    filters,
    isIdle,
    isFetching,
    pageIndex,
    pageSize,
    totalItems,
    totalPages,
    id: storeFilters?.id,
    onGetMembersOfProject,
    onDeleteMember,
  };
};

export const useMemberOptions = () => {
  const dispatch = useAppDispatch();

  const {
    memberOptions: options,
    memberOptionsStatus: status,
    memberOptionsError: error,
    memberOptionsFilters: filters = {},
  } = useAppSelector((state) => state.project, shallowEqual);
  const { pageIndex, pageSize, totalItems, totalPages } = useAppSelector(
    (state) => state.project.memberOptionsPaging,
    shallowEqual,
  );

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetOptions = useCallback(
    async (id: string, queries: BaseQueries) => {
      await dispatch(getMembersOfProject({ ...queries, id, concat: true }));
    },
    [dispatch],
  );

  return {
    options,
    status,
    error,
    isIdle,
    isFetching,
    pageIndex,
    pageSize,
    totalItems,
    totalPages,
    filters,
    onGetOptions,
  };
};

export const useTasksOfProject = () => {
  const dispatch = useAppDispatch();
  const {
    tasks: items,
    tasksStatus: status,
    tasksError: error,
    tasksFilters: storeFilters,
  } = useAppSelector((state) => state.project, shallowEqual);
  const { pageIndex, pageSize, totalItems, totalPages } = useAppSelector(
    (state) => state.project.tasksPaging,
    shallowEqual,
  );

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);
  const filters = useMemo(
    () => getFiltersIgnoreId(storeFilters, "project"),
    [storeFilters],
  );

  const onGetTasksOfProject = useCallback(
    async (id: string, queries: GetTasksOfProjectQueries) => {
      await dispatch(
        getTasksOfProject({ ...queries, project: id, prefixKey: "tasks" }),
      );
    },
    [dispatch],
  );

  const onCreateTaskList = useCallback(
    async (data: TaskListData) => {
      try {
        return await dispatch(createTaskList(data)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const onCreateTaskListWithAi = useCallback(
    async (data: CreateProjectPrompt) => {
      return await dispatch(createProjectWithAI(data)).unwrap();
    },
    [dispatch],
  );

  const onCreateTask = useCallback(
    async (
      data: Omit<TaskData, "task_list" | "task">,
      taskList: string,
      taskId?: string,
    ) => {
      try {
        return await dispatch(
          createTask({ ...data, task_list: taskList, task: taskId }),
        ).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const onCreateTaskWithAi = useCallback(
    async (data: CreateTaskPrompt) => {
      return await dispatch(createTaskWithAI(data)).unwrap();
    },
    [dispatch],
  );

  const onUpdateTaskList = useCallback(
    async (id: string, name: string) => {
      try {
        return await dispatch(updateTaskList({ name, id })).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const onMoveTask = async (
    oldTaskListId: string,
    taskListId: string,
    taskIds: string[],
    newTaskId?: string,
    orderTasks?: string[],
  ) => {
    try {
      return await dispatch(
        moveTask({
          task_list_current: oldTaskListId,
          task_list_move: taskListId,
          task_current: taskIds,
          task_move: newTaskId,
          tasks: orderTasks,
        }),
      ).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const onDeleteTaskLists = async (data: DeleteTaskListsData) => {
    try {
      return await dispatch(deleteTaskLists(data)).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const onDeleteTasks = async (data: DeleteTasksData) => {
    try {
      return await dispatch(deleteTasks(data)).unwrap();
    } catch (error) {
      throw error;
    }
  };
  const onDeleteSubTasks = async (data: DeleteSubTasksData) => {
    try {
      return await dispatch(deleteSubTasks(data)).unwrap();
    } catch (error) {
      throw error;
    }
  };
  const onResetTasks = useCallback(() => {
    dispatch(resetTasks());
  }, [dispatch]);

  return {
    items,
    status,
    error,
    filters,
    isIdle,
    isFetching,
    pageIndex,
    pageSize,
    totalItems,
    totalPages,
    id: storeFilters?.project,
    onGetTasksOfProject,
    onCreateTaskList,
    onCreateTaskListWithAi,
    onUpdateTaskList,
    onCreateTask,
    onCreateTaskWithAi,
    onMoveTask,
    onDeleteTaskLists,
    onDeleteTasks,
    onDeleteSubTasks,
    onResetTasks,
  };
};

export const useTaskOptions = () => {
  const dispatch = useAppDispatch();

  const {
    taskOptions: items,
    taskOptionsStatus: status,
    taskOptionsError: error,
    taskOptionsFilters: filters = {},
  } = useAppSelector((state) => state.project, shallowEqual);
  const { pageIndex, pageSize, totalItems, totalPages } = useAppSelector(
    (state) => state.project.taskOptionsPaging,
    shallowEqual,
  );

  const [taskListOptions, taskOptions] = useMemo(() => {
    return items.reduce(
      (out: [Option[], Option[]], item) => {
        out[0].push({
          label: item.name,
          value: item.id,
          icon: "/images/ic-task-list.svg",
        });
        item.tasks.forEach((task) => {
          out[1].push({
            label: task.name,
            value: task.id,
            subText: item.id,

            icon: "/images/ic-task.svg",
          });
        });
        return out;
      },
      [[], []],
    );
  }, [items]);

  const options = useMemo(
    () => [...taskListOptions, ...taskOptions],
    [taskListOptions, taskOptions],
  );

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetOptions = useCallback(
    (queries: GetTasksOfProjectQueries) => {
      dispatch(getTasksOfProject({ ...queries, prefixKey: "taskOptions" }));
    },
    [dispatch],
  );

  return {
    items,
    options,
    taskListOptions,
    taskOptions,
    status,
    error,
    isIdle,
    isFetching,
    pageIndex,
    pageSize,
    totalItems,
    totalPages,
    filters,
    onGetOptions,
  };
};

export const useTaskDetail = () => {
  const dispatch = useAppDispatch();

  const task = useAppSelector((state) => state.project.task);
  const taskParent = useAppSelector((state) => state.project.taskParent);

  const onUpdateTaskDetail = (task?: TaskDetail) => {
    dispatch(updateTaskDetail(task));
  };

  const onUpdateTaskParent = (taskParent?: TaskParent) => {
    dispatch(updateTaskParent(taskParent));
  };

  const onCommentTask = async (data: CommentTaskData) => {
    try {
      return await dispatch(commentTask(data)).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const onUpdateTask = useCallback(
    async (
      data: Partial<Omit<TaskData, "task_list" | "task" | "sub_task">>,
      taskListId: string,
      taskId: string,
      subTaskId?: string,
    ) => {
      try {
        return await dispatch(
          updateTask({
            ...data,
            task_list: taskListId,
            task: taskId,
            sub_task: subTaskId,
          }),
        ).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const onChangeParentTask = async (data: ChangeParentTaskData) => {
    try {
      return await dispatch(changeParentTask(data)).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const onConvertToTask = async (data: TodoData) => {
    try {
      return await dispatch(convertToTask(data)).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const onConvertToSubTask = async (data: TodoData) => {
    try {
      return await dispatch(convertToSubTask(data)).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const onConvertSubTaskToTask = async (data: ConvertSubTaskToTaskData) => {
    try {
      return await dispatch(convertSubTaskToTask(data)).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const onUpdateTodoStatus = async (data: UpdateTodoStatus) => {
    try {
      return await dispatch(updateTodoStatus(data)).unwrap();
    } catch (error) {
      throw error;
    }
  };
  const onDeleteTodo = async (data: TodoData) => {
    try {
      return await dispatch(deleteTodo(data)).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const onDeleteDependency = async (data: DependencyData) => {
    try {
      return await dispatch(deleteDependency(data)).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const onGetTaskList = async (id: string) => {
    return await dispatch(getTaskList(id)).unwrap();
  };

  const onUpdateOrderTodo = async (data: OrderTodoData) => {
    try {
      return await dispatch(orderTodo(data)).unwrap();
    } catch (error) {
      throw error;
    }
  };
  return {
    task,
    taskParent,
    taskListId: task?.taskListId,
    taskId: task?.taskId,
    subTaskId: task?.subTaskId,
    onUpdateTaskDetail,
    onUpdateTaskParent,
    onCommentTask,
    onUpdateTask,
    onChangeParentTask,
    onGetTaskList,
    onConvertToTask,
    onConvertToSubTask,
    onUpdateTodoStatus,
    onDeleteTodo,
    onConvertSubTaskToTask,
    onDeleteDependency,
    onUpdateOrderTodo,
  };
};

export const useActivitiesOfProject = () => {
  const dispatch = useAppDispatch();
  const {
    activities: items,
    activitiesStatus: status,
    activitiesError: error,
    activitiesFilters: filters,
  } = useAppSelector((state) => state.project, shallowEqual);

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetActivitiesOfProject = useCallback(
    async (id: string, queries: GetActivitiesQueries) => {
      await dispatch(getActivitiesOfProject({ ...queries, id }));
    },
    [dispatch],
  );

  return {
    items,
    status,
    error,
    filters,
    isIdle,
    isFetching,
    onGetActivitiesOfProject,
  };
};
