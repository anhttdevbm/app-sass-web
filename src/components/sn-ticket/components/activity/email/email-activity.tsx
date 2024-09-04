"use client";

import { Box, Stack } from "@mui/material";
import { Button, Text } from "components/shared";
import { useGetListReply } from "queries/ticket/useGetTicket/useGetListReply";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useTranslations } from "next-intl";
import { NS_TICKET } from "constant/index";
import { useState } from "react";
import Image from "next/image";
import ModelReply from "../../ModelReply";
import DeleteIcon from "public/images/ticket/deleteIcon.svg";

dayjs.extend(duration);

const EmailActivity = () => {
  const { data: listReply } = useGetListReply();
  const t = useTranslations(NS_TICKET);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const calculateTimeDifference = (pastDateString) => {
    const now = dayjs();
    const pastDate = dayjs(pastDateString);
    const difference = now.diff(pastDate);
    const diffDuration = dayjs.duration(difference);
    const hours = diffDuration.hours();
    const minutes = diffDuration.minutes();
    const seconds = diffDuration.seconds();
    let timeString = "";
    if (hours > 0) {
      timeString += `${hours} ${t("ticketDetail.historyActivity.time")} `;
    }
    return timeString.trim();
  };

  return (
    <>
      {listReply?.data?.data?.map((item, index) => (
        <>
          <Stack direction="row" gap={2} py={2}>
            <Box
              component="img"
              height="30px"
              width="30px"
              src={
                item?.creatorUser?.urlAvatar
                  ? item?.creatorUser?.urlAvatar
                  : "https://s3-alpha-sig.figma.com/img/5744/3623/4932c1bee1f2c0e5132cc2c2470cb1cc?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=C0jCodgq3p3A3XqZ~TCmk9AaesXKIcjVStRcPhjnk48fjZcX65G~CB7j6bllmcpti6fGBzy1NIJ3pRsZWi5L-qz4li1b7q3wkiwm15Mipfs~8SyUlHR6A3EbvZBVHSuSKS5niOgMD0x12RT7darl2PYfNrjePrhzeqmoKlni~pOB0zpQ14buGfT1iScCIbl-l0JhdGHm7eYIAH6n43PAtAFijpeZsSyeYAjAHfyoviM1OlT84jX0Uo2-OlZv45IyBtV8hEhDny2ndwep~wO2lkFLZc2BGnjFnAMpU4zePZ5yOxaZvqUKPrO4C9AzeKtPpl3dpZJEznRJVSDBOyQ6bA__"
              }
              alt="Image description"
              sx={{ borderRadius: "100%" }}
            />
            <Box>
              <Box display="flex" gap={1} alignItems="center">
                <Text fontSize={13} fontWeight={700}>
                  {item?.creatorUser?.fullname}
                </Text>
                <Text fontSize={13}>
                  <svg
                    width="14"
                    height="12"
                    viewBox="0 0 14 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 10.25V4.25C12.8333 4.4375 12.6536 4.60938 12.4609 4.76562C11.0651 5.83854 9.95573 6.71875 9.13281 7.40625C8.86719 7.63021 8.65104 7.80469 8.48438 7.92969C8.31771 8.05469 8.09245 8.18099 7.80859 8.30859C7.52474 8.4362 7.25781 8.5 7.00781 8.5H7H6.99219C6.74219 8.5 6.47526 8.4362 6.19141 8.30859C5.90755 8.18099 5.68229 8.05469 5.51562 7.92969C5.34896 7.80469 5.13281 7.63021 4.86719 7.40625C4.04427 6.71875 2.9349 5.83854 1.53906 4.76562C1.34635 4.60938 1.16667 4.4375 1 4.25V10.25C1 10.3177 1.02474 10.3763 1.07422 10.4258C1.1237 10.4753 1.18229 10.5 1.25 10.5H12.75C12.8177 10.5 12.8763 10.4753 12.9258 10.4258C12.9753 10.3763 13 10.3177 13 10.25ZM13 2.03906C13 2.02865 13 2 13 1.95312C13 1.90625 13 1.87109 13 1.84766C13 1.82422 12.9987 1.79036 12.9961 1.74609C12.9935 1.70182 12.9857 1.66927 12.9727 1.64844C12.9596 1.6276 12.9453 1.60417 12.9297 1.57812C12.9141 1.55208 12.8906 1.53255 12.8594 1.51953C12.8281 1.50651 12.7917 1.5 12.75 1.5H1.25C1.18229 1.5 1.1237 1.52474 1.07422 1.57422C1.02474 1.6237 1 1.68229 1 1.75C1 2.625 1.38281 3.36458 2.14844 3.96875C3.15365 4.76042 4.19792 5.58594 5.28125 6.44531C5.3125 6.47135 5.40365 6.54818 5.55469 6.67578C5.70573 6.80339 5.82552 6.90104 5.91406 6.96875C6.0026 7.03646 6.11849 7.11849 6.26172 7.21484C6.40495 7.3112 6.53646 7.38281 6.65625 7.42969C6.77604 7.47656 6.88802 7.5 6.99219 7.5H7H7.00781C7.11198 7.5 7.22396 7.47656 7.34375 7.42969C7.46354 7.38281 7.59505 7.3112 7.73828 7.21484C7.88151 7.11849 7.9974 7.03646 8.08594 6.96875C8.17448 6.90104 8.29427 6.80339 8.44531 6.67578C8.59635 6.54818 8.6875 6.47135 8.71875 6.44531C9.80208 5.58594 10.8464 4.76042 11.8516 3.96875C12.1328 3.74479 12.3945 3.44401 12.6367 3.06641C12.8789 2.6888 13 2.34635 13 2.03906ZM14 1.75V10.25C14 10.5938 13.8776 10.888 13.6328 11.1328C13.388 11.3776 13.0938 11.5 12.75 11.5H1.25C0.90625 11.5 0.611979 11.3776 0.367188 11.1328C0.122396 10.888 0 10.5938 0 10.25V1.75C0 1.40625 0.122396 1.11198 0.367188 0.867188C0.611979 0.622396 0.90625 0.5 1.25 0.5H12.75C13.0938 0.5 13.388 0.622396 13.6328 0.867188C13.8776 1.11198 14 1.40625 14 1.75Z"
                      fill="#374151"
                    />
                  </svg>
                </Text>
                <Text fontSize={10} color="#626F86">
                  {calculateTimeDifference(item?.createTime)}
                </Text>
              </Box>
            </Box>
          </Stack>

          <Stack
            padding={2}
            direction="column"
            borderRadius="6px"
            width="100%"
            height="300px"
            border="1px solid #ccc"
            bgcolor="#F2FAFF"
            justifyContent="space-between"
          >
            <Box
              sx={{
                overflow: "auto",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
              display="flex"
              flexDirection="column"
              gap={3}
            >
              <Box>
                <Text py={1} fontSize={12} fontWeight={700}>
                  From : {item?.to}
                </Text>
                <Text fontSize={13} fontWeight={700}>
                  Title : {item?.title}
                </Text>
              </Box>

              {/* <Text fontSize={13} fontWeight={700}>.......</Text> */}
              <Text fontSize={14} fontWeight={500}>
                {item?.content}
              </Text>
            </Box>
            <Box
              p={1}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" gap={1}>
                {item?.lstFile?.length > 0 && (
                  <>
                    {item?.lstFile?.map((file, index) => (
                      <Box
                        component="img"
                        height={50}
                        width={50}
                        src={file?.link}
                        alt="Image description"
                        sx={{ borderRadius: "7px" }}
                      />
                    ))}
                  </>
                )}
              </Box>
              <Button
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  width: "10%",
                  display: "flex",
                  gap: "3px",
                }}
                onClick={() => setOpen((prev) => !prev)}
              >
                <svg
                  width="16"
                  height="13"
                  viewBox="0 0 16 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.33333 3.5013V0.167969L0.5 6.0013L6.33333 11.8346V8.41797C10.5 8.41797 13.4167 9.7513 15.5 12.668C14.6667 8.5013 12.1667 4.33464 6.33333 3.5013Z"
                    fill="black"
                    fill-opacity="0.54"
                  />
                </svg>
                <Text
                  fontSize={13}
                  color="rgba(0, 0, 0, 0.54)"
                  fontWeight={700}
                >
                  {t("ticketDetail.reply")}
                </Text>
              </Button>
            </Box>
          </Stack>

          <ModelReply
            open={open}
            handleClose={handleClose}
            handleClickOpen={handleClickOpen}
          />
        </>
      ))}
    </>
  );
};
export default EmailActivity;
