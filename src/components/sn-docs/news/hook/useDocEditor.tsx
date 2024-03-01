import { useEditor } from "@tiptap/react";
import { NewPageContext } from "../context/NewPageContext";
import { getExtensions } from "../tiptap/extensions/starter-kit";
import useDebounce from "hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { changeContentDoc } from "store/docs/reducer";
import { useContext, useEffect, useRef, useState } from "react";

export default function useDocEditor() {
  const { setContent, setIsAddingNewLink, setActiveCommentId, setOpenComment } =
    useContext(NewPageContext);

  const { content } = useAppSelector((state) => state.doc);

  const doc = useAppSelector((state) => state.doc);
  const dispatch = useAppDispatch();
  const [handleContentUpdate] = useDebounce((content: any) => {
    dispatch(changeContentDoc(content));
  }, 1000);

  const anchorRef = useRef(0);
  const editor = useEditor({
    content: content, // emitUpdate: true,
    extensions: getExtensions({
      openLinkModal: () => setIsAddingNewLink(true),
      onCommentActivated: (commentId: string) => {
        if (commentId) {
          setActiveCommentId(commentId);
          setOpenComment(true);
        }
      },
    }),

    editorProps: {
      attributes: {
        class: `main-editor`,
        spellCheck: "false",
        suppressContentEditableWarning: "true",
      },
    },
    onUpdate: async ({ editor, transaction }) => {
      setContent(editor.getJSON());
      anchorRef.current = transaction.selection.anchor;
      // await handleContentUpdate(editor.getHTML());
    },
    onBlur: async ({ editor, transaction }) => {
      await handleContentUpdate(editor.getHTML());
    },
  });

  useEffect(() => {
    let from = editor?.view.state.selection.from;
    let to = editor?.view.state.selection.to;
    editor?.commands?.setContent(content);
    // Set selection editor
    // alert(from + " -> " + to);
  }, [content]);

  return editor;
}
