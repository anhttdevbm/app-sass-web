import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertFromRaw,
  DraftStyleMap,
  ContentBlock,
  DraftHandleValue,
  Modifier,
  DraftBlockType,
  convertToRaw,
} from "draft-js";
import "./DraftEditor.css";
import "./CheckableListItem.css";
import ToolBarDraftEditor from "../ToolBarDraftEditor";
import { Box, Button } from "@mui/material";
import { useAppSelector } from "store/hooks";
import { uuid } from "utils/index";
import { useUpdateDocMutation } from "store/docs/api";
import useDebounce from "hooks/useDebounce";
import { useDocs } from "store/docs/selectors";
import AddSessionTool from "../AddSessionTool/components";
import {
  CHECKABLE_LIST_ITEM,
  ORDERED_LIST_ITEM,
  UNORDERED_LIST_ITEM,
} from "../../constants/draft.constants";
import {
  CheckableListItemBlock,
  onTab,
  toggleChecked,
} from "./CheckableListItemUltils";
import CheckableListItem from "./CheckableListItem";

export default function DraftEditor() {
  const { handleUpdateDoc } = useDocs();
  const currentId = useAppSelector((state) => state.doc.id);

  const [updateDoc] = useUpdateDocMutation();
  const page = useAppSelector((state) => state.doc);
  const { perm, content, id, title: name, description, project_id } = page;
  const [mounted, setMounted] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState(name);

  const [debounceChange, isDone, cancel] = useDebounce(
    ({ nameDoc, content }: { nameDoc: string; content?: string }) => {
      updateDoc({
        id: id as string,
        payload: { name: nameDoc, content: content },
      });
    },
    200,
  );

  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty(),
  );

  const editor = useRef<Editor | null>(null);

  const [showAddSession, setShowAddSession] = useState(false);

  // xử lý event open Add Session
  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.altKey && e.key === "d") {
      e.preventDefault();
      setShowAddSession((prev) => !prev);
    }
  };

  const handleChangeEditor = (editorState: EditorState) => {
    const contentState = editorState.getCurrentContent();
    const blocksArray = contentState.getBlocksAsArray();

    if (blocksArray.length > 0) {
      const firstBlock = blocksArray[0];
      const firstBlockText = firstBlock.getText();

      // lấy properties các block khác trừ first block
      const remainingBlocks = blocksArray.slice(1).map((block) => ({
        key: block.getKey(),
        text: block.getText(),
        type: block.getType(),
        depth: block.getDepth(),
        inlineStyleRanges: block.getCharacterList().map((char, index) => ({
          offset: index,
          style: char?.getStyle(),
        })),
        entityRanges: block.findEntityRanges(
          (character) => character.getEntity() !== null,
          (start, end) => ({ start, end, entity: block.getEntityAt(start) }),
        ),
        data: block.getData(),
      }));

      debounceChange({
        nameDoc: firstBlockText,
        content: JSON.stringify(remainingBlocks),
      });
    }

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

  const blockRendererFn = (block: ContentBlock) => {
    if (block.getType() === CHECKABLE_LIST_ITEM) {
      return {
        component: CheckableListItem,
        props: {
          onChangeChecked: () => setEditorState(toggleChecked(editorState, block)),
          checked: !!block.getData().get("checked"),
        },
      };
    }
    return null;
  };

  useEffect(() => {
    focusEditor();
  }, []);

  useEffect(() => {
    setTextAreaValue(name);
    // dispatch(getDocDetails(currentId));
  }, [name, currentId]);

  useEffect(() => {
    const data = {
      //   content: content,
      name: name || undefined,
      //   description: description,
      //   project_id: project_id,
    };
    if (mounted) {
      if (id) {
        handleUpdateDoc(data, id);
        // setTextAreaValue(name);
      } else {
      }
    } else {
      setMounted(true);
    }
  }, [description, name, project_id, currentId]);

  // set giá trị cho doc khi mounted
  useEffect(() => {
    const contentArr = content ? JSON.parse(content) : [];

    if (textAreaValue) {
      const blocks = [
        {
          key: uuid(),
          text: textAreaValue,
          type: "header-one",
          depth: 0,
          inlineStyleRanges: [
            { offset: 19, length: 6, style: "BOLD" },
            { offset: 25, length: 5, style: "ITALIC" },
            { offset: 30, length: 8, style: "UNDERLINE" },
          ],
          entityRanges: [],
          data: {},
        },
        ...(contentArr.length > 0 ? contentArr : []),
      ];

      setEditorState(
        EditorState.createWithContent(
          convertFromRaw({
            blocks,
            entityMap: {},
          }),
        ),
      );
    }
  }, [content, textAreaValue]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
          blockRendererFn={blockRendererFn}
        />
        {showAddSession && (
          <AddSessionTool
            editor={editor}
            editorState={editorState}
            setEditorState={setEditorState}
            focusEditor={focusEditor}
          />
        )}
      </div>
    </Box>
  );
}
