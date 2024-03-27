import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "api/client";
import { HttpStatusCode } from "constant/enums";
import { AN_ERROR_TRY_AGAIN, AUTH_API_URL, CHAT_API_URL } from "constant/index";
import {
  AddMember2GroupRequest,
  ChatConventionItemRequest,
  CreateGroupRequest,
  LastMessagesRequest,
  LeftGroupRequest,
  RemoveGroupMemberRequest,
  ChangeRoleRequest,
  ChatAttachmentsRequest,
  FetchGroupMemberRequest,
  RemoveMemberRequest,
  DeleteConversationGroup,
  MessageBodyRequest,
  RenameGroupRequest,
  MessageSearchInfoRequest,
  UnReadMessageRequest,
  ReadMessageRequest,
  ForwardMessageGroup,
  ChangeGroupAvatar,
} from "./type";
import { AxiosError } from "axios";

export const getAllConvention = createAsyncThunk(
  "chat/getAllConvention",
  async (paramReq: ChatConventionItemRequest, { rejectWithValue }) => {
    try {
      const response = await client.post("getAllConversations", paramReq, {
        baseURL: CHAT_API_URL,
      });
      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data["error"];
        return rejectWithValue(message);
      } else {
        throw error;
      }
    }
  },
);

export const getConventionById = createAsyncThunk(
  "chat/getConventionById",
  async (paramReq: ChatConventionItemRequest, { rejectWithValue }) => {
    try {
      const response = await client.post("getAllConversations", paramReq, {
        baseURL: CHAT_API_URL,
      });
      if (response?.status === HttpStatusCode.OK) {
        return response.data.length > 0 ? response.data[0] : null;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data["error"];
        return rejectWithValue(message);
      } else {
        throw error;
      }
    }
  },
);

export const getLatestMessages = createAsyncThunk(
  "chat/getLatestMessages",
  async (paramReq: LastMessagesRequest, { rejectWithValue }) => {
    try {
      const response = await client.post("getLatestMessages", paramReq, {
        baseURL: CHAT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data["error"];
        return rejectWithValue(message);
      } else {
        throw error;
      }
    }
  },
);

export const getUserInfoById = createAsyncThunk(
  "chat/getUserInfoById",
  async (username: string, { rejectWithValue }) => {
    try {
      const response = await client.get(
        `in/users/${username}`,
        {},
        {
          baseURL: AUTH_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data["error"];
        return rejectWithValue(message);
      } else {
        throw error;
      }
    }
  },
);

export const sendMessages = createAsyncThunk(
  "chat/sendMessages",
  async (paramReq: MessageBodyRequest) => {
    const { t, ...param } = paramReq;
    const objUrl = {
      d: "sendDirectMessage",
      p: "sendMessageToGroup",
      c: "sendMessageToChannel",
    };
    // p for group sendMessageToGroup
    // c for channel sendMessageToChannel
    const paramsByType = {
      d: {
        sender_authToken: param.sender_authToken,
        sender_userId: param.sender_userId,
        receiverUsername: param.receiverUsername,
        attachments: param.attachments,
      },
      p: {
        authToken: param.authToken,
        userId: param.userId,
        roomId: param.roomId,
        attachments: param.attachments,
      },
      c: {
        authToken: param.authToken,
        userId: param.userId,
        channel: param.channel,
        attachments: param.attachments,
      },
    };
    if (!t) return;
    try {
      const response = await client.post(objUrl[t], paramsByType[t], {
        baseURL: CHAT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const searchChatText = createAsyncThunk(
  "chat/searchChatText",
  async (paramReq: MessageSearchInfoRequest, { rejectWithValue }) => {
    try {
      const response = await client.post("searchChatText", paramReq, {
        baseURL: CHAT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data["error"];
        return rejectWithValue(message);
      } else {
        throw error;
      }
    }
  },
);

export const getUnreadMessages = createAsyncThunk(
  "chat/getUnreadMessages",
  async (paramReq: UnReadMessageRequest) => {
    try {
      const response = await client.post("getUnreadMessages", paramReq, {
        baseURL: CHAT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const readMessages = async (paramReq: ReadMessageRequest) => {
  try {
    const response = await client.post("readMessages", paramReq, {
      baseURL: CHAT_API_URL,
    });

    if (response?.status === HttpStatusCode.OK) {
      return response.data;
    }
    throw AN_ERROR_TRY_AGAIN;
  } catch (error) {
    console.log(error);
    // throw error;
  }
};

export const createDirectMessageGroup = createAsyncThunk(
  "chat/createDirectMessageGroup",
  async (paramReq: CreateGroupRequest) => {
    try {
      const response = await client.post("createDirectMessageGroup", paramReq, {
        baseURL: CHAT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const addMembersToDirectMessageGroup = createAsyncThunk(
  "chat/addMembersToDirectMessageGroup",
  async (paramReq: AddMember2GroupRequest) => {
    try {
      const response = await client.post("addGroupMember", paramReq, {
        baseURL: CHAT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const leftDirectMessageGroup = createAsyncThunk(
  "chat/leftDirectMessageGroup",
  async (paramReq: LeftGroupRequest) => {
    try {
      const response = await client.post("leaveGroup", paramReq, {
        baseURL: CHAT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const renameGroup = createAsyncThunk(
  "chat/renameGroup",
  async (paramReq: RenameGroupRequest) => {
    try {
      const response = await client.post("renameGroup", paramReq, {
        baseURL: CHAT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const removeUserFromGroup = createAsyncThunk(
  "chat/removeUserFromGroup",
  async (paramReq: RemoveMemberRequest) => {
    try {
      const response = await client.post("removeUserFromGroup", paramReq, {
        baseURL: CHAT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const fetchGroupMembers = createAsyncThunk(
  "chat/groupMembers",
  async (paramReq: FetchGroupMemberRequest) => {
    try {
      const response = await client.post("groupMembers", paramReq, {
        baseURL: CHAT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const changeGroupRole = createAsyncThunk(
  "chat/changeUserGroupRole",
  async (paramReq: ChangeRoleRequest) => {
    try {
      const response = await client.post("changeUserGroupRole", paramReq, {
        baseURL: CHAT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getChatAttachments = createAsyncThunk(
  "chat/roomFiles",
  async (paramReq: ChatAttachmentsRequest, { rejectWithValue }) => {
    try {
      const response = await client.post("roomFiles", paramReq, {
        baseURL: CHAT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data["error"];
        return rejectWithValue(message);
      } else {
        throw error;
      }
    }
  },
);

export const deleteConversation = createAsyncThunk(
  "chat/deleteConversation",
  async (paramReq: DeleteConversationGroup) => {
    try {
      const response = await client.post("deleteConversation", paramReq, {
        baseURL: CHAT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const forwardMessage = createAsyncThunk(
  "chat/forwardMessage",
  async (paramReq: ForwardMessageGroup) => {
    try {
      const response = await client.post("forwardMessage", paramReq, {
        baseURL: CHAT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const changeGroupAvatar = createAsyncThunk(
  "chat/changeRoomAvatar",
  async (paramReq: ChangeGroupAvatar) => {
    try {
      const response = await client.post("changeRoomAvatar", paramReq, {
        baseURL: CHAT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);
