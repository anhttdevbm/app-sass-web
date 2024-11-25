export type CompanyDictionary = {
  employees: {
    head: {
      title: string;
    };
    title: string;
    expirationDate: string;
    paid: string;
    pay: string;
    unPaid: string;
    waiting: string;
    expiration: string;
    key: string;
    isNeedSelect: string;
    employee: string;
    client: string;
    contractor: string;
    joinRequest: string;
    form: {
      addNewEmployee: string;
      chooseCompanyType: string;
      isInvite: string;
    };
    confirmPayment: {
      title: string;
      content: string;
    };
    confirmRemove: {
      title: string;
      content: string;
    };
    notification: {
      success: string;
    };
  };
  costHistory: {
    head: {
      title: string;
    };
    title: string;
  };
  positions: {
    head: {
      title: string;
    };
    form: {
      title: {
        name: string;
      };
    };
    title: string;
    numberOfEmployees: string;
    key: string;
    confirmDelete: {
      title: string;
      content: string;
    };
    notification: {
      success: string;
    };
  };
  projectTypes: {
    head: {
      title: string;
    };
    form: {
      title: {
        name: string;
      };
    };
    title: string;
    key: string;
    confirmDelete: {
      title: string;
      content: string;
    };
    notification: {
      success: string;
    };
  };
  clientCompany: {
    head: {
      title: string;
    };
    title: string;
    create: string;
    createBy: string;
    createDate: string;
    duplicate: string;
    form: {
      title: {
        name: string;
      };
      addContact: string;
      closedContact: string;
    };
    companyName: string;
    taxCode: string;
    address: string;
    zipCode: string;
    duplicateForm: {
      title: string;
      newName: string;
    };
    confirmRemove: {
      title: string;
      content: string;
    };
    notification: {
      success: string;
    };
    generalInformation: string;
    contact: string;
    formUpdate: {
      title: string;
      submit: string;
    };
  };
  information: {
    head: {
      title: string;
    };
    form: {
      title: {
        name: string;
        address: string;
        taxCode: string;
      };
    };
    title: string;
    generalInformation: string;
    detailInformation: string;
    ownerOfCompany: string;
    ownerEmail: string;
    numberOfEmployees: string;
    numberOfPositions: string;
    numberOfProjects: string;
    key: string;
    notification: {
      success: string;
    };
  };
};
