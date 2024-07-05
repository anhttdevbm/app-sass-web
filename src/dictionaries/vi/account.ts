import { AccountDictionary } from "dictionaries/types/AccountDictionary";

export const AccountLang: AccountDictionary = {
  accountInformation: {
    head: {
      title: "Thông tin tài khoản",
    },
    title: "Thông tin tài khoản",
    updateAccount: "Cập nhật tài khoản",
    changeInformation: "Cập nhật tài khoản",
    notAllowUpdate: "{name} không được phép cập nhật.",
    notification: {
      updateSuccess: "Thông tin tài khoản được cập nhật thành công!",
    },
  },
  changePassword: {
    head: {
      title: "Đổi mật khẩu | Taskcover",
    },
    form: {
      title: {
        oldPassword: "Mật khẩu cũ",
        newPassword: "Mật khẩu mới",
        confirmNewPassword: "Xác nhận mật khẩu mới",
      },
    },
    title: "Thay đổi mật khẩu",
    notification: {
      changeSuccess: "Đổi mật khẩu thành công, vui lòng đăng nhập lại.",
    },
  },
};
