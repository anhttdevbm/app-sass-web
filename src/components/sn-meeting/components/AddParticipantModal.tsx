/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Modal, Typography } from "@mui/material";
import Avatar from "components/Avatar";
import { inter } from "components/sn-time-tracking/CalendarTracking/CalendarTracking.styles";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "store/app/selectors";
import { useChatHelpers, useWSChat } from "store/chat/helpers";
import { useChat } from "store/chat/selectors";
import { CHAT_EVENT_TYPE } from "store/chat/type";
import { getEmployees } from "store/company/actions";
import { useAppDispatch } from "store/hooks";

interface IProps {
  open: boolean;
  handleClose: () => void;
}

interface CompanyMember {
  id: string;
  avatar: string;
  company: string;
  created_time: string;
  expiration_date?: string;
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
  const [countdowns, setCountdowns] = useState<Map<string, number>>(new Map());
  const [disabledButtons, setDisabledButtons] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { handleCreateGroupWS, handleAddMemberToGroup } = useChatHelpers();

  // Onclick call button
  const onAddParticipant = useCallback((participantId: string) => {
    if (disabledButtons.has(participantId) || participantIds.includes(participantId)) return;

    setCountdowns((prev) => new Map(prev).set(participantId, 3));
    const intervalId = setInterval(() => {
      setCountdowns((prev) => {
        const newCountdowns = new Map(prev);
        const currentCountdown = newCountdowns.get(participantId) || 0;
        if (currentCountdown === 1) {
          clearInterval(intervalId);
          setDisabledButtons((prev) => new Set(prev).add(participantId));
          newCountdowns.delete(participantId);
        } else {
          newCountdowns.set(participantId, currentCountdown - 1);
        }
        return newCountdowns;
      });
    }, 1000);

    if (chatMembers.length === 2) {
      handleCreateGroupWS([...participantIds, participantId]);
    } else {
      handleAddMemberToGroup([participantId]);
    }
  }, [chatMembers.length, handleAddMemberToGroup, handleCreateGroupWS, participantIds, disabledButtons]);

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
                <Avatar src={member?.avatar} alt={member.fullname} size={44} />
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Button
                      onClick={() => onAddParticipant(member.id)}
                      disabled={disabledButtons.has(member.id) || countdowns.has(member.id)}
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
                      {disabledButtons.has(member.id) ? "Called" : "Call"}
                    </Button>
                    {countdowns.has(member.id) && (
                      <Typography variant="body2" sx={{ fontFamily: inter.style.fontFamily }}>
                        {countdowns.get(member.id)}s
                      </Typography>
                    )}
                  </Box>
                )}
            </Box>
          ))}
        </Box>
      </Box>
    </Modal>
  );
}
