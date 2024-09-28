import EditorPlugins from "@draft-js-plugins/editor";
import createEmojiPlugin from "@draft-js-plugins/emoji";
import AddReactionOutlinedIcon from "@mui/icons-material/AddReactionOutlined";
import { Box, Typography } from "@mui/material";
import {
  ContentBlock,
  convertFromRaw,
  DraftStyleMap,
  EditorState,
  RichUtils,
} from "draft-js";
import useDebounce from "hooks/useDebounce";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUpdateDocMutation } from "store/docs/api";
import { useDocs } from "store/docs/selectors";
import { useAppSelector } from "store/hooks";
import { uuid } from "utils/index";
import { CHECKABLE_LIST_ITEM } from "../../constants/draft.constants";
import AddImageButton from "../AddImageButton";
import AddSessionTool from "../AddSessionTool/components";
import BoardEditor from "../BoardEditor";
import ReactFlowMindMap from "../ReactFlowMindMap";
import ToolBarDraftEditor from "../ToolBarDraftEditor";
import CheckableListItem from "./CheckableListItem";
import "./CheckableListItem.css";
import { toggleChecked } from "./CheckableListItemUltils";
import "./DraftEditor.css";
import "./EmojiEditor.css";

export default function DraftEditor() {
  const { handleUpdateDoc } = useDocs();
  const currentId = useAppSelector((state) => state.doc.id);
  const isOpenMindMap = useAppSelector(
    (state) => state.doc.mindMap.isOpenMindMap,
  );
  const isOpenBoard = useAppSelector((state) => state.doc.board.isOpenBoard);
  const [updateDoc] = useUpdateDocMutation();
  const page = useAppSelector((state) => state.doc);
  const {
    perm,
    content,
    id,
    title: name,
    description,
    project_id,
    docInfo,
  } = page;
  const [mounted, setMounted] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState(name);
  const [headerImage, setHeaderImage] = useState<string | null>(
    docInfo.avatar?.link || null,
  );
  const [debounceChange] = useDebounce(
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

  const { plugins, EmojiSelect } = useMemo(() => {
    const emojiPlugin = createEmojiPlugin({
      selectButtonContent: (
        <Box display="flex" width="100%" height="100%">
          <AddReactionOutlinedIcon sx={{ width: "16px", height: "16px" }} />
          <Typography fontWeight={800}>Add emoji</Typography>
        </Box>
      ),
    });

    return {
      plugins: [emojiPlugin],
      EmojiSelect: emojiPlugin.EmojiSelect,
    };
  }, []);

  const editor = useRef<EditorPlugins | null>(null);

  const [showAddSession, setShowAddSession] = useState(false);
  const [heightToolBar, setHeightToolBar] = useState(0);

  // xử lý event open Add Session
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === "d") {
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
      const remainingBlocks = blocksArray.slice(1).map((block) => {
        return {
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
        };
      });

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
    "color-FF0000": {
      color: "#FF0000",
    },
    "color-00FFFF": {
      color: "#00FFFF",
    },
    "color-0000FFF": {
      color: "#0000FF",
    },
    "color-00008B": {
      color: "#00008B",
    },
    "color-FFFF00": {
      color: "#FFFF00",
    },
    "color-000000": {
      color: "#000000",
    },
    "color-14fa02": {
      color: "#14fa02",
    },
    "color-FFFFFF": {
      color: "#FFFFFF",
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

  const blockRendererFn = useCallback(
    (block: ContentBlock) => {
      if (block.getType() === CHECKABLE_LIST_ITEM) {
        return {
          component: CheckableListItem,
          props: {
            onChangeChecked: () =>
              setEditorState(toggleChecked(editorState, block)),
            checked: !!block.getData().get("checked"),
          },
        };
      }
      return null;
    },
    [editorState],
  );

  const heightToolMemo = useMemo(() => {
    return heightToolBar;
  }, [heightToolBar]);

  useEffect(() => {
    focusEditor();
  }, []);

  useEffect(() => {
    setTextAreaValue(name);
    // dispatch(getDocDetails(currentId));
  }, [name, currentId]);

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
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        bgcolor: "common.white",
        paddingTop: `${heightToolMemo}px`,
      }}
      // onClick={focusEditor}
    >
      {headerImage && (
        <Box
          sx={{
            width: "100%",
            height: "200px",
            position: "relative",
          }}
        >
          <Image src={headerImage} fill alt="" objectFit="cover" />
        </Box>
      )}
      <Box
        paddingX="1rem"
        paddingY="0.5rem"
        display="flex"
        alignItems="center"
        marginTop={1}
        gap="4px"
      >
        <EmojiSelect />
        <AddImageButton docId={currentId} setImageUrl={setHeaderImage} />
      </Box>
      <ToolBarDraftEditor
        editorState={editorState}
        setEditorState={setEditorState}
        setHeightToolBar={setHeightToolBar}
      />
      <Box
        sx={{
          position: "relative",
          paddingX: "1rem",
          height: `calc(100% - ${heightToolMemo}px)`,
          overflowY: "auto",
        }}
      >
        <EditorPlugins
          ref={editor}
          handleKeyCommand={handleKeyCommand}
          editorState={editorState}
          customStyleMap={styleMap}
          blockStyleFn={myBlockStyleFn}
          onChange={handleChangeEditor}
          blockRendererFn={blockRendererFn}
          plugins={plugins}
        />
        {showAddSession && (
          <AddSessionTool
            editor={editor}
            editorState={editorState}
            setEditorState={setEditorState}
            focusEditor={focusEditor}
          />
        )}
        {isOpenMindMap ? <ReactFlowMindMap /> : null}
        {isOpenBoard ? <BoardEditor /> : null}
      </Box>
    </Box>
  );
}
