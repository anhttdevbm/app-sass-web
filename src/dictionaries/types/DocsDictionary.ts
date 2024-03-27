export type DocsDictionary = {
  none: string;
  title: string;
  button: {
    add: string;
    comment: string;
    cancel: string;
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
};
