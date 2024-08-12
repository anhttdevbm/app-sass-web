import React, { useMemo, useRef, useState } from "react";
import Dialog from "../Dialog";
import { useTranslations } from "next-intl";
import { AI_DOCS_API_URL, AN_ERROR_TRY_AGAIN, NS_DOCS } from "constant/index";
import { TextareaAutosize } from "@mui/base";
import styled from "styled-components";
import { CircularProgress, Stack } from "@mui/material";
import { Button, Text } from "components/shared";
import { useDocs } from "store/docs/selectors";
import { client } from "api";
import { IThirdPartyItem, ThirdpartyTyp } from "../ImportForm";
import { ContentBlock } from "draft-js";
import SuccessDialog from "../SuccessDialog";
import useToggle from "hooks/useToggle";
import { HttpStatusCode } from "constant/enums";
import { uuid } from "utils/index";
import { useSnackbar } from "store/app/selectors";

interface IThirdPartyFileDialogProps {
  thirdParty?: IThirdPartyItem;
  onClose: () => void;
}

const Textarea = styled(TextareaAutosize)(({ theme }) => {
  return `
    width: 100%;
    padding: 8px 12px;
    border-radius: 8px;
    font-family: inherit;
    color: #1C2025;
    background: #F7F7FD;;
    border: 1px solid '#C7D0DD';
    box-shadow: 0px 2px 2px '#F3F6F9';

    &:hover {
      border-color: #3399FF;
    }

    &:focus {
      border-color: #3399FF;
      box-shadow: 0 0 0 3px #b6daff;
    }

    &:focus-visible {
      outline: 0;
    }
  `;
});

export default function ThirdPartyFileDialog(
  props: IThirdPartyFileDialogProps,
) {
  const docsT = useTranslations(NS_DOCS);
  const { thirdParty, onClose } = props;
  const { onCreateDoc, loading } = useDocs();
  const [pending, setPending] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [textAreaVal, setTextAreaVal] = useState<string>("");
  const [isShowSuccessDialog, onShowSuccessDialog, onHideSuccessDialog] =
    useToggle();
  const caption = useMemo(
    () =>
      `${docsT("import.thirdparty.captionStart")} ${
        thirdParty?.file?.name
      } ${docsT("import.thirdparty.captionEnd")} (${thirdParty?.extList?.join(
        ", ",
      )})`,
    [thirdParty],
  );
  const { onAddSnackbar } = useSnackbar();

  const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaVal(e.target.value);
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImport = async () => {
    try {
      setPending(true);

      if (!textAreaVal) throw new Error(docsT("import.thirdparty.errorNoti"));

      let fileName: string = "import_file" + thirdParty?.file?.ext;
      if (fileInputRef.current && fileInputRef.current.files) {
        if (fileInputRef.current.files.length > 0)
          fileName = fileInputRef.current.files[0].name;
      }

      const blob = new Blob([textAreaVal], { type: thirdParty?.file?.type });
      const file = new File([blob], fileName, {
        type: thirdParty?.file?.type,
      });
      console.log({ file });

      const formData = new FormData();
      formData.append("file", file || new Blob());

      const response = await client.post(
        thirdParty?.endpointURL || "",
        formData,
        {
          baseURL: AI_DOCS_API_URL,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === HttpStatusCode.OK) {
        const blocks: ContentBlock[] = [
          new ContentBlock({
            key: uuid(),
            type: "normaltext",
            text: response.data.content || "",
          }),
        ];
        await onCreateDoc(
          undefined,
          JSON.stringify(blocks),
          response.data.name,
        );
        onShowSuccessDialog();
        setPending(false);
        onClose();
      } else {
        throw AN_ERROR_TRY_AGAIN;
      }
    } catch (error: any) {
      console.error(error);
      setPending(false);
      onAddSnackbar(error.message, "error", 3000);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files.length == 1) {
        console.log(e.target.files[0]);
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target) {
            setTextAreaVal(event.target.result as string);
            return;
          }
        };
        reader.readAsText(e.target.files[0]);
      }
    } catch (error: any) {
      console.error(error);
      onAddSnackbar(error.message, "error", 3000);
    }
  };

  return (
    <>
      <Dialog
        title={`${docsT("addDropdown.import")} ${thirdParty?.text}`}
        subtitle={caption}
        open={!!thirdParty && thirdParty.typ == ThirdpartyTyp.File}
        onClose={onClose}
      >
        <Stack alignItems="center" gap={3}>
          <Textarea
            minRows={7}
            placeholder={caption}
            value={textAreaVal}
            onChange={handleChangeTextArea}
          />

          <Button
            variant="primary"
            fullWidth
            sx={{
              background: "linear-gradient(-90deg, #2AF598 0%, #009EFD 100%)",
              "&:hover": {
                background: "linear-gradient(-90deg, #2AF598 0%, #009EFD 100%)",
                opacity: 0.9,
              },
            }}
            type="button"
            size="small"
            disabled={pending || loading}
            onClick={handleImport}
          >
            {pending || loading ? (
              <CircularProgress size={24} />
            ) : (
              <>
                <Text />
                {docsT("addDropdown.import")}
              </>
            )}
          </Button>

          <Button
            variant="text"
            sx={{
              width: "fit-content",
              color: "primary",
              "&:hover": {
                bgcolor: "#fff",
                textDecoration: "underline",
              },
            }}
            size="small"
            disabled={pending || loading}
            onClick={handleClick}
          >{`${docsT(
            "import.thirdparty.optionBtn",
          )} (${thirdParty?.extList?.join(", ")})`}</Button>
        </Stack>
      </Dialog>
      <input
        type="file"
        multiple={false}
        accept={thirdParty?.extList?.join(",")}
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleUpload}
      />
      <SuccessDialog
        open={isShowSuccessDialog}
        title={`${docsT("addDropdown.import")} ${thirdParty?.text}`}
        subtitle={docsT("import.thirdparty.successMess")}
        onClose={onHideSuccessDialog}
      />
    </>
  );
}
