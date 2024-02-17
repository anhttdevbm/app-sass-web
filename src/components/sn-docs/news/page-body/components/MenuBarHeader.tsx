"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import DownIcon from "../../asset/icons/DownIcon";
import IconBold from "../../asset/iconsMenuTipTap/IconBold";
import IconCode from "../../asset/iconsMenuTipTap/IconCode";
import IconComment from "../../asset/iconsMenuTipTap/IconComment";
import IconItaic from "../../asset/iconsMenuTipTap/IconItaic";
import IconLi from "../../asset/iconsMenuTipTap/IconLi";
import IconLi2 from "../../asset/iconsMenuTipTap/IconLi2";
import IconLineText from "../../asset/iconsMenuTipTap/IconLineText";
import IconLineTextCenter from "../../asset/iconsMenuTipTap/IconLineTextCenter";
import IconLink from "../../asset/iconsMenuTipTap/IconLink";
import styles from "components/sn-docs/news/tiptap/menu/bubble-menu/nodeTypeDropDown.module.scss";
import Tippy from "@tippyjs/react";
import toggleButtonStyles from "components/sn-docs/news/tiptap/menu/bubble-menu/nodeTypeToggle.module.scss";
import { Box, Divider, IconButton } from "@mui/material";
import { Editor } from "@tiptap/core";
import { ThemeContext } from "../../context/ThemeContext";

import React, {
  Fragment,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Text } from "components/shared";
import useTheme from "hooks/useTheme";
import { NewPageContext } from "../../context/NewPageContext";
import { Comment } from "./CommentDialog";
import { useAuth } from "store/app/selectors";
import { DocAccessibility } from "constant/enums";
import { useAppSelector } from "store/hooks";
import TextIcon from "icons/TextIcon";
import Hg1Icon from "../../tiptap/menu/slash-menu/asset/icons/Hg1Icon";
import H2Icon from "../../tiptap/menu/slash-menu/asset/icons/H2Icon";
import H3Icon from "../../tiptap/menu/slash-menu/asset/icons/H3Icon";
import { TextColorDropdown } from "../../tiptap/menu/bubble-menu/TextColorDropdown";

type TTextStyleOptions = {
  [key: string]: {
    icon: JSX.Element;
    label: string;
    onClick: () => void;
    isBreakBelow?: boolean;
  };
};

const MenuBarHeader = ({ editor }: { editor: Editor }) => {
  const { theme } = useContext(ThemeContext);
  const { isDarkMode } = useTheme();

  const isOnlyParagraph =
    !editor.isActive("bulletList") &&
    !editor.isActive("orderedList") &&
    !editor.isActive("heading");
  const h1 = editor.isActive("heading", { level: 1 });
  const h2 = editor.isActive("heading", { level: 2 });
  const h3 = editor.isActive("heading", { level: 3 });

  const text = useMemo(() => {
    if (isOnlyParagraph) {
      return "Normal";
    }
    if (h1) {
      return "Heading 1";
    }
    if (h2) {
      return "Heading 2";
    }
    if (h3) {
      return "Heading 3";
    }
  }, [isOnlyParagraph, h1, h2, h3]);

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) {
      return;
    }
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <Box
      sx={{
        position: {
          sm: "sticky",
          xs: "fixed",
        },
        top: {
          sm: "16px",
          xs: "unset",
        },
        bottom: {
          sm: "unset",
          xs: "16px",
        },
        left: {
          sm: "unset",
          xs: "16px",
        },
        right: {
          sm: "unset",
          xs: "16px",
        },
        flexWrap: "wrap",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        bgcolor: "background.paper",
        zIndex: "10",
        rowGap: {
          sm: "16px",
          xs: "6px",
        },
        columnGap: {
          sm: "6px",
          xs: "2px",
        },
        py: "3px",
        px: {
          sm: "16px",
          xs: "8px",
        },
        boxShadow: "2px 2px 24px 0px rgba(0, 0, 0, 0.10)",
        borderRadius: "4px",
        button: {
          bgcolor: "transparent",
          outline: "none",
          border: "none",
          cursor: "pointer",
          p: "4px",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },

        "button.active": {
          bgcolor: isDarkMode ? "#1E1E1E" : "#E1F0FF",
        },
      }}
    >
      <Tippy
        appendTo={document.body}
        trigger="click"
        interactive
        animation="shift-toward-subtle"
        placement="bottom-start"
        content={
          <div className={`${styles.bubble_menu}  ${styles[theme]}`}>
            <div
              className={`${styles.bubble_dropdown_item}`}
              onClick={() => editor.chain().focus().setParagraph().run()}
            >
              <div className={`${styles.bubble_dropdown_button}`}>
                <div className={`${styles.info}`}>
                  <span className={`${styles.bubble_dropdown_button_label}`}>
                    Normal
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`${styles.bubble_dropdown_item}`}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              <div className={`${styles.bubble_dropdown_button}`}>
                <div className={`${styles.info}`}>
                  <span className={`${styles.bubble_dropdown_button_label}`}>
                    Heading 1
                  </span>
                </div>
              </div>
            </div>
            <div
              className={`${styles.bubble_dropdown_item}`}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              <div className={`${styles.bubble_dropdown_button}`}>
                <div className={`${styles.info}`}>
                  <span className={`${styles.bubble_dropdown_button_label}`}>
                    Heading 2
                  </span>
                </div>
              </div>
            </div>
            <div
              className={`${styles.bubble_dropdown_item}`}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
            >
              <div className={`${styles.bubble_dropdown_button}`}>
                <div className={`${styles.info}`}>
                  <span className={`${styles.bubble_dropdown_button_label}`}>
                    Heading 3
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <div
          className={`${toggleButtonStyles.bubble_toggle_dropdown} ${toggleButtonStyles[theme]}`}
        >
          <Text>{text}</Text>
          <div className={`${toggleButtonStyles.icon}`}>
            <DownIcon />
          </div>
        </div>
      </Tippy>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "active" : ""}
      >
        <IconBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "active" : ""}
      >
        <IconItaic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "active" : ""}
      >
        <IconLineText />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "active" : ""}
      >
        <IconLineTextCenter />
      </button>
      <button
        value="link"
        aria-label="link"
        onClick={() =>
          editor.isActive("link")
            ? editor.chain().focus().unsetLink().run()
            : setLink()
        }
        className={editor.isActive("link") ? "active" : ""}
      >
        <IconLink></IconLink>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "active" : ""}
      >
        <IconLi></IconLi>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "active" : ""}
      >
        <IconLi2 />
      </button>
      <button>
        <IconComment />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive("code") ? "active" : ""}
      >
        <IconCode />
      </button>
    </Box>
  );
};

export const MenuBarHeaderEdit = ({ editor }: { editor: Editor }) => {
  const { theme } = useContext(ThemeContext);
  const {
    setActiveCommentId,
    comments,
    setComments,
    openCommentDialog,
    setCommentDialogOpen,
  } = useContext(NewPageContext);
  const { user } = useAuth();
  const perm = useAppSelector(
    (state) => state.doc.perm,
  ) as keyof typeof DocAccessibility;
  const { isDarkMode } = useTheme();

  const TextStyleOptions: TTextStyleOptions = {
    normal: {
      icon: <TextIcon active={true} />,
      label: "Normal",
      onClick: () => editor.chain().focus().setParagraph().run(),
    },
    heading1: {
      icon: <Hg1Icon />,
      label: "Heading 1",
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    heading2: {
      icon: <H2Icon />,
      label: "Heading 2",
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    heading3: {
      icon: <H3Icon />,
      label: "Heading 3",
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isBreakBelow: true,
    },
    bulletList: {
      icon: <IconLi />,
      label: "Bullet List",
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    orderedList: {
      icon: <IconLi2 />,
      label: "Ordered List",
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
    taskList: {
      icon: <IconLi2 />,
      label: "Task List",
      onClick: () => editor.chain().focus().toggleTaskList().run(),
    },
    quote: {
      icon: <IconComment />,
      label: "Quote",
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
    },
    code: {
      icon: <IconCode />,
      label: "Code",
      onClick: () => editor.chain().focus().toggleCode().run(),
    },
  };

  const TextAlignOptions: TTextStyleOptions = {};

  const isOnlyParagraph =
    !editor.isActive("bulletList") &&
    !editor.isActive("orderedList") &&
    !editor.isActive("heading") &&
    !editor.isActive("taskList") &&
    !editor.isActive("blockquote") &&
    !editor.isActive("code");
  const h1 = editor.isActive("heading", { level: 1 });
  const h2 = editor.isActive("heading", { level: 2 });
  const h3 = editor.isActive("heading", { level: 3 });
  const bulletList = editor.isActive("bulletList");
  const orderedList = editor.isActive("orderedList");
  const taskList = editor.isActive("taskList");
  const quote = editor.isActive("blockquote");
  const code = editor.isActive("code");

  const currentTextStyle = useMemo(() => {
    if (isOnlyParagraph) {
      return TextStyleOptions["normal"];
    }
    if (h1) {
      return TextStyleOptions["heading1"];
    }
    if (h2) {
      return TextStyleOptions["heading2"];
    }
    if (h3) {
      return TextStyleOptions["heading3"];
    }
    if (bulletList) {
      return TextStyleOptions["bulletList"];
    }
    if (orderedList) {
      return TextStyleOptions["orderedList"];
    }
    if (taskList) {
      return TextStyleOptions["taskList"];
    }
    if (quote) {
      return TextStyleOptions["quote"];
    }
    if (code) {
      return TextStyleOptions["code"];
    }
  }, [
    isOnlyParagraph,
    h1,
    h2,
    h3,
    bulletList,
    orderedList,
    taskList,
    quote,
    code,
  ]);

  const text = "TEST";
  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) {
      return;
    }
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const setComment = () => {
    const newComment = new Comment("");
    setComments([...comments, newComment]);
    // editor?.commands.setComment(newComment.position);
    // setActiveCommentId(newComment.position);
  };

  const canComment = useMemo(
    () =>
      Object.keys(DocAccessibility)
        .filter((key) => key !== "VIEW")
        .includes(perm),
    [perm],
  );
  const canEdit = useMemo(
    () =>
      Object.keys(DocAccessibility)
        .filter((key) => key !== "COMMENT" && key !== "VIEW")
        .includes(perm),
    [perm],
  );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        backgroundColor: "background.default",
        zIndex: "10",
        gap: {
          sm: "16px",
          xs: "8px",
        },
        py: "3px",
        px: {
          sm: "16px",
          xs: "8px",
        },
        boxShadow: "2px 2px 24px 0px rgba(0, 0, 0, 0.10)",
        borderRadius: "4px",
        button: {
          bgcolor: "transparent",
          outline: "none",
          border: "none",
          cursor: "pointer",
          p: "4px",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },

        "button.active": {
          bgcolor: isDarkMode ? "#1E1E1E" : "white",
        },
      }}
    >
      <Tippy
        disabled={!canEdit}
        appendTo={document.body}
        trigger="click"
        interactive
        animation="shift-toward-subtle"
        placement="bottom-start"
        content={
          <div className={`${styles.bubble_menu}  ${styles[theme]}`}>
            {Object.entries(TextStyleOptions).map(([key, value]) => (
              <>
                <div
                  key={key}
                  className={`${styles.bubble_dropdown_item}`}
                  onClick={value.onClick}
                >
                  <div className={`${styles.bubble_dropdown_button}`}>
                    <div className={`${styles.info}`}>
                      {value.icon}
                      <span
                        className={`${styles.bubble_dropdown_button_label}`}
                      >
                        {value.label}
                      </span>
                    </div>
                  </div>
                </div>
                {value.isBreakBelow && <Divider />}
              </>
            ))}
          </div>
        }
      >
        <div
          className={`${toggleButtonStyles.bubble_toggle_dropdown} ${toggleButtonStyles[theme]}`}
        >
          {currentTextStyle && (
            <div className={`${styles.bubble_dropdown_button}`}>
              <div className={`${styles.info}`}>
                {currentTextStyle.icon}
                <span className={`${styles.bubble_dropdown_button_label}`}>
                  {currentTextStyle.label}
                </span>
              </div>
            </div>
          )}

          <div className={`${toggleButtonStyles.icon}`}>
            <DownIcon />
          </div>
        </div>
      </Tippy>
      <button
        disabled={!canEdit}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "active" : ""}
      >
        <IconBold />
      </button>
      <button
        disabled={!canEdit}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "active" : ""}
      >
        <IconItaic />
      </button>
      <button
        disabled={!canEdit}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "active" : ""}
      >
        <IconLineText />
      </button>
      <button
        disabled={!canEdit}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "active" : ""}
      >
        <IconLineTextCenter />
      </button>
      {/* TEXT ALIGN */}
      <button
        disabled={!canEdit}
        value="link"
        aria-label="link"
        onClick={() =>
          editor.isActive("link")
            ? editor.chain().focus().unsetLink().run()
            : setLink()
        }
        className={editor.isActive("link") ? "active" : ""}
      >
        <IconLink />
      </button>
      <button
        disabled={!canEdit}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "active" : ""}
      >
        <IconLi />
      </button>
      <button
        disabled={!canEdit}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "active" : ""}
      >
        <IconLi2 />
      </button>

      <TextColorDropdown editor={editor} />

      <button
        disabled={!canComment}
        onClick={() => {
          setCommentDialogOpen(!openCommentDialog);
          setComment();
        }}
      >
        <IconComment />
      </button>
    </Box>
  );
};

export default MenuBarHeader;
