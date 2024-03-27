import { useCallback, useEffect, useState } from "react";
import { useAuth } from "store/app/selectors";
import { useChat } from "./selectors";
import {
  ChatConventionItemRequest,
  DirectionChat,
  MessageBodyRequest,
  MessageInfo,
} from "./type";
import { readMessages } from "./actions";

export const useWSChat = () => {
  const { user } = useAuth();
  const {
    roomId: roomIdStore,
    dataTransfer,
    onSetMessage,
    onSetLastMessage,
    onGetConventionById,
  } = useChat();

  const [ws, setWs] = useState<WebSocket | null>(null);
  const token = user?.["authToken"];
  const userId = user?.["id_rocket"];
  const roomId = dataTransfer?._id ?? roomIdStore;

  const handleGetConventionById = useCallback(
    async (id: string, typeRoom: DirectionChat) => {
      const paramReq: Omit<ChatConventionItemRequest, "authToken" | "userId"> =
        {
          text: id,
          type: typeRoom,
          count: 1,
          offset: 0,
        };

      return await onGetConventionById(paramReq);
    },
    [onGetConventionById],
  );

  const handleReadMessages = useCallback(
    async (roomId: string) => {
      await readMessages({
        authToken: token,
        userId: userId || "",
        roomId,
      });
    },
    [token, userId],
  );

  const appendMessage = useCallback(
    (message) => {
      const newMessage = {
        ...message,
        ts: new Date(message?.ts?.["$date"]),
      } as unknown as MessageInfo;
      onSetMessage(newMessage);
      onSetLastMessage({
        roomId,
        lastMessage: newMessage || {},
        unreadCount: 0,
        unreadsFrom: "",
      });
    },
    [onSetMessage, onSetLastMessage, roomId],
  );

  const sendMessage = useCallback(
    (
      message: Omit<
        MessageBodyRequest,
        "sender_userId" | "sender_authToken" | "receiverUsername" | "t"
      >,
    ) => {
      if (message.message && message.message.trim()?.length > 0) {
        ws?.send(
          JSON.stringify({
            msg: "method",
            id: "3",
            method: "sendMessage",
            params: [
              {
                _id: Math.random().toString(36).substr(2, 10),
                rid: roomId,
                msg: message.message,
              },
            ],
          }),
        );
      }
    },
    [roomId, ws],
  );

  // Connect message websocket
  const connectMessage = useCallback(
    (ws: WebSocket | null) => {
      if (ws) {
        ws.onmessage = async (event) => {
          const data = JSON.parse(event.data);
          if (data.msg === "connected") {
            ws.send(
              JSON.stringify({
                msg: "method",
                id: "1",
                method: "login",
                params: [{ resume: token }],
              }),
            );
          }

          if (data.msg === "result" && data.id === "1") {
            if (roomId) {
              ws.send(
                JSON.stringify({
                  msg: "sub",
                  id: "2",
                  name: "stream-room-messages",
                  params: [roomId, false],
                }),
              );
            }

            ws.send(
              JSON.stringify({
                msg: "sub",
                id: "3",
                name: "stream-notify-user",
                params: [`${userId}/notification`, false],
              }),
            );
          }

          if (
            data.collection === "stream-room-messages" &&
            data.msg === "changed"
          ) {
            appendMessage(data.fields.args[0]);
            handleReadMessages(data.fields.args[0].rid);
          }

          if (
            data.collection === "stream-notify-user" &&
            data.msg === "changed"
          ) {
            const messageType = data.fields.eventName.split("/")[1];
            if (messageType === "notification") {
              const notificationData = data.fields.args[0];
              const payload = notificationData.payload;
              const roomIdnoti = payload.rid;
              const type = payload.type;
              const sender = payload.sender;

              const dataConversation = await handleGetConventionById(
                sender.name,
                type,
              );
              if (roomIdnoti !== roomId) {
                onSetLastMessage({
                  roomId: roomIdnoti,
                  lastMessage: dataConversation["lastMessage"] || {},
                  unreadCount: 1,
                  unreadsFrom: "",
                });
              }
            }
          }
        };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [roomId, token, userId],
  );

  const connectSocket = () => {
    const wsClient = new WebSocket(process.env.NEXT_APP_WS_URL || "");

    wsClient.onopen = () => {
      setWs(wsClient);
      wsClient.send(
        JSON.stringify({
          msg: "connect",
          version: "1",
          support: ["1"],
        }),
      );
    };
    return wsClient;
  };

  const reConnect = () => {
    setTimeout(() => {
      const wsNew = connectSocket();
      connectMessage(wsNew);
    }, 100);
  };

  useEffect(() => {
    const wsNew = connectSocket();
    connectMessage(wsNew);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectMessage]);

  useEffect(() => {
    if (ws) {
      ws.onclose = (e) => {
        if (
          ws &&
          e.code !== 3001 &&
          (ws.readyState === ws.CLOSING || ws.readyState === ws.CLOSED)
        ) {
          reConnect();
        }
      };
    }

    return () => {
      ws?.close(3001, "force closed");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, ws, dataTransfer?._id, connectMessage]);

  const forceCloseSocket = (reason?: string) => {
    if (ws) {
      ws.close(undefined, reason);
    }
  };

  return {
    connectMessage,
    sendMessage,
    forceCloseSocket,
  };
};
