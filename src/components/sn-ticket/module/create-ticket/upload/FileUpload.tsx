import { Box, Stack, Typography } from "@mui/material";
import moment from "moment";
import Image from "next/image";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import IconUpload from "public/images/ticket/upload.svg";
import DeleteIcon from "public/images/ticket/deleteIcon.svg";

const fileTypes = ["JPEG", "PNG", "GIF"];

export default function FileUpload({
  files,
  setFiles,
}: {
  files: File[];
  setFiles: (files: File[]) => void;
}) {
  const handleChange = (fileList) => {
    const tempData = [...files];
    if (tempData.length >= 5) return;
    for (let i = 0; i < fileList.length; i++) {
      tempData.push(fileList[i]);
    }
    setFiles(tempData);
  };

  const handleDelete = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  return (
    <Box>
      <FileUploader
        multiple={true}
        handleChange={handleChange}
        types={fileTypes}
      >
        <Stack
          justifyContent={"center"}
          alignItems={"center"}
          sx={{ border: "dashed 1px #B1B5C3", cursor: "pointer", height: 147 }}
          flexDirection={"row"}
        >
          <Stack justifyContent={"center"} alignItems={"center"} gap={"10px"}>
            <IconUpload />
            <Typography
              sx={{ fontSize: "15px", fontWeight: "400", color: "#999999" }}
            >
              Drag file attach or
              <span
                style={{ fontWeight: 600, fontSize: "15px", color: "#0575E6" }}
              >
                browse
              </span>
            </Typography>
          </Stack>
        </Stack>
      </FileUploader>
      {files.length > 0 && (
        <Stack
          justifyContent={"flex-start"}
          alignItems={"center"}
          gap={"35px"}
          flexDirection={"row"}
          marginTop={"25px"}
          flexWrap={"wrap"}
        >
          {files.map((file, index: number) => (
            <Stack
              justifyContent={"flex-start"}
              alignItems={"center"}
              gap={"15px"}
              key={index}
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
                position: "relative",
              }}
            >
              <button
                className="delete_icon"
                style={{
                  display: "none",
                  position: "absolute",
                  top: "-12px",
                  right: "-12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => handleDelete(index)}
              >
                <DeleteIcon />
              </button>
              <Image
                src={URL.createObjectURL(file)}
                alt={`Uploaded ${file?.name}`}
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
                  }}
                >
                  {file?.name}
                </Typography>
                <Typography sx={{ fontSize: "13px", fontWeight: "700" }}>
                  {moment(file?.lastModified).format("DD MMM YYYY, HH:mm")}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
}
