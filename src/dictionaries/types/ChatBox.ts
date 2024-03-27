export type ChatBox = {
  chatBox: {
    chat: string;
    searchName: string;
    searchConversation: string;
    you: string;
    active: string;
    typeMessage: string;
    groupName: string;
    media: string;
    link: string;
    file: string;
    members: string;
    changeName: string;
    deleteGroup: string;
    leaveGroup: string;
    addAsAdmin: string;
    removeFromChat: string;
    sureAddAsAdmin: string;
    sureRemoveGroup: string;
    sureLeaveGroup: string;
    selectAdminNew: string;
    leaveGroupMsg: {
      text_1: string,
      text_2: string,
    },
    leaveGroupConfirm: {
      text_1: string;
      text_2: string;
      text_3: string;
    },
    accountInformation: string,
    added: string,
    removed: string,
    group: {
      add: string,
      remove: string,
      lead_trans: string,
      lead_remove,
      edit_avatar: string,
      rename: string,
      rename_alert: string,
      change_avatar_alert: string,
      adminChange: string,
      removeMember: string,
    }
  };
};
