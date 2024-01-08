"use client";

import {
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import {
  ACCEPT_MEDIA,
  FILE_ACCEPT,
  NS_BILLING,
  NS_COMMON,
  NS_PROJECT,
  NS_SALES,
} from "constant/index";
import { Box, Stack } from "@mui/material";
import { Button } from "components/shared";
import { useSnackbar } from "store/app/selectors";
import { UnprivilegedEditor } from "react-quill";
import {
  useSaleDetail,
  useSalesComment,
  useSalesTodo,
} from "store/sales/selectors";
import { CommentData, DealData } from "store/sales/actions";
import { Endpoint, client } from "api";
import { getMessageErrorByAPI } from "utils/index";
import { useFormContext } from "react-hook-form";
import moment from "moment";
import { SaleState, Sales } from "store/sales/reducer";
import useToggle from "hooks/useToggle";
import Loading from "components/Loading";
import Editor from "./Editor";
import { useBillings } from "store/billing/selectors";
import {
  Billing,
  BillingComment,
  BillingCommentData,
} from "store/billing/reducer";
import { User } from "constant/types";

type IProps = {
  billing: Billing;
  user: User;
};

const CommentEditor = forwardRef(
  (props: IProps, ref: ForwardedRef<HTMLDivElement | null>) => {
    const { billing, user } = props;
    const commonT = useTranslations(NS_COMMON);
    const billingT = useTranslations(NS_BILLING);
    const { onAddSnackbar } = useSnackbar();
    const [isProcessing, onProcessingTrue, onProcessingFalse] = useToggle();
    const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
    const editorRef = useRef<UnprivilegedEditor | undefined>();
    // const { control, setValue } = useFormContext();
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

    // const { saleDetail, onGetSaleDetail } = useSaleDetail();
    const { onCreateCommentBilling, onGetBilling, onGetCommentBilling } =
      useBillings();

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
        const data = {
          bill_id: billing.id,
          status: "1",
          user_id: user.id,
          comment: editorRef.current?.getHTML() ?? content,
          file: fileLoaded,
        } as unknown as BillingCommentData;
        // if (files.length) {
        //   data.attachments = [];
        //   const promises = files.map((file) => {
        //     return client.upload(Endpoint.UPLOAD_LINK, file);
        //   });
        //   const results = await Promise.allSettled(promises);
        //   results.forEach((result) => {
        //     if (result.status === "fulfilled" && result.value) {
        //       (data.attachments as string[]).push(result.value);
        //     }
        //   });
        // }
        const newData = await onCreateCommentBilling(data);
        if (newData) {
          //   onGetTaskList(taskListId);
          // const newComments: Sales["comments"] = newData.deal_update.comments;
          // newComments.sort((a, b) =>
          //   moment(b.created_time).isAfter(a.created_time) ? 1 : -1,
          // );
          onGetCommentBilling(billing?.id || "");
          // setValue("comments", newComments);
          setContent("");
          setFiles([]);
          setFileLoaded([]);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ((ref as any)?.current as HTMLDivElement)?.scrollIntoView();
        }
      } catch (error) {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      } finally {
        onProcessingFalse();
      }
    };

    return (
      <Box sx={{}}>
        <Editor
          hasAttachment
          placeholder={billingT("detail.form.feed.title.writeYourComment")}
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
          accepts={SUPPORTS}
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
              {billingT("detail.form.feed.button.sendComment")}
            </Button>
          </Stack>
        </Editor>
        {/* <Loading open={isProcessing} /> */}
      </Box>
    );
  },
);

CommentEditor.displayName = "CommentEditor";
const SUPPORTS = [
  ...ACCEPT_MEDIA,
  ...FILE_ACCEPT,
  "application/x-zip-compressed",
];
const getExtension = (name: string) => {
  const arr = name.split(".");
  return arr[arr.length - 1];
};

export default memo(CommentEditor);

const VALUE_AS_EMPTY = "<p><br></p>";
