import { Button, Stack, Typography } from "@mui/material";
import DownloadIcon from "icons/DownloadIcon";
import moment from "moment";
import Image from "next/image";
import { useGetTicketDetail } from "queries/ticket/useGetTicket/useGetTicketById";
import React from "react";

const ListView = React.memo(
  ({ downloadAllImages }: { downloadAllImages: (file) => void }) => {
    const { data: dataTicket } = useGetTicketDetail();
    return (
      <Stack
        justifyContent={"flex-start"}
        alignItems={"center"}
        gap={"35px"}
        flexDirection={"row"}
        marginTop={"25px"}
        flexWrap={"wrap"}
      >
        {dataTicket?.lstFile?.map((file, index: number) => (
          <Button
            key={index}
            style={{ position: "relative" }}
            onClick={() => {
              downloadAllImages([file]);
            }}
          >
            <Stack
              justifyContent={"flex-start"}
              alignItems={"center"}
              gap={"15px"}
              sx={{
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
                maxWidth: "143px",
                boxSizing: "border-box",
                "&:hover": {
                  background: "rgba(0, 0, 0, 0.25)",
                  cursor: "pointer",
                  "& .delete_icon": {
                    display: "block !important",
                  },
                },
              }}
            >
              <Button
                className="delete_icon"
                style={{
                  display: "none",
                  position: "absolute",
                  width: "36px",
                  height: "36px",
                  minWidth: "36px",
                  borderRadius: "100%",
                  top: "50%",
                  left: "50%",
                  transform: " translate(-50%, -50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "#fff",
                }}
              >
                <DownloadIcon />
              </Button>
              <Image
                src={file?.link}
                alt={`Uploaded ${file?.nameFile}`}
                width={143}
                height={93}
                style={{
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                }}
              />
              <Stack
                justifyContent={"flex-center"}
                alignItems={"center"}
                gap={"10px"}
                sx={{
                  padding: "10px 13px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: "700",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    maxWidth: "128px",
                    color: "#333333",
                  }}
                >
                  {file?.nameFile}
                </Typography>
                <Typography
                  sx={{ fontSize: "13px", fontWeight: "700", color: "#333333" }}
                >
                  {moment(file?.createTime).format("DD MMM YYYY, HH:mm")}
                </Typography>
              </Stack>
            </Stack>
          </Button>
        ))}
      </Stack>
    );
  },
);
export default ListView;
