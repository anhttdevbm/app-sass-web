"use client";

import { Box, Stack, TextField} from "@mui/material";
import { Button, Text } from "components/shared";
import { NS_TICKET } from "constant/index";
import { useTranslations } from "next-intl";

import { memo, useEffect, useMemo, useState } from "react";
import AssignGroup from "./AssignGroup";
import useUpdateTicket from "queries/ticket/useTicketAction/useUpdateTicket";
import { useAuth, useSnackbar } from "store/app/selectors";
import { Permission } from "constant/enums";

const colorPriority = (check: String) => {
  if (check == "Medium") return "#03AE00";
  if (check == "Low") return "#0575E6";
  if (check == "High") return "#FF2C56";
};

const DescriptionDetail = (props: any) => {
  const { user } = useAuth();
  const checkRole = user?.roles?.some((item) => item == Permission.SA || item == Permission.SP)
  const t = useTranslations(NS_TICKET);
  const { data } = props || null;
  const [showDetail, setShowDetail] = useState(false);
  const [openEditType, setOpenEditType] = useState(false);
  const [openEditPriority, setOpenEditPriority] = useState(false);
  const [openEditRootCase, setOpenEditRootCase] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { updateTicket } = useUpdateTicket();
  const { onAddSnackbar } = useSnackbar();

  const [type, setType] = useState(data?.type || "None")
  const [priority, setPriority] = useState(data?.priority || "None")
  const [assign, setAssign] = useState("")
  const [rootCause, setRootCause] = useState(data?.rootCause || "None")



  const handleShowDetail = () => {
    setShowDetail((prev) => !prev);
  };

  useEffect(() => {
    if (data?.type !== undefined) {
      setType(data?.type);
    }
    if (data?.priority !== undefined) {
      setPriority(data?.priority);
    }
    if (data?.assignUser !== null) {
      setAssign(data?.assignUser?.id);
    }
    if (data?.rootCause !== undefined) {
      setRootCause(data?.rootCause);
    }

  }, [data]);

  const handleSubmit = () => {
    const payload = {
      id: data?.id,
      type,
      priority,
      assign,
      rootCause,
    }
    // console.log("check type priority", payload)
    updateTicket.mutate(payload, {
      onSuccess: (data) => {
        console.log("Success:", data);
        onAddSnackbar(`${data?.data?.errorMessage ? data?.data?.errorMessage : "Update Success"}`);
        setOpenEdit(false)
      },
      onError: (err) => {
        onAddSnackbar("Create ticket error!", "error");
      },
    });

  }
  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'start', sm: "center", md: "center" }}
        py={{xs : 1}}
        sx={{ backgroundColor: "#F2FAFF", width: "100%", padding: "0px 24px" }}
      >
        <Box display="flex" gap="10px" alignItems="center" py={2}>
          <Box
            component="img"
            height="30px"
            width="30px"
            src="https://via.placeholder.com/150"
            alt="Image description"
            sx={{ borderRadius: "100%" }}
          />
          <Text sx={{ fontSize: 13 }}>
            {data?.creatorUser?.fullname || "Nothing"}{" "}
            {t("ticketDetail.createRequest")}
          </Text>
        </Box>
        <Text
          onClick={() => handleShowDetail()}
          sx={{
            fontSize: 13,
            color: "#0575E6",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          {!showDetail
            ? t("ticketDetail.btnShowDetail")
            : t("ticketDetail.btnHideDetail")}
        </Text>
      </Stack>

      {showDetail && (
        <Stack
          direction={{ xs: 'column', sm: 'row', md: 'row' }}
          justifyContent="space-between"
          sx={{ padding: "24px", gap: 5 }}
          position="relative"
        >
          <Box sx={{ flex: 6 }}>
            <Text fontSize={13} fontWeight={700}>
              {t("ticketDetail.description")}
            </Text>
            <Text fontSize={13} py={2} color="#4D4D4D">
              {data?.description}
            </Text>
          </Box>
          <Box
            sx={{
              flex: 4,
              backgroundColor: "#F2FAFF",
              display: "flex",
              justifyContent: "space-between ",
              flexDirection: "row",
              padding: "24px",
            }}
          >
            <Box
              flex={10}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                textAlign: "end",
              }}
            >
              <Box
                onClick={() => setOpenEditType(prev => !prev)}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  position: "relative",
                  maxWidth: "100%",
                  cursor: "pointer",
                  borderRadius: "6px",
                }}
              >
                <Text fontSize={13}>{t("ticketDetail.requestTicketType")}</Text>
                <Text fontSize={13}>{type}</Text>
                {openEditType && openEdit &&
                  <Box
                    sx={{
                      position: "absolute",
                      top: 25,
                      backgroundColor: "#fff",
                      borderRadius: "10px",
                      width: "100%",
                      height: "150px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      padding: "3px 3px",
                      overflow: "auto",
                      zIndex: 10,
                      "&:hover": {
                        cursor: "pointer",
                        borderRadius: "5px",
                      },
                      "&::-webkit-scrollbar": {
                        display: "none",
                      },
                    }}
                  >
                    {["Service Request", "Problem", "Question", "Others"]
                      .map((item: any, index: number) => (
                        <Box
                          key={index}
                          onClick={() => setType(item)}
                          display="flex"
                          alignItems="center"
                          gap="5px"
                          padding="10px"
                          sx={{
                            "&:hover": {
                              backgroundColor: "#D9F0FD",
                              cursor: "pointer",
                              borderRadius: "5px",
                            },
                          }}
                        >
                          <Text sx={{ fontSize: 13 }}>{item}</Text>
                        </Box>
                      ))}
                  </Box>
                }


              </Box>

              {/* priority */}
              <Box
                onClick={() => setOpenEditPriority(prev => !prev)}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  position: "relative",
                  maxWidth: "100%",
                  cursor: "pointer",
                  borderRadius: "6px",
                }}
              >
                <Text fontSize={13}>{t("ticketDetail.priority")}</Text>

                <Text color={colorPriority(priority)} fontSize={13}>
                  {priority}
                </Text>
                {openEditPriority && openEdit &&
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.06183 7.54035C7.87431 7.72782 7.62 7.83314 7.35484 7.83314C7.08967 7.83314 6.83536 7.72782 6.64784 7.54035L0.990835 1.88335C0.895325 1.7911 0.819143 1.68076 0.766734 1.55876C0.714325 1.43675 0.686738 1.30553 0.685585 1.17275C0.684431 1.03997 0.709733 0.908293 0.760014 0.785397C0.810295 0.662501 0.884548 0.550848 0.97844 0.456956C1.07233 0.363063 1.18398 0.28881 1.30688 0.238529C1.42978 0.188248 1.56146 0.162946 1.69424 0.1641C1.82702 0.165254 1.95824 0.19284 2.08024 0.245249C2.20224 0.297658 2.31259 0.37384 2.40484 0.46935L7.35484 5.41935L12.3048 0.46935C12.4934 0.287192 12.746 0.186398 13.0082 0.188676C13.2704 0.190955 13.5212 0.296124 13.7067 0.481532C13.8921 0.66694 13.9972 0.917753 13.9995 1.17995C14.0018 1.44215 13.901 1.69475 13.7188 1.88335L8.06183 7.54035Z" fill="#838195" />
                  </svg>
                }

                {openEditPriority && openEdit &&
                  <Box
                    sx={{
                      position: "absolute",
                      top: 25,
                      backgroundColor: "#fff",
                      width: "100%",
                      height: "150px",
                      border: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      padding: "3px 3px",
                      overflow: "auto",
                      zIndex: 10,
                      "&:hover": {
                        cursor: "pointer",
                        borderRadius: "5px",
                      },
                      "&::-webkit-scrollbar": {
                        display: "none",
                      },
                    }}
                  >
                    {["High", "Medium", "Low"]
                      .map((item: any, index: number) => (
                        <Box
                          key={index}
                          onClick={() => setPriority(item)}
                          display="flex"
                          alignItems="center"
                          gap="5px"
                          padding="10px"
                          sx={{
                            "&:hover": {
                              backgroundColor: "#D9F0FD",
                              cursor: "pointer",
                              borderRadius: "5px",
                            },
                          }}
                        >
                          <Text sx={{ fontSize: 13, color: colorPriority(item), fontWeight: 700 }}>{item}</Text>
                        </Box>
                      ))}
                  </Box>
                }
              </Box>


              {/* assign */}
              <Box
                display="flex"
                gap="10px"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text sx={{ height: 30 }} fontSize={13}>{t("ticketDetail.assignee")}</Text>
                <AssignGroup
                  style={{ width: "100%", justifyContent: "flex-end", gap: 1, border: "none", padding: 0 }}
                  styledDropdown={{ top: 30 }}
                  item={data}
                  type="detail"
                  setAssign={setAssign}
                />
              </Box>



              {/* rootCause */}
              <Box
                onClick={() => setOpenEditRootCase(prev => !prev)}
                display="flex"
                gap="10px"
                alignItems="center"
                justifyContent="space-between"
                sx={{ cursor: "pointer" }}
              >
                <Text fontSize={13}>{t("ticketDetail.rootCause")}</Text>
                <Text fontSize={13}>None</Text>
              </Box>
              {openEditRootCase && openEdit &&
                <Box sx={{ width: "100%", height: 100 }}>
                  <TextField
                    fullWidth
                    value={rootCause}
                    placeholder="none"
                    onChange={(e) => setRootCause(e.target.value)}
                  />
                </Box>
              }

              {openEdit &&
                <Box py={2}>
                  <Button onClick={() => setOpenEdit(prev => !prev)} >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_3508_119111)">
                        <path d="M9.46585 8.01168L15.6959 1.7814C16.1014 1.37615 16.1014 0.720912 15.6959 0.315659C15.2907 -0.0895946 14.6354 -0.0895946 14.2302 0.315659L7.99991 6.54593L1.76983 0.315659C1.36438 -0.0895946 0.709336 -0.0895946 0.304082 0.315659C-0.101361 0.720912 -0.101361 1.37615 0.304082 1.7814L6.53416 8.01168L0.304082 14.2419C-0.101361 14.6472 -0.101361 15.3024 0.304082 15.7077C0.506045 15.9098 0.771595 16.0114 1.03695 16.0114C1.30232 16.0114 1.56768 15.9098 1.76983 15.7077L7.99991 9.47742L14.2302 15.7077C14.4323 15.9098 14.6977 16.0114 14.9631 16.0114C15.2284 16.0114 15.4938 15.9098 15.6959 15.7077C16.1014 15.3024 16.1014 14.6472 15.6959 14.2419L9.46585 8.01168Z" fill="black" fill-opacity="0.5" />
                      </g>
                      <defs>
                        <clipPath id="clip0_3508_119111">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </Button>
                  <Button onClick={() => handleSubmit()} sx={{ backgroundColor: "#fff" }}>
                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.12669 12.9774C5.97396 13.131 5.76558 13.2167 5.54913 13.2167C5.33267 13.2167 5.1243 13.131 4.97157 12.9774L0.359012 8.36408C-0.119671 7.8854 -0.119671 7.10919 0.359012 6.6314L0.936573 6.05369C1.4154 5.57501 2.19072 5.57501 2.6694 6.05369L5.54913 8.93357L13.3306 1.15198C13.8094 0.673298 14.5855 0.673298 15.0634 1.15198L15.641 1.72969C16.1196 2.20837 16.1196 2.98444 15.641 3.46237L6.12669 12.9774Z" fill="#5EDD60" />
                    </svg>
                  </Button>
                </Box>
              }

            </Box>
          </Box>

          {checkRole &&
            <Box
              onClick={() => setOpenEdit(prev => !prev)}
              sx={{
                position: "absolute",
                display: "grid",
                placeItems: "center",
                right: 10,
                top: 10,
                borderRadius: 50,
                backgroundColor: "#fff",
                width: 40,
                height: 40
              }}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="path-1-inside-1_8710_29113" fill="white">
                  <path d="M3.46225 12.1992C3.081 12.1992 2.72475 12.068 2.4685 11.8242C2.1435 11.518 1.98725 11.0555 2.0435 10.5555L2.27475 8.53049C2.3185 8.14924 2.54975 7.64299 2.8185 7.36799L7.94975 1.93674C9.231 0.580487 10.5685 0.542987 11.9247 1.82424C13.281 3.10549 13.3185 4.44299 12.0372 5.79924L6.906 11.2305C6.6435 11.5117 6.156 11.7742 5.77475 11.8367L3.76225 12.1805C3.656 12.1867 3.56225 12.1992 3.46225 12.1992ZM9.956 1.81799C9.47475 1.81799 9.056 2.11799 8.631 2.56799L3.49975 8.00549C3.37475 8.13674 3.231 8.44924 3.206 8.63049L2.97475 10.6555C2.94975 10.8617 2.99975 11.0305 3.11225 11.1367C3.22475 11.243 3.3935 11.2805 3.59975 11.2492L5.61225 10.9055C5.7935 10.8742 6.0935 10.7117 6.2185 10.5805L11.3497 5.14924C12.1247 4.32424 12.406 3.56174 11.2747 2.49924C10.7747 2.01799 10.3435 1.81799 9.956 1.81799Z" />
                </mask>
                <path d="M3.46225 12.1992C3.081 12.1992 2.72475 12.068 2.4685 11.8242C2.1435 11.518 1.98725 11.0555 2.0435 10.5555L2.27475 8.53049C2.3185 8.14924 2.54975 7.64299 2.8185 7.36799L7.94975 1.93674C9.231 0.580487 10.5685 0.542987 11.9247 1.82424C13.281 3.10549 13.3185 4.44299 12.0372 5.79924L6.906 11.2305C6.6435 11.5117 6.156 11.7742 5.77475 11.8367L3.76225 12.1805C3.656 12.1867 3.56225 12.1992 3.46225 12.1992ZM9.956 1.81799C9.47475 1.81799 9.056 2.11799 8.631 2.56799L3.49975 8.00549C3.37475 8.13674 3.231 8.44924 3.206 8.63049L2.97475 10.6555C2.94975 10.8617 2.99975 11.0305 3.11225 11.1367C3.22475 11.243 3.3935 11.2805 3.59975 11.2492L5.61225 10.9055C5.7935 10.8742 6.0935 10.7117 6.2185 10.5805L11.3497 5.14924C12.1247 4.32424 12.406 3.56174 11.2747 2.49924C10.7747 2.01799 10.3435 1.81799 9.956 1.81799Z" fill="#0575E6" />
                <path d="M2.4685 11.8242L3.15772 11.0997L3.1543 11.0964L2.4685 11.8242ZM2.0435 10.5555L1.04995 10.442L1.04977 10.4437L2.0435 10.5555ZM2.27475 8.53049L1.28127 8.41648L1.2812 8.41703L2.27475 8.53049ZM2.8185 7.36799L3.53368 8.06692L3.53959 8.06088L3.54539 8.05473L2.8185 7.36799ZM7.94975 1.93674L8.67664 2.62348L8.67667 2.62346L7.94975 1.93674ZM12.0372 5.79924L12.7641 6.48598L12.7642 6.48596L12.0372 5.79924ZM6.906 11.2305L6.17909 10.5437L6.17494 10.5482L6.906 11.2305ZM5.77475 11.8367L5.61297 10.8499L5.60638 10.851L5.77475 11.8367ZM3.76225 12.1805L3.82097 13.1788L3.87614 13.1755L3.93062 13.1662L3.76225 12.1805ZM8.631 2.56799L7.90398 1.88136L7.90371 1.88166L8.631 2.56799ZM3.49975 8.00549L4.22389 8.69515L4.22704 8.69182L3.49975 8.00549ZM3.206 8.63049L2.21538 8.49385L2.21378 8.50542L2.21245 8.51703L3.206 8.63049ZM2.97475 10.6555L3.96751 10.7758L3.96829 10.7689L2.97475 10.6555ZM3.59975 11.2492L3.74955 12.238L3.75885 12.2365L3.76812 12.235L3.59975 11.2492ZM5.61225 10.9055L5.78062 11.8912L5.78215 11.8909L5.61225 10.9055ZM6.2185 10.5805L6.94264 11.2701L6.94539 11.2672L6.2185 10.5805ZM11.3497 5.14924L12.0766 5.83599L12.0786 5.83391L11.3497 5.14924ZM11.2747 2.49924L10.5812 3.21978L10.5901 3.22815L11.2747 2.49924ZM3.46225 11.1992C3.30597 11.1992 3.20637 11.146 3.15771 11.0997L1.77928 12.5488C2.24313 12.99 2.85603 13.1992 3.46225 13.1992V11.1992ZM3.1543 11.0964C3.08746 11.0335 3.01143 10.8966 3.03723 10.6673L1.04977 10.4437C0.963063 11.2144 1.19953 12.0025 1.7827 12.552L3.1543 11.0964ZM3.03704 10.6689L3.26829 8.64395L1.2812 8.41703L1.04995 10.442L3.03704 10.6689ZM3.26823 8.64449C3.27493 8.58611 3.30497 8.46892 3.36921 8.33061C3.4341 8.19089 3.50098 8.10039 3.53368 8.06692L2.10331 6.66905C1.86727 6.91059 1.68415 7.21071 1.55528 7.48818C1.42577 7.76706 1.31832 8.09361 1.28127 8.41648L3.26823 8.64449ZM3.54539 8.05473L8.67664 2.62348L7.22285 1.24999L2.0916 6.68124L3.54539 8.05473ZM8.67667 2.62346C9.20892 2.06005 9.62941 1.89972 9.93735 1.89103C10.2454 1.88233 10.6745 2.01877 11.238 2.55116L12.6115 1.09732C11.8188 0.348455 10.901 -0.136979 9.8809 -0.108177C8.86071 -0.0793716 7.97183 0.457169 7.22283 1.25002L8.67667 2.62346ZM11.238 2.55116C11.8014 3.08341 11.9618 3.5039 11.9705 3.81184C11.9792 4.11987 11.8427 4.54896 11.3103 5.11251L12.7642 6.48596C13.513 5.69326 13.9985 4.77548 13.9697 3.75539C13.9409 2.7352 13.4043 1.84632 12.6115 1.09732L11.238 2.55116ZM11.3104 5.11249L6.1791 10.5437L7.63289 11.9172L12.7641 6.48598L11.3104 5.11249ZM6.17494 10.5482C6.06199 10.6692 5.7741 10.8235 5.61297 10.8499L5.93652 12.8236C6.5379 12.725 7.22501 12.3543 7.63705 11.9128L6.17494 10.5482ZM5.60638 10.851L3.59388 11.1948L3.93062 13.1662L5.94312 12.8225L5.60638 10.851ZM3.70353 11.1822C3.49428 11.1945 3.53256 11.1992 3.46225 11.1992V13.1992C3.59194 13.1992 3.81772 13.179 3.82097 13.1788L3.70353 11.1822ZM9.956 0.817987C9.03483 0.817987 8.36265 1.39572 7.90398 1.88136L9.35801 3.25461C9.54017 3.06174 9.67984 2.9462 9.78825 2.88092C9.88691 2.82151 9.93542 2.81799 9.956 2.81799V0.817987ZM7.90371 1.88166L2.77246 7.31916L4.22704 8.69182L9.35829 3.25432L7.90371 1.88166ZM2.77561 7.31583C2.60382 7.49621 2.48216 7.71998 2.40919 7.87635C2.3344 8.03662 2.24723 8.2629 2.21538 8.49385L4.19662 8.76713C4.19376 8.78788 4.1908 8.79956 4.19055 8.80058C4.19011 8.80232 4.19086 8.79913 4.19355 8.79105C4.19919 8.77412 4.20874 8.74959 4.22156 8.72212C4.23446 8.69448 4.24632 8.67318 4.25392 8.66096C4.25748 8.65523 4.25802 8.65486 4.25499 8.65893C4.25247 8.66233 4.24233 8.67577 4.22389 8.69514L2.77561 7.31583ZM2.21245 8.51703L1.98121 10.542L3.96829 10.7689L4.19954 8.74395L2.21245 8.51703ZM1.98201 10.5352C1.93142 10.9525 2.01566 11.4766 2.42562 11.8638L3.79887 10.4097C3.98383 10.5844 3.96807 10.7709 3.96748 10.7758L1.98201 10.5352ZM2.42562 11.8638C2.8396 12.2547 3.36339 12.2965 3.74955 12.238L3.44994 10.2605C3.42361 10.2645 3.6099 10.2312 3.79887 10.4097L2.42562 11.8638ZM3.76812 12.235L5.78062 11.8912L5.44388 9.91976L3.43138 10.2635L3.76812 12.235ZM5.78215 11.8909C6.0256 11.849 6.25517 11.7446 6.4102 11.6612C6.56581 11.5774 6.77605 11.4451 6.94264 11.2701L5.49436 9.89083C5.51093 9.87343 5.5222 9.86397 5.52457 9.862C5.52754 9.85953 5.52652 9.86057 5.52075 9.86464C5.5085 9.87327 5.48819 9.88613 5.46273 9.89982C5.43723 9.91354 5.41568 9.92319 5.40239 9.92838C5.39615 9.93081 5.3952 9.9309 5.39948 9.92962C5.40305 9.92856 5.41788 9.92425 5.44234 9.92003L5.78215 11.8909ZM6.94539 11.2672L12.0766 5.83598L10.6229 4.46249L5.4916 9.89374L6.94539 11.2672ZM12.0786 5.83391C12.496 5.3896 12.9771 4.77062 13.0253 3.97363C13.0768 3.12158 12.6255 2.39594 11.9594 1.77033L10.5901 3.22815C11.0553 3.66503 11.029 3.8519 11.0289 3.85297C11.0255 3.90911 10.9785 4.08387 10.6209 4.46456L12.0786 5.83391ZM11.9682 1.77875C11.3771 1.20976 10.7094 0.817987 9.956 0.817987V2.81799C9.97759 2.81799 10.1724 2.82622 10.5813 3.21972L11.9682 1.77875Z" fill="#0575E6" mask="url(#path-1-inside-1_8710_29113)" />
                <path d="M10.8373 6.84256C10.8248 6.84256 10.806 6.84256 10.7935 6.84256C8.84353 6.64881 7.27478 5.16756 6.97478 3.23006C6.93728 2.97381 7.11228 2.73631 7.36853 2.69256C7.62478 2.65506 7.86228 2.83006 7.90603 3.08631C8.14353 4.59881 9.36853 5.76131 10.8935 5.91131C11.1498 5.93631 11.3373 6.16756 11.3123 6.42381C11.281 6.66131 11.0748 6.84256 10.8373 6.84256Z" fill="#0575E6" />
                <path d="M13.125 14.2188H1.875C1.61875 14.2188 1.40625 14.0063 1.40625 13.75C1.40625 13.4938 1.61875 13.2812 1.875 13.2812H13.125C13.3813 13.2812 13.5938 13.4938 13.5938 13.75C13.5938 14.0063 13.3813 14.2188 13.125 14.2188Z" fill="#0575E6" />
              </svg>

            </Box>

          }


        </Stack>
      )}
    </>
  );
};

export default memo(DescriptionDetail);
