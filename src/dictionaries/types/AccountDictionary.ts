export type AccountDictionary = {
  accountInformation: {
    head: {
      title: string;
    };
    title: string;
    updateAccount: string;
    changeInformation: string;
    notAllowUpdate: string;
    notification: {
      updateSuccess: string;
    };
  };
  changePassword: {
    head: {
      title: string;
    };
    form: {
      title: {
        oldPassword: string;
        newPassword: string;
        confirmNewPassword: string;
      };
    };
    title: string;
    notification: {
      changeSuccess: string;
    };
  };
};
