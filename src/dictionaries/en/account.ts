import { AccountDictionary } from "dictionaries/types/AccountDictionary";

export const AccountLang: AccountDictionary = {
  accountInformation: {
    head: {
      title: "Account information | Taskcover",
    },
    title: "Account Information",
    updateAccount: "Update account",
    changeInformation: "Change information",
    notAllowUpdate: "{name} is not allowed to be updated.",
    notification: {
      updateSuccess: "Account information updated successfully!",
    },
  },
  changePassword: {
    head: {
      title: "Change password | Taskcover",
    },
    form: {
      title: {
        oldPassword: "Old password",
        newPassword: "New password",
        confirmNewPassword: "Confirm new password",
      },
    },
    title: "Change password",
    notification: {
      changeSuccess: "Change password successfully. Please sign in again.",
    },
  },
};
