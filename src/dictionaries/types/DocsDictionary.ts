export type DocsDictionary = {
  none: string;
  title: string;
  button: {
    add: string;
    comment: string;
    cancel: string;
    search: string;
    confirm: string;
  };
  filter: {
    all: string;
    fields: string;
    search: string;
    group: {
      group: string;
      none: string;
      creator: string;
      project: string;
    };
    filter: {
      filter: string;
      creator: string;
      lastEdited: string;
      name: string;
      project: string;
      projectStatus: string;
      lastHour: string;
      today: string;
      oneDayAgo: string;
      thisWeek: string;
      lastWeek: string;
      oneWeekAgo: string;
      thisMonth: string;
      lastMonth: string;
      oneMonthAgo: string;
      thisQuarter: string;
      lastQuarter: string;
      threeMonthAgo: string;
      thisYear: string;
      lastYear: string;
      oneYearAgo: string;
    };
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createDoc: any;
  extendBtn: {
    rename: string;
    moveProject: string;
    duplicate: string;
    delete: string;
    convertToDoc: string;
  };
  ownedBy: string;
  createdBy: string;
  changeDocAccess: string;
  errorInputRename: string;
  deleteConfirmDoc: string;
  treeItemDialogEditTitle: string;
  newTreeItemDialogLabel: string;
  treeName: string;
  addNewTreeItemChildTitle: string;
  addDropdown: {
    aiGenerator: string;
    newDocument: string;
    import: string;
  };
  import: {
    formTitle: string;
    formSubTitle: string;
    formDivider: string;
    summarizeDoc: string;
    convertSheet: string;
    createDoc: string;
    dialog: {
      subtitle: string;
      dragdrop: {
        caption: string;
      };
    };
    thirdparty: {
      captionStart: string;
      captionEnd: string;
      optionBtn: string;
      done: string;
      errorNoti: string;
      authBtn: string;
      successMess: string;
      trello: {
        importFrom: string;
        caption: string;
        importSuccess: string;
        selectAll: string;
      };
    };
    invalidFileExt: string;
  };
};
