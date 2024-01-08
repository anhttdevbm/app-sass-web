import { useEditor } from "@tiptap/react";
import { NewPageContext } from "../context/NewPageContext";
import { getExtensions } from "../tiptap/extensions/starter-kit";
import useDebounce from "hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { changeContentDoc } from "store/docs/reducer";
import { useContext, useEffect, useRef } from "react";

export default function useDocEditor() {
  const {
    content,
    setContent,
    setIsAddingNewLink,
    setActiveCommentId,
    setOpenComment,
  } = useContext(NewPageContext);

  const doc = useAppSelector((state) => state.doc);
  const dispatch = useAppDispatch();
  const [handleContentUpdate] = useDebounce((content: any) => {
    dispatch(changeContentDoc(content));
  }, 1000);

  const anchorRef = useRef(0);
  const editor = useEditor({
    content: doc?.contentRow,
   // emitUpdate: true,
    extensions: getExtensions({
      openLinkModal: () => setIsAddingNewLink(true),
      onCommentActivated: (commentId: string) => {
        if (commentId) {
          console.log(commentId);
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
      await handleContentUpdate(editor.getHTML());
    },
  });

  useEffect(() => {
    editor?.commands?.setContent(doc?.contentRow)
  }, [doc?.contentRow])

  return editor;
}
