/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography } from "@mui/material";
import { NewPageContext } from "components/sn-docs/news/context/NewPageContext";
import { DocPositionComment } from "components/sn-docs/news/types/doc.type";
import Image from "next/image";
import React, { useContext } from "react";

interface IProps {
  avatarUrl: string;
  children: any;
  positionComments: DocPositionComment[];
  blockKey: string;
}

export default function CommentSpan(props: IProps) {
  const { setCommentDialogOpen, shetShowExistComment } =
    useContext(NewPageContext);
  const { avatarUrl, children, positionComments, blockKey } = props;
  const onClick = () => {
    const positionKey = `${children[0].props.start}-${
      children[children.length - 1].props.start + 1
    }-${blockKey}`;
    const positionComment = positionComments.find(
      (item) => item.position === positionKey,
    );
    shetShowExistComment(positionComment);
    setCommentDialogOpen(true);
  };

  return (
    <span
      style={{
        backgroundColor: "#E3F2FD",
        position: "relative",
        pointerEvents: "none",
        display: "inline-block",
      }}
    >
      <span
        data-text={true}
        style={{
          backgroundColor: "transparent",
          position: "relative",
          zIndex: 1,
          pointerEvents: "auto",
        }}
      >
        {children}
      </span>
      <Image
        onClick={onClick}
        src={avatarUrl}
        alt="avatar"
        width={28}
        height={28}
        style={{
          position: "absolute",
          top: "-22px",
          right: "-30px",
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          cursor: "pointer",
          pointerEvents: "auto",
        }}
      />
    </span>
  );
}
