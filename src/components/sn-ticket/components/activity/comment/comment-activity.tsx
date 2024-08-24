import styled from "@emotion/styled";
import { Stack } from "@mui/material";
import { client, Endpoint } from "api";
import { Button } from "components/shared";
import Editor from "components/sn-billing-detail/components/Comment/Editor";
import { ACCEPT_MEDIA, IMAGES_ACCEPT, NS_COMMON } from "constant/index";
import useToggle from "hooks/useToggle";
import { useTranslations } from "next-intl";
import React, {
  ChangeEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactQuill, { ReactQuillProps, UnprivilegedEditor } from "react-quill";
import { useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";

const VALUE_AS_EMPTY = "<p><br></p>";
const CommentActivity = () => {
  const commonT = useTranslations(NS_COMMON);
  // const billingT = useTranslations(NS_BILLING);
  const { onAddSnackbar } = useSnackbar();
  const [isProcessing, onProcessingTrue, onProcessingFalse] = useToggle();
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
  const editorRef = useRef<UnprivilegedEditor | undefined>();
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const [content, setContent] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileLoaded, setFileLoaded] = useState<string[]>([]);

  const onChange = (value: string, delta, _, editor: UnprivilegedEditor) => {
    const isEmpty = value === VALUE_AS_EMPTY;
    setContent(isEmpty ? "" : value);
    editorRef.current = editor;
  };

  const onChangeFiles = (files: File[], data: string[]) => {
    setFiles(files);
    setFileLoaded((files) => files.concat(data));
  };

  const disabled = useMemo(
    () =>
      isLoadingFile ||
      ((!content?.trim()?.length ||
        !editorRef.current?.getText()?.trim()?.length) &&
        !files.length),
    [content, files.length, isLoadingFile],
  );

  const onSubmit = async () => {
    //   if (!taskListId || !taskId) return;

    try {
      onProcessingTrue();
      
      
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    } finally {
      onProcessingFalse();
    }
  };

  return (
    <>
      <Editor
          hasAttachment
          placeholder={""}
          onChange={onChange}
          onChangeNewsfiles={(localFiles) => {
            if (localFiles) {
              setNewFiles(localFiles);
              return;
            }
            setNewFiles((files) => {
              files.pop();
              return files;
            });
          }}
          newFiles={newFiles}
          onChangeFiles={onChangeFiles}
          value={content}
          setIsProcessing={setIsLoadingFile}
          accepts={ACCEPT_MEDIA}
          files={files}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mt={2}
          >
            <Button
              disabled={disabled}
              onClick={onSubmit}
              variant="primary"
              size="small"
            >
              Save
            </Button>
          </Stack>
        </Editor>
    </>
  );
};
export default CommentActivity;
