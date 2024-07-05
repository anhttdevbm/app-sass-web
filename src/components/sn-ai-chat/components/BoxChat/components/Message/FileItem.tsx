import React from 'react';
import { File } from 'store/aiChat/type';
import { Stack } from "@mui/material";
import { Text } from "components/shared";
import Image from "next/image";

export interface FileItemProps {
  file: File;
}

export const FileItem: React.FC<FileItemProps> = ({ file }) => {
  const icons = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "doc",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xls",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "ppt",
    "application/vnd.ms-powerpoint": "ppt",
  };

  return (
    <Stack direction="column" spacing={"2px"} alignItems="center" width={80}>
      {file.type.includes("image") ? (
        <Image
          src={file.link as string}
          alt={file.name}
          width={60}
          height={100}
          style={{ borderRadius: '4px', objectFit: 'cover' }}
        />
      ) : (
        <Image src={`/images/${icons[file.type] || 'defaultFile'}.svg`} alt={file.name} width={40} height={60} />
      )}
      <Text
        variant={"caption"}
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "100%",
        }}
      >
        {file.name}
      </Text>
    </Stack>
  )
}