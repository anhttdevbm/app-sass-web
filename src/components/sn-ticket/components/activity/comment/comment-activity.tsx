import { useState } from "react";
import ReactQuill from "react-quill";

const CommentActivity = () => {
  const [textData, setTextData] = useState("");
  console.log("textData", textData);
  return (
    <>
      <ReactQuill
        // ref={reactQuillRef}
        id={""}
        theme="snow"
        style={{ width: "100%" }}
        modules={{
          toolbar: [
            ["bold", "italic", "underline"],
            [
              { align: "" },
              { align: "center" },
              { align: "right" },
              { align: "justify" },
            ],
            [{ list: "bullet" }, { list: "ordered" }],
            [{ background: [] }, { color: [] }],
            ["image", "link"],
          ],
        }}
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
