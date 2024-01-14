export type ProjectDictionary = {
  list: {
    head: {
      title: string;
    };
    filter: {
      recent: string;
      saved: string;
    };
    form: {
      title: {
        estimatedCost: string;
        estimatedWorkingHours: string;
        logo: string;
        members: string;
        projectType: string;
        name: string;
      };
    };
    title: string;
    projectCode: string;
    key: string;
    notification: {
      success: string;
      invalidPositions: string;
      choosePositionFirst: string;
    };
  };
  tabList: {
    tasks: string;
    activities: string;
    budget: string;
    members: string;
    information: string;
  };
  detail: {
    head: {
      title: string;
    };
    changeStatus: string;
    changeStatusProject: string;
    save: string;
    unSave: string;
    confirmChangeSaveStatus: {
      title: string;
      content: string;
    };
    notification: {
      changeStatusSuccess: string;
      changeSaveStatusSuccess: string;
    };
    workingHoursActual: string;
    costSpent: string;
    listFile: {
      title: string;
      filter: {
        all: string;
        file: string;
        image: string;
      };
      noData: string;
    };
  };
  detailMembers: {
    head: {
      title: string;
    };
    member: string;
    hoursWorked: string;
    dateAddedProject: string;
    addMember: string;
    addMembersToProject: string;
    removeFromProject: string;
    confirmRemove: {
      title: string;
      content: string;
    };
    notification: {
      updateSuccess: string;
      removeSuccess: string;
    };
  };
  detailTasks: {
    head: {
      title: string;
    };
    form: {
      title: {
        expectCompletionTime: string;
        timeTaken: string;
        name: string;
        oldTaskList: string;
        newTaskList: string;
        newTaskPlace: string;
      };
    };
    addNewTask: string;
    addNewSubTask: string;
    addNewSubTaskPlaceholder: string;
    createNewTaskList: string;
    newMove: string;
    taskList: string;
    key: string;
    moveTaskList: string;
    duplicateName: string;
    selectedCount: string;
    assignee: string;
    processingDuplicate: string;
    nameWillBeExisted: string;
    unsaveMessage: string;
    keys: {
      owner: string;
      start_date: string;
      end_date: string;
      status: string;
    };
    confirmDeleteTaskList: {
      title: string;
      content: string;
    };
    confirmDeleteTasks: {
      title: string;
      content: string;
    };
    resetSelected: string;
    noTasksToMove: string;
    notification: {
      taskListSuccess: string;
      taskSuccess: string;
      moveSuccess: string;
      duplicateSuccess: string;
      deleteTaskListSuccess: string;
      deleteTasksSuccess: string;
      actionTaskSuccess: string;
      taskNameIsRequired: string;
    };
  };
  taskDetail: {
    title: string;
    tabList: {
      detail: string;
      history: string;
    };
    assignTask: string;
    changeStatusTask: string;
    writeComment: string;
    sendComment: string;
    addDescription: string;
    addAttachments: string;
    addDependencies: string;
    addSubTasks: string;
    addToDos: string;
    attachments: string;
    clickToUploadFile: string;
    subTasks: string;
    setDueDate: string;
    convertToTask: string;
    convertToSubTask: string;
    changeParentTask: string;
    duplicateSubTask: string;
    toDoList: string;
    dependencies: string;
    blocking: string;
    waitingOn: string;
    linkedTo: string;
    addDependencyTask: string;
    manual: string;
    commentList: string;
    showMore: string;
    showLess: string;
    form: {
      title: {
        newTask: string;
      };
    };
    notification: {
      assignSuccess: string;
      dateSuccess: string;
    };
  };
  detailActivities: {
    head: {
      title: string;
    };
  };
  budget: {
    head: {
      title: string;
    };
    action: {
      addBudget: string;
      addBudgetTitleModal: string;
    };
    form: {
      name: string;
      start_date: string;
      end_date: string;
      owner: string;
      project_id: string;
    };
    createBudgetSuccess: string;
    table: {
      budget: string;
      owner: string;
      cost: string;
      budgetTimeUsed: string;
      budgetedTimeUse: string;
      workTime: string;
      estimateTime: string;
      revenue: string;
      margin: string;
      budgetUsed: string;
      budgetTotal: string;
      workedTime: string;
      billableTime: string;
      invoiced: string;
      company: string;
      project: string;
    };
    groupBy: {
      dateCreated: string;
      dateUpdated: string;
      startDate: string;
      endDate: string;
      owner: string;
      status: string;
    };
    filter: {
      owner: string;
      time: string;
    };
    titleGroupBy: string;
    titleFilter: string;
  };
  errors: {
    form: {
      add_sub_task: {
        required: string;
      };
    };
  };
};
