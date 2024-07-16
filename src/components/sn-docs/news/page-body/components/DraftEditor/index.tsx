import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  DraftStyleMap,
  ContentBlock,
  ContentState,
} from "draft-js";
import "./DraftEditor.css";
import ToolBarDraftEditor from "../ToolBarDraftEditor";
import { Box } from "@mui/material";
import { useAppSelector } from "store/hooks";
import { uuid } from "utils/index";
import { useDispatch } from "react-redux";
import { useGetDocDetailQuery, useUpdateDocMutation } from "store/docs/api";
import useDebounce from "hooks/useDebounce";
import { IDocs } from "store/docs/reducer";

export default function DraftEditor() {
  const dispatch = useDispatch();
  const [updateDoc] = useUpdateDocMutation();
  const page = useAppSelector((state) => state.doc);
  const { perm, content, id, title: name, description, project_id } = page;
  const currentId = useAppSelector((state) => state.doc.id);

  const [debounceChange, isDone, cancel] = useDebounce((value: string) => {
    updateDoc({ id: currentId as string, payload: { name: value } });
  }, 200);


  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createWithContent(
      convertFromRaw({
        blocks: [
          {
            key: uuid(),
            text: name ?? "",
            type: "header-one",
            depth: 0,
            inlineStyleRanges: [
              {
                offset: 19,
                length: 6,
                style: "BOLD",
              },
              {
                offset: 25,
                length: 5,
                style: "ITALIC",
              },
              {
                offset: 30,
                length: 8,
                style: "UNDERLINE",
              },
            ],
            entityRanges: [],
            data: {},
          },
        ],
        entityMap: {},
      }),
    ),
  );

  const editor = useRef<Editor | null>(null);

  const handleChangeEditor = (editorState: EditorState) => {
    const contentState = editorState.getCurrentContent();
    const blocksArray = contentState.getBlocksAsArray();
    if (blocksArray.length > 0) {
      const firstBlock = blocksArray[0];
      const firstBlockText = firstBlock.getText();

      debounceChange(firstBlockText);
    }

    // debounceChange(contentState.getBlocksAsArray())
    setEditorState(editorState);
  };

  const focusEditor = () => {
    if (editor.current) {
      editor.current.focus();
    }
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  // FOR INLINE STYLES
  const styleMap: DraftStyleMap = {
    CODE: {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 14,
      padding: 2,
    },
    HIGHLIGHT: {
      backgroundColor: "#F7A5F7",
    },
    UPPERCASE: {
      textTransform: "uppercase",
    },
    LOWERCASE: {
      textTransform: "lowercase",
    },
    CODEBLOCK: {
      fontFamily: '"fira-code", "monospace"',
      fontSize: "inherit",
      background: "#ffeff0",
      fontStyle: "italic",
      lineHeight: 1.5,
      padding: "0.3rem 0.5rem",
      borderRadius: " 0.2rem",
    },
    SUPERSCRIPT: {
      verticalAlign: "super",
      fontSize: "80%",
    },
    SUBSCRIPT: {
      verticalAlign: "sub",
      fontSize: "80%",
    },
  };

  // FOR BLOCK LEVEL STYLES(Returns CSS Class From DraftEditor.css)
  const myBlockStyleFn = (contentBlock: ContentBlock): string => {
    const blockData = contentBlock.getData();
    const alignment = blockData.get("textAlign");
    if (alignment) {
      return `text-align-${alignment}`;
    }
    return "";
  };

  useEffect(() => {
    focusEditor();
  }, []);

  // useLayoutEffect(() => {
  //   console.log('name', name)
  // },[])

  return (
    <Box
      sx={{ width: "100%", height: "100%", bgcolor: "inherit" }}
      onClick={focusEditor}
    >
      <ToolBarDraftEditor
        editorState={editorState}
        setEditorState={setEditorState}
      />
      <div className="editor-container">
        <Editor
          ref={editor}
          handleKeyCommand={handleKeyCommand}
          editorState={editorState}
          customStyleMap={styleMap}
          blockStyleFn={myBlockStyleFn}
          onChange={handleChangeEditor}
        />
      </div>
    </Box>
  );
}
