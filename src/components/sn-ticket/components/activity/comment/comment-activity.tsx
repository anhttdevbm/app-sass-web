import styled from "@emotion/styled";
import { client, Endpoint } from "api";
import { IMAGES_ACCEPT } from "constant/index";
import React, {
  ChangeEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactQuill, { ReactQuillProps } from "react-quill";

const TextEditor = styled(ReactQuill)<ReactQuillProps>(({}) => ({
  width: "100%",
  borderRadius: "12px",
  border: "solid 1px #EFEFEF",
  "& .ql-toolbar": {
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
  },
  "& .ql-container": {
    borderBottomLeftRadius: "12px",
    borderBottomRightRadius: "12px",
  },
}));

const CommentActivity = () => {
  const [textData, setTextData] = useState("");
  const quillRef = React.useRef<ReactQuill>(null);
  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline"],
        [
          { align: "" },
          { align: "center" },
          { align: "right" },
          { align: "justify" },
        ],
        [{ list: "bullet" }, { list: "ordered" }],
        [{ background: [] }, { color: [] }],
        ["image", "link"], // Ensure 'image' is included here
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  function imageHandler() {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const quillEditor = quillRef.current?.getEditor(); // Access the Quill editor
          const range = quillEditor?.getSelection(true);
          quillEditor?.insertEmbed(
            range?.index ?? 0,
            "image",
            e.target?.result,
          );
        };
        reader.readAsDataURL(file);
      }
    };
  }

  return (
    <>
      <TextEditor
        ref={quillRef}
        id={""}
        theme="snow"
        modules={modules}
        placeholder="Add comment"
        value={textData}
        onChange={(value: string, delta: any, source: string) => {
          setTextData(value);
        }}
      />
    </>
  );
};
export default CommentActivity;
