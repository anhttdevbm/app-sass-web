import { Box, Paper, Stack } from "@mui/material";
import React, { useState } from "react";
import CanceledTicketIcon from "icons/CanceledTicketIcon";
import ClosedTicketIcon from "icons/ClosedTicketIcon";
import InProgressTicketIcon from "icons/InProgressTicketIcon";
import NewTicketIcon from "icons/NewTicketIcon";
import OnHoldTicketIcon from "icons/OnHoldTicketIcon";
import OpenTicketIcon from "icons/OpenTicketIcon";
import ResolveTicketIcon from "icons/ResolveTicketIcon";
import SendAllTicketIcon from "icons/SendAllTicketIcon";
import { useTranslations } from "next-intl";
import { NS_TICKET } from "constant/index";
import { StateTicket, TypeViewList } from "components/sn-ticket/@type";
import { Button, Text } from "components/shared";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { setKeySearchTicket } from "store/ticket/actions";
import { useSelector } from "react-redux";
import { selectSearchTicket } from "store/ticket/selectors";
import useGetListTicket from "queries/ticket/useGetTicket/useGetListTicket";

const FilterTicket = React.memo(() => {
  const t = useTranslations(NS_TICKET);
  const dispatch = useAppDispatch();
  const typeViewDocStore = useAppSelector((state) => state.doc.typeViewDoc);
  const dataFilter = useSelector(selectSearchTicket);
  const [stateTicketActive, setStateTicketActive] = useState<StateTicket>(
    StateTicket.ALL_TICKET,
  );
  const { data: listTicket } = useGetListTicket();

  const stateTicket = React.useMemo(
    () => ({
      All_Ticket: {
        id: 1,
        icon: SendAllTicketIcon,
        title: "All Ticket",
        text: t("filterTicket.sendAll"),
      },
      New: {
        id: 2,
        icon: NewTicketIcon,
        title: "New",
        text: t("filterTicket.newTicket"),
      },
      Open: {
        id: 3,
        icon: OpenTicketIcon,
        title: "Open",
        text: t("filterTicket.openTicket"),
      },
      InProgress: {
        id: 4,
        icon: InProgressTicketIcon,
        title: "InProgress",
        text: t("filterTicket.inProgressTicket"),
      },
      OnHold: {
        id: 5,
        icon: OnHoldTicketIcon,
        title: "OnHold",
        text: t("filterTicket.onHoldTicket"),
      },
      Resolved: {
        id: 6,
        icon: ResolveTicketIcon,
        title: "Resolved",
        text: t("filterTicket.resolvedTicket"),
      },
      Closed: {
        id: 7,
        icon: ClosedTicketIcon,
        title: "Closed",
        text: t("filterTicket.closedTicket"),
      },
      Cancelled: {
        id: 8,
        icon: CanceledTicketIcon,
        title: "Cancelled",
        text: t("filterTicket.canceledTicket"),
      },
    }),
    [t],
  );

  const handleFilterTicket = (state: StateTicket) => {
    if (typeViewDocStore === TypeViewList.LIST) {
      const payload = {
        ...dataFilter,
        stage: state,
      };
      setStateTicketActive(state);
      dispatch(setKeySearchTicket(payload));
    }
  };

  return (
    <Stack>
      <Box
        bgcolor="background.default"
        borderRadius="2rem"
        overflow={{ xs: "auto" }}
        sx={{
          backgroundColor: "#fff",
          border: "1px solid #EFEFEF",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          spacing={3}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bgcolor="background.default"
            borderRadius="2rem"
            overflow={{ xs: "auto" }}
            sx={{
              // height: "56px",
              backgroundColor: "#fff",
              width: "100%",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {Object.values(stateTicket).map((item, index) => {
              const isActive = item.title === stateTicketActive;
              return (
                <Box
                  key={`${item.id}-${index}`}
                  onClick={() => handleFilterTicket(item.title as StateTicket)}
                  borderRadius="2rem"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    // padding: 2,
                    backgroundColor: isActive ? "#D9F0FD" : "#fff",
                    padding: "10px 10px",
                    cursor: "pointer",
                  }}
                >
                  {isActive ? (
                    <item.icon colorCustom="#045EB8" />
                  ) : (
                    <item.icon colorCustom="#B3B3B3" />
                  )}
                  <Text
                    sx={{
                      display: { xs: "block", md: "block" },
                      fontSize: { xs: 10, md: 13 },
                    }}
                    color={isActive ? "#045EB8" : "#B3B3B3"}
                    fontWeight={isActive ? "700" : "400"}
                  >
                    {item.text}
                  </Text>
                  {isActive && (
                    <Paper
                      elevation={3}
                      sx={{
                        borderRadius: "100%",
                        backgroundColor: isActive ? "#045EB8" : "#B3B3B3",
                        padding: 2,
                        width: 5,
                        height: 5,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        sx={{
                          fontSize: { xs: 12, md: 13 },
                        }}
                        color="#fff"
                      >
                        {" "}
                        {listTicket?.data?.count}
                      </Text>
                    </Paper>
                  )}
                </Box>
              );
            })}
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
});
export default FilterTicket;
