/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable-next-line react-hooks/exhaustive-deps */

import { EditorContent } from "@tiptap/react";
import { debounce } from "lodash";
import { useContext, useEffect, useState } from "react";
import { NewPageContext } from "../context/NewPageContext";
import useDocEditor from "../hook/useDocEditor";
import CustomBubbleMenu from "./menu/bubble-menu";
import "./styles.css";

export const NewPageTiptap = () => {
  const { content, setContent, pageSettings } = useContext(NewPageContext);
  const [pageContent, setPageContent] = useState<any>(null);

  const handleContentUpdate = (content: any) => {
    setPageContent(content);
  };
  useEffect(() => {
    const savePageContent = debounce((pageContent) => {
      setContent(pageContent);
    }, 2000);

    savePageContent(pageContent);

    return () => {
      savePageContent.cancel();
    };
  }, [handleContentUpdate]);

  const editor = useDocEditor();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      editor?.setEditable(!pageSettings?.lock!);
      editor?.commands.setContent(content);
      setPageContent(content);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    editor && (
      <>
        <CustomBubbleMenu editor={editor} />
        <EditorContent editor={editor} />
      </>
    )
  );
};
