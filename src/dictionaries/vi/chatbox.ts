import { ChatBox } from "dictionaries/types/ChatBox";

export const ChatBoxLang: ChatBox = {
  chatBox: {
    chat: "Trò chuyện",
    searchName: "Tìm kiếm tên",
    searchConversation: "Tìm kiếm hội thoại",
    you: "Bạn:",
    active: "Đang hoạt động",
    typeMessage: "Nhập tin nhắn...",
    groupName: "Tên nhóm:",
    media: "Truyền thông",
    link: "Liên kết",
    file: "Tài liệu",
    members: "Danh sách thành viên",
    changeName: "Thay đổi tên nhóm",
    deleteGroup: "Xoá nhóm",
    leaveGroup: "Rời khỏi nhóm",
    addAsAdmin: "Thêm quản trị viên",
    removeFromChat: "Xoá khỏi nhóm",
    sureAddAsAdmin: "Bạn có chắc chắn muốn thêm làm quản trị viên không?",
    sureRemoveGroup: "Bạn chắc chắn muốn xóa nhóm?",
    sureLeaveGroup: "Bạn chắc chắn muốn rời khỏi nhóm?",
    selectAdminNew: "Chọn quản trị viên mới",
    leaveGroupMsg: {
      text_1: "Rời nhóm và chọn",
      text_2: "làm quản trị viên?",
    },
    leaveGroupConfirm: {
      text_1: "Sau khi rời khỏi nhóm, bạn sẽ không thể xem lại các tin nhắn",
      text_2: "trong cuộc trò chuyện này. Vui lòng",
      text_3: "hoặc hệ thống sẽ tự động chọn",
    },
    accountInformation: "Thông tin tài khoản",
    added: "đã thêm",
    removed: "đã xoá",
    group: {
      add: '{user1} đã thêm {user2} vào nhóm vào lúc {time}.',
      remove: '{user1} đã xoá {user2} ra khỏi nhóm vào lúc {time}.',
      lead_trans: '{user1} đã chuyển quyền quản trị viên cho {user2} vào lúc {time}.',
      lead_remove: '{user1} đã xoá quyền quản trị viên của {user2} vào lúc {time}.',
      rename: '{user1} đã đổi tên nhóm thành {name} vào lúc {time}.',
      edit_avatar: '{user1} đã thay đổi ảnh đại diện nhóm vào lúc {time}.',
      rename_alert: 'Thay đổi tên nhóm thành công!',
      change_avatar_alert: 'Thay đổi ảnh đại diện thành công',
      adminChange: 'Chuyển quyền quản lý thành công.',
      removeMember: 'Đã xóa thành viên khỏi group.',
    }
  }
};