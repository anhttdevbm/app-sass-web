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
    };
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createDoc: any;
  extendBtn: {
    rename: string;
    move: string;
    duplicate: string;
    delete: string;
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
  };
};
