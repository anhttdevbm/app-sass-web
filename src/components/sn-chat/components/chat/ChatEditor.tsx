"use client";

import { Box, Stack } from "@mui/material";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "react-quill/dist/quill.snow.css";
import { ACCEPT_MEDIA, FILE_ACCEPT, NS_CHAT_BOX } from "constant/index";
import AttachmentPreview from "components/AttachmentPreview";
import "quill/dist/quill.snow.css";
import ImageImportIcon from "icons/ImageImportIcon";
import UploadFileIcon from "icons/UploadFileIcon";
import ChatEmoji, { Emoji } from "./ChatEmoji";
import hljs from "highlight.js";
import dynamic from "next/dynamic";
import type ReactQuill from "react-quill";
import { useChat } from "store/chat/selectors";
import { useTranslations } from "next-intl";

const QuillNoSSRWrapper = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    // eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
    return ({ forwardedRef, ...props }: any) => (
      <RQ ref={forwardedRef} {...props} />
    );
  },
  { ssr: false },
);

hljs.configure({
  // optionally configure hljs
  languages: [
    "javascript",
    "php",
    "go",
    "typescript",
    "css",
    "xml",
    "yaml",
    "swift",
    "sql",
    "shell",
    "scss",
    "scala",
    "rust",
    "ruby",
    "python",
    "perl",
    "nginx",
    "markdown",
    "less",
    "kotlin",
    "cpp",
    "csharp",
    "c",
    "bash",
  ],
});

const ACCEPT_ALL = [...FILE_ACCEPT, ...ACCEPT_MEDIA];
const TOOLBAR = [
  "bold",
  "italic",
  "underline",
  "strike",
  "link",
  { list: "bullet" },
  { list: "ordered" },
  "clean",
];

export type EditorProps = {
  hasAttachment?: boolean;
  children?: React.ReactNode;
  files?: File[];
  medias?: File[];
  noCss?: boolean;
  isLoading: boolean;
  initalValue: string | undefined;
  onChangeFiles?: (files: File[]) => void;
  onChangeMedias?: (files: File[]) => void;
  onEnterText?: (text: string) => void;
};

const ChatEditor = (props: EditorProps) => {
  const {
    hasAttachment,
    onChangeFiles,
    onChangeMedias,
    onEnterText,
    children,
    files = [],
    medias = [],
    noCss,
    initalValue,
    isLoading,
  } = props;
  const { dataTransfer } = useChat();
  const commonChatBox = useTranslations(NS_CHAT_BOX);

  const quillRef = useRef<ReactQuill>(null);
  const inputMediaRef = useRef<HTMLInputElement | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState("");
  const urlFiles = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  );
  const urlMedias = useMemo(
    () => medias.map((med) => URL.createObjectURL(med)),
    [medias],
  );

  const toolbarAttachment = useMemo(
    () => ({
      container: [
        ["bold", "italic", "underline", "strike"], // toggled buttons
        ["link"],
        [{ list: "bullet" }, { list: "ordered" }],
        [{ script: "sub" }, { script: "super" }], // superscript/subscript
        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        ["attachment"],
        ["link", "image", "video"],
      ],
      handlers: {
        attachment: () => {
          inputFileRef?.current?.click();
        },
      },
    }),
    [],
  );
  const toolbar = useMemo(
    () => (hasAttachment ? toolbarAttachment : TOOLBAR),
    [hasAttachment, toolbarAttachment],
  );

  const quillEditor = quillRef.current?.getEditor();

  const onChangeMedia = useCallback(
    (event: ChangeEvent<HTMLInputElement>, type: string[]) => {
      if (!event.target.files?.length) return;
      let newMedias = Array.from(event.target.files);

      newMedias = newMedias.reduce(
        (out: File[], file) => {
          if (type?.includes(file.type)) {
            out.push(file);
          }
          return out;
        },
        [...medias],
      );
      onChangeMedias && onChangeMedias(newMedias);
      if (inputMediaRef.current) {
        inputMediaRef.current.value = "";
      }
      quillEditor?.focus();
    },
    [medias, onChangeMedias, quillEditor],
  );

  const onChangeFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>, type: string[]) => {
      if (!event.target.files?.length) return;
      let newFiles = Array.from(event.target.files);

      newFiles = newFiles.reduce(
        (out: File[], file) => {
          if (type?.includes(file.type)) {
            out.push(file);
          }
          return out;
        },
        [...files],
      );
      onChangeFiles && onChangeFiles(newFiles);
      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
      quillEditor?.focus();
    },
    [files, onChangeFiles, quillEditor],
  );

  const onRemove = useCallback(
    (list, index: number, type: string) => {
      return () => {
        const newList = [...list];
        newList.splice(index, 1);
        if (type === "file") {
          onChangeFiles && onChangeFiles(newList);
        } else {
          onChangeMedias && onChangeMedias(newList);
        }
      };
    },
    [files, medias, onChangeFiles, onChangeMedias],
  );

  const handleMessage = useCallback(() => {
    const parser = new DOMParser();
    const html = parser.parseFromString(
      quillEditor?.root.innerHTML || "",
      "text/html",
    );
    const body = html.body;
    const arrIndexRemove: number[] = [];
    for (let i = body.children.length - 1; i > -1; i--) {
      const element = body.children[i] as HTMLElement;
      if (element.tagName === "P" && element.innerText.trim() === "") {
        arrIndexRemove.push(i);
      } else {
        break;
      }
    }

    for (const i of arrIndexRemove) {
      body.children[i]?.remove();
    }

    onEnterText?.(body.innerHTML);
    quillEditor?.deleteText(0, quillEditor?.getLength());
    setValue("");
  }, [onEnterText, quillEditor]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        handleMessage();
      }
    },
    [handleMessage],
  );

  const handleChaneEmoji = useCallback(
    (emoji: Emoji) => {
      quillEditor?.focus();
      const selection = quillEditor?.getSelection();
      const newText = `${emoji.native}`;
      let i = 1;
      if (selection?.index === undefined || selection?.index === 0) {
        i = 0;
      } else {
        i = selection?.index;
      }
      quillEditor?.insertText(i, newText);
    },
    [quillEditor],
  );

  useEffect(() => {
    quillEditor?.focus();
    if (initalValue) {
      setValue(initalValue);
    }
  }, [initalValue, quillEditor]);

  const modules = useMemo(() => {
    return {
      toolbar,
      syntax: {
        highlight: (text) => {
          return hljs.highlightAuto(text).value;
        },
      },
      keyboard: {
        bindings: {
          enter: {
            key: 13,
            handler: function (range, context) {
              return false;
            },
          },
          shift_enter: {
            key: 13,
            shiftKey: true,
            handler: function (range, context) {
              return true;
            },
          },
        },
      },
    };
  }, [toolbar]);

  useEffect(() => {
    setValue("");
  }, [dataTransfer]);

  return (
    <Stack
      className="editor"
      sx={{
        "& .quill": {
          flexDirection: "column",
          padding: "16px",
          "& .ql-container": {
            boxSizing: "border-box",
            position: "unset!important",
            display: "block",
            marginRight: "60px",
            backgroundColor: "#E1F0FF",
            borderRadius: "20px!important",
            width: "260px!important",
          },
        },

        "& .ql-snow": {
          border: "unset !important",
          borderTop: "1px solid #ECECF3!important",
          borderRadius: "unset !important",
          padding: "8px 0",
        },

        "& .ql-container": {
          "& .ql-editor": {
            boxSizing: "border-box",
            cursor: "text",
            lineHeight: 1.4,
            textAlign: "left",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            outline: "none",
            maxHeight: "80px",
            padding: "4px 32px 0px 20px",
            overflow: "scroll",
            height: "100%",
            "&::-webkit-scrollbar": {
              display: "none",
            },

            "&.ql-blank::before": {
              paddingLeft: "16px",
              fontSize: "14px",
              color: "#999999",
            },
          },
          "& .ql-tooltip": {
            right: "0",
            zIndex: 100,
            left: "0!important",
            width: "fit-content",
          },
        },
        "& .ql-formats": {
          marginRight: "16px",
          display: "flex",
          gap: "8px",
          justifyContent: "center",
        },
      }}
    >
      {isLoading ? "loading..." : null}
      <Box position="relative">
        <Box className="text-editor">
          <QuillNoSSRWrapper
            forwardedRef={quillRef}
            theme="snow"
            modules={modules}
            placeholder={commonChatBox("chatBox.typeMessage")}
            formats={[
              "bold",
              "italic",
              "underline",
              "strike",
              "link",
              "bullet",
              "ordered",
              "list",
              "link",
              "image",
              "video",
            ]}
            value={value}
            onChange={(value) => {
              setValue(value);
            }}
            onKeyDown={handleKeyDown}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            right: "1rem",
            bottom: "32px",
            display: "flex",
            flexDirection: "row",
            gap: "8px",
          }}
        >
          <ChatEmoji onChange={handleChaneEmoji} />
          <ImageImportIcon
            sx={{
              fill: "transparent",
              cursor: "pointer",
            }}
            onClick={() => {
              inputMediaRef?.current?.click();
            }}
          />
          <UploadFileIcon
            sx={{
              fill: "transparent",
              cursor: "pointer",
            }}
            onClick={() => {
              inputFileRef?.current?.click();
            }}
          />
          {/* <SendMesIcon
            sx={{
              fill: "transparent",
              cursor: "pointer",
            }}
            onClick={handleMessage}
          /> */}
        </Box>
      </Box>
      <Stack
        direction="row"
        flex={1}
        flexWrap="nowrap"
        overflow="auto"
        p={noCss ? 0 : 1}
        display={urlFiles?.length || urlMedias.length ? "flex" : "none"}
        sx={
          noCss
            ? {}
            : {
                borderColor: "grey.A200",
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4,
                borderTop: "none",
              }
        }
      >
        {urlFiles.map((attachment, index) => (
          <AttachmentPreview
            key={attachment}
            src={attachment}
            name={files[index].name}
            onRemove={onRemove(files, index, "file")}
          />
        ))}
        {urlMedias.map((attachment, index) => (
          <AttachmentPreview
            key={attachment}
            src={attachment}
            name={medias[index].name}
            onRemove={onRemove(medias, index, "media")}
          />
        ))}
      </Stack>
      <Box
        multiple
        component="input"
        type="file"
        accept={ACCEPT_MEDIA.join(",")}
        display="none"
        ref={inputMediaRef}
        onChange={(e) => onChangeMedia(e, ACCEPT_MEDIA)}
      />
      <Box
        multiple
        component="input"
        type="file"
        accept={ACCEPT_ALL.join(",")}
        display="none"
        ref={inputFileRef}
        onChange={(e) => onChangeFile(e, ACCEPT_ALL)}
      />
      {children}
    </Stack>
  );
};

export default ChatEditor;
