/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Modal, Typography } from "@mui/material";
import Avatar from "components/Avatar";
import { inter } from "components/sn-time-tracking/CalendarTracking/CalendarTracking.styles";
import { useEffect, useState } from "react";
import { useChat } from "store/chat/selectors";
import { CHAT_EVENT_TYPE, DirectionChat } from "store/chat/type";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { useMeeting } from "store/meeting/selectors";
import useFetchingChatting from "../hooks/useFetchingChatting";
import { useChatHelpers, useWSChat } from "store/chat/helpers";
import { useParams } from "next/navigation";
import { getParticipants } from "store/meeting/actions";
import { useAuth } from "store/app/selectors";
import { getEmployees } from "store/company/actions";

interface IProps {
  open: boolean;
  handleClose: () => void;
}

interface CompanyMember {
  id: string;
  avatar: string;
  company: string;
  created_time: string;
  date_end_using: string;
  date_start_using: string;
  email: string;
  fullname: string;
  is_active: boolean;
  last_online_at: string;
  phone: string;
  updated_time: string;
  user_status: string;
  status: string;
  username: string;
}

interface MemberGroupChat {
  id: string;
  avatar: string;
  email: string;
  fullname: string;
  lastOnlineAt: string;
  phone: string;
  position: string;
  status: string;
  username: string;
}

export default function AddParticipantModal({ open, handleClose }: IProps) {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { sendMessage } = useWSChat();
  const { wsClient } = useChat();
  const [companyMembers, setCompanyMembers] = useState<CompanyMember[]>([]);
  const [chatMembers, setChatMembers] = useState<MemberGroupChat[]>([]);
  const participantIds = chatMembers.map((member) => member.id);
  const { user } = useAuth();
  const { handleCreateGroupWS, handleAddMemberToGroup } = useChatHelpers();

  // Onclick call button
  const onAddParticipant = (participantId: string) => {
    if (chatMembers.length === 2) {
      handleCreateGroupWS([...participantIds, participantId]);
    } else {
      handleAddMemberToGroup([participantId]);
    }
  };

  useEffect(() => {
    if (!id) return;
    dispatch(getEmployees({ company: user?.company }))
      .unwrap()
      .then((res) => {
        setCompanyMembers(res.items as CompanyMember[]);
      });

    if (wsClient) {
      wsClient.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.event === CHAT_EVENT_TYPE.DETAIL_ROOM) {
          setChatMembers(data?.data?.members);
        }
      };

      if (open) {
        sendMessage({
          event: CHAT_EVENT_TYPE.DETAIL_ROOM,
          roomId: id as string,
        });
      }
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: 500,
          background: "#FFF",
          padding: "24px",
          borderRadius: "8px",
        }}
      >
        <Typography
          sx={{
            mb: "24px",
            fontFamily: inter.style.fontFamily,
          }}
        >
          Participants
        </Typography>
        <Box>
          {companyMembers.map((member) => (
            <Box
              key={member.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                justifyContent: "space-between",
                py: "12px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Avatar src="" alt="" size={44} />
                <Typography
                  sx={{
                    fontFamily: inter.style.fontFamily,
                    mb: "4px",
                    fontSize: "14px",
                  }}
                >
                  {member.fullname}
                </Typography>
              </Box>
              {!participantIds.includes(member.id) &&
                user?.id !== member.id && (
                  <Button
                    onClick={() => onAddParticipant(member.id)}
                    sx={{
                      minWidth: "120px",
                      backgroundColor: "#E1F0FF",
                      textTransform: "capitalize",
                      "&:hover": {
                        backgroundColor: "#E1F0FF",
                        opacity: 0.8,
                      },
                    }}
                  >
                    Call
                  </Button>
                )}
            </Box>
          ))}
        </Box>
      </Box>
    </Modal>
  );
}
