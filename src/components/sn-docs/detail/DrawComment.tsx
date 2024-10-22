/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, IconButton, Stack } from "@mui/material";
import Avatar from "components/Avatar";
import { Text } from "components/shared";
import { NS_DOCS } from "constant/index";
import CloseIcon from "icons/CloseIcon";
import { useTranslations } from "next-intl";
import React, { useContext } from "react";
import { NewPageContext } from "../news/context/NewPageContext";

import { inter } from "components/sn-time-tracking/CalendarTracking/CalendarTracking.styles";
import { IComment } from "constant/types";
import dayjs from "dayjs";
import useTheme from "hooks/useTheme";
import { useParams } from "next/navigation";
import { useGetCommentsQuery } from "store/docs/api";
export const LayoutSlider = ({
  children,
  heightToolbar,
  heightContent,
  height,
}: {
  children: React.ReactNode;
  heightToolbar?: any;
  heightContent?: any;
  height?: any;
}) => {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "grey.100",
        zIndex: "30",
        position: "absolute",
        right: 0,
        top: 0,
        padding: "16px 12px",
        maxWidth: "280px",
        width: "100%",
        bgcolor: "background.paper",
        height: {
          sm: height,
          xs: "100%",
        },
        overflow: "auto",
      }}
    >
      {children}
    </Box>
  );
};

export const CommentItem: React.FC<IComment> = (props) => {
  const { activeCommentId, setActiveCommentId } = useContext(NewPageContext);
  const { isDarkMode } = useTheme();
  const isActiveComment = activeCommentId === props.position?.position;
  const activeBgColor = isDarkMode ? "grey.50" : "primary.light";
  return (
    <Box
      // onClick={() => {
      //   if (activeCommentId === props.position?.position) {
      //     props.editor?.commands.setComment(props.position?.position);
      //   } else {
      //     props.editor?.commands.focus();
      //     props.editor?.commands.unsetComment(props.position?.position);
      //   }
      //   setActiveCommentId(props.position?.position);
      // }}
      sx={{
        cursor: "pointer",
        display: "flex",
        alignItems: "start",
        gap: "8px",
        padding: "4px",
        borderRadius: "4px",
        bgcolor: isActiveComment ? activeBgColor : "inherit",
        color: "ButtonText",
      }}
    >
      <Avatar src={props?.created_by?.avatar} size={32} />

      <Box
        sx={{
          flex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            sx={{
              fontSize: "14px",
              fontWeight: "600",
              fontFamily: inter.style.fontFamily,
            }}
          >
            {props?.created_by?.fullname}
          </Text>
          <Text
            sx={{
              fontSize: "12px",
              fontWeight: "300",
              fontFamily: inter.style.fontFamily,
            }}
          >
            {dayjs(props?.created_time).format("h:mm A")}
          </Text>
        </Box>
        <Text
          sx={{
            fontSize: "12px",
            fontWeight: "400",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
          }}
        >
          {props.content}
        </Text>
      </Box>
    </Box>
  );
};

const DrawComment = ({ editor }) => {
  const docsT = useTranslations(NS_DOCS);
  const { id } = useParams();
  const { data } = useGetCommentsQuery({ docId: id });
  const { openComment, setOpenComment, comments, activeCommentId } =
    useContext(NewPageContext);
  console.log(data);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          justifyItems: "center",
          alignItems: "center",
          bgcolor: "background.paper",
        }}
      >
        <Text>
          {docsT("createDoc.comment")} ({data?.length})
        </Text>
        <IconButton
          sx={{ width: 32, height: 32, aspectRatio: 1, borderRadius: "9999px" }}
          onClick={() => setOpenComment(!openComment)}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
      <Stack
        spacing={"16px"}
        bgcolor="background.paper"
        zIndex={999}
        sx={{
          marginTop: "16px",
        }}
      >
        {"Comments"}
        {Array.isArray(data) &&
          data?.map((cmt: IComment) => (
            <CommentItem key={cmt._id} {...cmt} editor={editor} />
          ))}
      </Stack>
    </>
  );
};

export default DrawComment;
