import { memo, useRef } from "react";
import { Stack } from "@mui/material";
import AppEditor, { EditorProps as AppEditorProps } from "components/Editor";
import Text from "./Text";
import { UnprivilegedEditor } from "react-quill";

type EditorProps = {
  title: string;
  name: string;
  required?: boolean;
  onChange: (name: string, value?: string) => void;
  editorKey?: string;
} & Omit<AppEditorProps, "onChange">;

const Editor = (props: EditorProps) => {
  const { title, name, required, onChange, editorKey, ...rest } = props;

  const onChangeEditor = (
    value: string,
    delta,
    _source,
    editor: UnprivilegedEditor,
  ) => {
    const isEmpty = "<p><br></p>" === value;
    const newValue = isEmpty ? "" : value ?? "";
    onChange(name, newValue);
    if (editorKey) {
      window[getEditorName(editorKey)] = editor;
    }
  };

  return (
    <Stack
      spacing={1}
      flex={1}
      bgcolor="grey.50"
      px={2.5}
      pt={0.75}
      pb={1}
      borderRadius={1}
      sx={{
        "& p:last-child": {
          display: "none",
        },
      }}
    >
      <Text variant="caption" color="grey.300">
        {title}
        {required ? "*" : ""}
      </Text>
      <AppEditor placeholder="" noCss onChange={onChangeEditor} {...rest} />
    </Stack>
  );
};

export default memo(Editor);

export const getEditorName = (name: string) => `editor-${name}`;
