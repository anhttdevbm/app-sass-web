import { ChatBox } from "dictionaries/types/ChatBox";

export const ChatBoxLang: ChatBox = {
  chatBox: {
    chat: "Chat",
    searchName: "Search name",
    searchConversation: "Search in conversation",
    you: "You",
    active: "Active",
    typeMessage: "Type Message...",
    groupName: "Group name:",
    media: "Media file",
    link: "Link",
    file: "File",
    members: "Members",
    changeName: "Change name",
    deleteGroup: "Delete group",
    leaveGroup: "Leave group",
    addAsAdmin: "Add as admin",
    removeFromChat: "Remove from chat",
    sureAddAsAdmin: "Are you sure add as admin?",
    sureRemoveGroup: "Are you sure to delete group?",
    sureLeaveGroup: "Are you sure to leave group?",
    selectAdminNew: "Select a new admin",
    leaveGroupMsg: {
      text_1: "Leave group and select",
      text_2: "as new admin?",
    },
    leaveGroupConfirm: {
      text_1: "You won't be able to see the messages in this conversation",
      text_2: "again after you leave the group. Please",
      text_3: "or the system will choose automatically",
    },
    accountInformation: "Account information",
    added: "added",
    removed: "removed",
    group: {
      add: '{user1} added {user2} to the group at {time}.',
      remove: '{user1} removed {user2} from the group at {time}.',
      lead_trans: '{user1} transferred admin rights to {user2} at {time}.',
      lead_remove: '{user1} removed admin rights from {user2} at {time}.',
      rename: '{user1} renamed the group to {name} at {time}.',
      edit_avatar: '{user1} changed the group\'s avatar at {time}.',
      rename_alert: 'Group name changed successfully!',
      change_avatar_alert: 'Profile picture changed successfully!',
      adminChange: 'Successfully transferred administrative rights.',
      removeMember: 'Member has been removed from the group.'
    }
  },
};