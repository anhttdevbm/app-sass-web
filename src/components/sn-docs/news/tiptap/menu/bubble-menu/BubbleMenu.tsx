"use client";
/* eslint-disable react/display-name */
import { BubbleMenu } from "@tiptap/react";
import { generalButtons } from "./buttons";
import styles from "./bubbleMenu.module.scss";
import React, { useContext, useMemo } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { MenuBarHeaderEdit } from "components/sn-docs/news/page-body/components/MenuBarHeader";
import { useAppSelector } from "store/hooks";

export const CustomBubbleMenu = ({ editor }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <BubbleMenu
      editor={editor}
      className={`${styles.bubble_menu} ${styles[theme]}`}
      tippyOptions={{
        duration: 200,
        animation: "shift-toward-subtle",
        moveTransition: "transform 0.2s ease-in-out",
      }}
    >
      <MenuBarHeaderEdit editor={editor} />
    </BubbleMenu>
  );
};
