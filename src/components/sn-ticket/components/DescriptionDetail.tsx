"use client";

import { Box, MenuItem, Select, Stack, Typography } from "@mui/material";
import { Button, Text } from "components/shared";
import { NS_TICKET } from "constant/index";
import { useTranslations } from "next-intl";

import { memo, useEffect, useMemo, useState } from "react";
import AssignGroup from "./AssignGroup";

const colorPriority = (check: String) => {
  if (check == "Medium") return "#03AE00";
  if (check == "Low") return "#0575E6";
  if (check == "High") return "#FF2C56";
};

const DescriptionDetail = (props: any) => {
  const t = useTranslations(NS_TICKET);
  const { data } = props || null;
  const [showDetail, setShowDetail] = useState(false);
  const [openEditType, setOpenEditType] = useState(false);
  const [openEditPriority, setOpenEditPriority] = useState(false);


  const [type, setType] = useState(data?.type || "None")
  const [priority, setPriority] = useState(data?.priority || "None")



  console.log("check type priority", type)
  console.log("check type priority", priority)

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

  }, [data]);
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
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
            {data?.assignUser?.fullname || "Nothing"}{" "}
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
          direction="row"
          justifyContent="space-between"
          sx={{ padding: "24px", gap: 5 }}
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
                {openEditType &&
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
                {openEditPriority &&
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
                          <Text sx={{ fontSize: 13 , color : colorPriority(item) , fontWeight : 700 }}>{item}</Text>
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
                />
              </Box>



              {/* rootCause */}
              <Box
                display="flex"
                gap="10px"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text fontSize={13}>{t("ticketDetail.rootCause")}</Text>
                <Text fontSize={13}>None</Text>
              </Box>

            </Box>
          </Box>
        </Stack>
      )}
    </>
  );
};

export default memo(DescriptionDetail);
