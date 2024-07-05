export type ManagerDictionary = {
  approve: string;
  reject: string;
  companyList: {
    head: {
      title: string;
    };
    title: string;
    accountList: string;
    staffPaid: string;
    totalStaff: string;
    approved: string;
    rejected: string;
    company: string;
    confirm: {
      title: string;
      content: string;
    };
  };
  employeeList: {
    head: {
      title: string;
    };
    title: string;
    staffPaid: string;
    staffUnpaid: string;
    company: string;
    confirm: {
      title: string;
      content: string;
    };
  };
};
