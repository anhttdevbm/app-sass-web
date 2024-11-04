/* eslint-disable @typescript-eslint/no-empty-function */
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState } from "react";
import { DocPositionComment } from "../types/doc.type";

export const NewPageContext = createContext<any>({
  coverPicture: {
    url: "",
    verticalPosition: 0,
  },
  content: {
    type: "doc",
    content: [
      {
        type: "dBlock",
        content: [
          {
            type: "paragraph",
          },
        ],
      },
      {
        type: "dBlock",
        content: [
          {
            type: "paragraph",
          },
        ],
      },
    ],
  },
  pageSettings: {
    font: "san-serif",
    smallText: false,
    fullWidth: true,
    lock: false,
  },
  activeCommentId: null,
  setActiveCommentId: () => {},
  openCommentDialog: false,
  setCommentDialogOpen: function () {},
});

export const NewPageContextProvider: React.FC<{ children: any }> = ({
  children,
}) => {
  const [coverPicture, setCoverPicture] = useState({
    url: "",
    verticalPosition: 0,
  });
  const [comments, setComments] = useState([]);
  const [commentPosition, setCommentPosition] = useState("");
  const [content, setContent] = useState({
    type: "doc",
    content: [
      {
        type: "dBlock",
        content: [
          {
            type: "paragraph",
          },
        ],
      },
    ],
  });
  const [openCommentDialog, setCommentDialogOpen] = useState<boolean>(false);

  const [showExistComment, shetShowExistComment] = useState<
    DocPositionComment | undefined
  >(undefined);
  const [pageSettings, setPageSettings] = useState({
    font: "san-serif",
    smallText: false,
    fullWidth: true,
    lock: false,
  });
  const [openComment, setOpenComment] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [isAddingNewLink, setIsAddingNewLink] = useState(false);

  const handleCloseCommentDialog = () => {
    setCommentDialogOpen(false);
    shetShowExistComment(undefined);
  };
  return (
    <NewPageContext.Provider
      value={{
        coverPicture,
        setCoverPicture,
        content,
        setContent,
        pageSettings,
        setPageSettings,

        activeCommentId,
        setActiveCommentId,
        openCommentDialog,
        setCommentDialogOpen,
        comments,
        setComments,
        isAddingNewLink,
        setIsAddingNewLink,
        openComment,
        setOpenComment,
        commentPosition,
        setCommentPosition,
        showExistComment,
        shetShowExistComment,
        handleCloseCommentDialog,
      }}
    >
      {children}
    </NewPageContext.Provider>
  );
};
