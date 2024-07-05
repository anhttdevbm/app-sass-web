"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import "./styles.css";
import { Editor, EditorContent } from "@tiptap/react";
import CustomBubbleMenu from "./menu/bubble-menu";
import { useRef } from "react";

export const Tiptap = ({
  editor,
  disabled,
}: {
  editor: Editor;
  disabled: boolean;
}) => {
  return (
    editor && (
      <>
        <CustomBubbleMenu editor={editor} />
        <EditorContent editor={editor} disabled={disabled} />
      </>
    )
  );
};
