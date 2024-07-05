"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState } from "react";

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
  setActiveCommentId: function () {},
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
  const [pageSettings, setPageSettings] = useState({
    font: "san-serif",
    smallText: false,
    fullWidth: true,
    lock: false,
  });
  const [openComment, setOpenComment] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [isAddingNewLink, setIsAddingNewLink] = useState(false);
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
      }}
    >
      {children}
    </NewPageContext.Provider>
  );
};
