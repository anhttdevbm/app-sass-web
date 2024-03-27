"use client";

import { Box, Stack } from "@mui/material";
import {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ReactQuillProps } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./style.css";
import { IMAGES_ACCEPT } from "constant/index";
import AttachmentPreview from "components/AttachmentPreview";
import dynamic from "next/dynamic";
import hljs from "highlight.js";
import { replaceDescriptionBr } from "components/sn-project-detail/Tasks/helpers";

const ReactQuill = dynamic(
  () => {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).hljs = hljs;
    return import("react-quill");
  },
  { ssr: false },
);

export type EditorProps = {
  hasAttachment?: boolean;
  onChangeFiles?: (files: File[]) => void;
  children?: React.ReactNode;
  files?: File[];
  noCss?: boolean;
} & Omit<ReactQuillProps, "children">;

const Editor = (props: EditorProps) => {
  const {
    hasAttachment,
    onChangeFiles,
    children,
    files = [],
    noCss,
    ...rest
  } = props;
  const [value, setValue] = useState("");

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const urlFiles = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  );

  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    let newFiles = Array.from(event.target.files);
    newFiles = newFiles.reduce(
      (out: File[], file) => {
        if (ACCEPTS.includes(file.type)) {
          out.push(file);
        }
        return out;
      },
      [...files],
    );
    onChangeFiles && onChangeFiles(newFiles);
  };

  const onRemove = (index: number) => {
    return () => {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      onChangeFiles && onChangeFiles(newFiles);
    };
  };

  const toolbarAttachment = useMemo(
    () => ({
      container: [
        ["bold", "italic", "underline", "strike"], // toggled buttons
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }], // superscript/subscript
        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
        [{ color: [] }, { background: ["transparent", ...COLORS] }], // dropdown with defaults from theme
        ["attachment"],
        ["clean"],
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

  const onInit = useCallback(async () => {
    const RQuill = (await import("react-quill")).default;

    const icons = RQuill.Quill.import("ui/icons");
    icons["attachment"] =
      '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_2326_51723)"><path d="M10.0771 15.0001L11.0681 13.5841C11.1246 13.5034 11.1964 13.4346 11.2794 13.3817C11.3625 13.3287 11.4552 13.2927 11.5522 13.2755C11.6491 13.2584 11.7486 13.2605 11.8447 13.2818C11.9409 13.3031 12.0319 13.3431 12.1126 13.3996C12.1933 13.4561 12.2621 13.5279 12.315 13.6109C12.368 13.694 12.4041 13.7867 12.4212 13.8836C12.4383 13.9806 12.4362 14.08 12.4149 14.1762C12.3936 14.2724 12.3536 14.3634 12.2971 14.4441L11.1491 16.0841C11.0914 16.1667 11.0176 16.2368 10.9321 16.2901C10.0649 17.1971 8.9016 17.7636 7.65281 17.8869C6.40403 18.0102 5.15237 17.6823 4.12451 16.9624C3.09666 16.2426 2.36057 15.1784 2.04957 13.9627C1.73857 12.747 1.87321 11.4601 2.42912 10.3351C2.45008 10.2366 2.49091 10.1433 2.54912 10.0611L3.69612 8.4221C3.75107 8.33789 3.8224 8.26558 3.90587 8.20949C3.98933 8.1534 4.08322 8.11466 4.18195 8.09559C4.28069 8.07651 4.38225 8.07749 4.4806 8.09846C4.57895 8.11943 4.67208 8.15996 4.75445 8.21764C4.83682 8.27533 4.90674 8.34899 4.96007 8.43424C5.0134 8.5195 5.04904 8.61461 5.06487 8.71392C5.0807 8.81322 5.07639 8.9147 5.05221 9.01231C5.02803 9.10992 4.98447 9.20167 4.92412 9.2821L3.93312 10.7001L3.93912 10.7031C3.44022 11.5173 3.27072 12.4911 3.46517 13.426C3.65963 14.3609 4.20339 15.1864 4.98557 15.7341C5.76775 16.2818 6.72941 16.5105 7.67442 16.3736C8.61943 16.2366 9.47661 15.7443 10.0711 14.9971L10.0771 15.0011V15.0001ZM15.5711 9.6651C15.55 9.76358 15.5092 9.85678 15.4511 9.9391L14.3041 11.5781C14.2492 11.6623 14.1778 11.7346 14.0944 11.7907C14.0109 11.8468 13.917 11.8855 13.8183 11.9046C13.7195 11.9237 13.618 11.9227 13.5196 11.9017C13.4213 11.8808 13.3282 11.8402 13.2458 11.7826C13.1634 11.7249 13.0935 11.6512 13.0402 11.566C12.9868 11.4807 12.9512 11.3856 12.9354 11.2863C12.9195 11.187 12.9238 11.0855 12.948 10.9879C12.9722 10.8903 13.0158 10.7985 13.0761 10.7181L13.9361 9.4881C14.4983 8.67311 14.7154 7.66886 14.54 6.69443C14.3646 5.71999 13.811 4.85447 12.9999 4.28667C12.1888 3.71887 11.186 3.49488 10.2104 3.66357C9.2348 3.83226 8.36548 4.37993 7.79212 5.1871L6.93212 6.4161C6.81808 6.57908 6.64396 6.69008 6.44808 6.72468C6.2522 6.75928 6.05059 6.71465 5.88762 6.6006C5.72464 6.48656 5.61365 6.31245 5.57905 6.11656C5.54444 5.92068 5.58908 5.71908 5.70312 5.5561L6.85112 3.9161C6.90884 3.83352 6.98265 3.76345 7.06812 3.7101C7.93531 2.8031 9.09864 2.23665 10.3474 2.11332C11.5962 1.98999 12.8479 2.31795 13.8757 3.0378C14.9036 3.75765 15.6397 4.82179 15.9507 6.0375C16.2617 7.25321 16.127 8.5401 15.5711 9.6651ZM11.0081 7.1331C11.0888 7.18961 11.1576 7.26148 11.2106 7.34459C11.2635 7.4277 11.2996 7.52043 11.3167 7.61747C11.3338 7.71452 11.3315 7.81399 11.3102 7.91018C11.2888 8.00638 11.2487 8.09742 11.1921 8.1781L8.03712 12.6831C7.92307 12.8461 7.74896 12.9571 7.55308 12.9917C7.3572 13.0263 7.15559 12.9816 6.99262 12.8676C6.82964 12.7536 6.71865 12.5794 6.68405 12.3836C6.64945 12.1877 6.69408 11.9861 6.80812 11.8231L9.96312 7.3171C10.0196 7.23637 10.0915 7.16757 10.1746 7.11463C10.2577 7.06169 10.3504 7.02564 10.4475 7.00856C10.5445 6.99147 10.644 6.99367 10.7402 7.01504C10.8364 7.03641 10.9274 7.07653 11.0081 7.1331Z" fill="#999999"/></g><defs><clipPath id="clip0_2326_51723"><rect width="18" height="18" fill="white"/></clipPath></defs></svg>';
  }, []);

  useEffect(() => {
    onInit();
  }, [onInit]);

  useEffect(() => {
    if (props.value && value.length === 0) {
      setValue(replaceDescriptionBr(props.value as string, ""));
    }
  }, [props.value]);

  return (
    <Stack className="editor">
      <ReactQuill
        theme="snow"
        placeholder="Write something..."
        modules={{
          toolbar,
          syntax: true,
        }}
        className={noCss ? "nocss" : ""}
        onChange={setValue}
        value={value}
        {...rest}
      />
      <Stack
        direction="row"
        flex={1}
        flexWrap="wrap"
        p={noCss ? 0 : 1}
        sx={
          noCss
            ? {}
            : {
                border: "1px solid",
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
            onRemove={onRemove(index)}
          />
        ))}
      </Stack>
      <Box
        multiple
        component="input"
        type="file"
        accept={ACCEPTS.join(",")}
        display="none"
        ref={inputFileRef}
        onChange={onChangeFile}
      />
      {children}
    </Stack>
  );
};

export default memo(Editor);

const ACCEPTS = [...IMAGES_ACCEPT, "video/mp4"];

export const COLORS = [
  "#000000",
  "#e60000",
  "#ff9900",
  "#ffff00",
  "#008a00",
  "#0066cc",
  "#9933ff",
  "#ffffff",
  "#facccc",
  "#ffebcc",
  "#ffffcc",
  "#cce8cc",
  "#cce0f5",
  "#ebd6ff",
  "#bbbbbb",
  "#f06666",
  "#ffc266",
  "#ffff66",
  "#66b966",
  "#66a3e0",
  "#c285ff",
  "#888888",
  "#a10000",
  "#b26b00",
  "#b2b200",
  "#006100",
  "#0047b2",
  "#6b24b2",
  "#444444",
  "#5c0000",
  "#663d00",
  "#666600",
  "#003700",
  "#002966",
  "#3d1466",
];

const TOOLBAR = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ color: [] }, { background: ["transparent", ...COLORS] }],
  ["clean"],
];
