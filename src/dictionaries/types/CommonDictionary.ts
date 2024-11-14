export type CommonDictionary = {
  app: {
    title: string;
    description: string;
  };
  i18n: {
    vn: string;
    en: string;
  };
  form: {
    error: {
      required: string;
      invalid: string;
      min: string;
      minAndMax: string;
      confirmNotMatch: string;
      notSame: string;
      existed: string;
      notExist: string;
      incorrect: string;
      overMax: string;
      datePast: string;
      gte: string;
      renameGroup: string;
      typeError: string;
      positiveNumber: string;
    };
    title: {
      upload: string;
      uploadImage: string;
      assigner: string;
      noAssigner: string;
      startDate: string;
      endDate: string;
      dueDate: string;
      description: string;
      note: string;
      title: string;
      selectTime: string;
    };
    confirm: string;
    save: string;
    cancel: string;
    add: string;
    forward: string;
    admin: string;
    type: {
      number: string;
    };
  };
  notification: {
    imageTypeInvalid: string;
    success: string;
  };
  error: {
    anErrorTryAgain: string;
    anErrorTryReload: string;
  };
  position: string;
  permissionV: string;
  permissionN: string;
  company: string;
  fullName: string;
  phone: string;
  address: string;
  roles: string;
  status: string;
  filter: {
    refresh: string;
    clear: string;
    status: {
      active: string;
      close: string;
      pause: string;
    };
  };
  createNew: string;
  update: string;
  edit: string;
  delete: string;
  chat: string;
  close: string;
  search: string;
  assigner: string;
  name: string;
  paging: {
    show: string;
    outOf: string;
  };
  statusEnum: {
    inprogress: string;
    active: string;
    close: string;
    pause: string;
    unpaid: string;
    pending: string;
  };
  show: string;
  hide: string;
  searchBy: string;
  searchByLabel: string;
  creationDate: string;
  requestJoinTime: string;
  creator: string;
  confirmDelete: {
    title: string;
    content: string;
  };
  yes: string;
  no: string;
  upgradeAccount: string;
  createWorkspace: string;
  clickGoDetail: string;
  waiting: string;
  approved: string;
  rejected: string;
  paid: string;
  unpaid: string;
  noData: string;
  unauthorized: string;
  duplicate: string;
  move: string;
  rename: string;
  all: string;
  clickToViewLarge: string;
  processing: string;
  aFewFilesInvalid: string;
  processingUpload: string;
  day: string;
  hour: string;
  cancel: string;
  success: string;
  crop: string;
  landingPage: {
    homePage: string;
    aboutUs: string;
    helpCenter: string;
  };
  actions: string;
  learnMore: string;
  employees: {
    paid: string;
    unPaid: string;
    waiting: string;
    expirationDate: string;
  }
};
