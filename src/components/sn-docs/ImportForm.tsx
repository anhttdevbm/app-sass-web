import { SmartToy } from "@mui/icons-material";
import { Box, Divider, Grid, Link, Modal, Paper, Stack } from "@mui/material";
import { useMemo, useState } from "react";
import OutlineBtn from "./OutlineBtn";
import useToggle from "hooks/useToggle";
import DragDropFileDialog from "./DragDropFileDialog";
import { Endpoint } from "api";
import { useLocale, useTranslations } from "next-intl";
import { NS_COMMON, NS_DOCS } from "constant/index";
import { Text } from "components/shared";

export enum FileType {
  Docs = "docs",
  Spreadsheet = "spreadsheet",
}

export interface ITypeFileInfo {
  typ: FileType;
  title: string;
  extList: string[];
  endpointURL: string;
  additionalData?: { [key: string]: string };
}

interface IThirdPartyItem {
  text: string;
  icon: () => JSX.Element;
}

const thirdPartyList: IThirdPartyItem[] = [
  { text: "Markdown & Text", icon: () => <SmartToy /> },
  { text: "Trello", icon: () => <SmartToy /> },
  { text: "Dynalist", icon: () => <SmartToy /> },
  { text: "Workflowy", icon: () => <SmartToy /> },
];

const ImportForm = (props: { open: boolean; onClose: () => void }) => {
  const commonT = useTranslations(NS_COMMON);
  const docsT = useTranslations(NS_DOCS);
  const [isShowFileDialog, onShowFileDialog, onHideFileDialog] = useToggle();
  const [fileDialogType, setFileDialogType] = useState<FileType>(FileType.Docs);
  const locale = useLocale();

  const handleOpenFileDialog = (fileTyp: FileType) => {
    props.onClose();
    setFileDialogType(fileTyp);
    onShowFileDialog();
  };

  const dialogTypeInfo = useMemo<{
    [key in FileType]: ITypeFileInfo;
  }>(
    () => ({
      [FileType.Docs]: {
        typ: FileType.Docs,
        title: docsT("import.summarizeDoc"),
        extList: [".pdf", ".docx", ".txt"],
        endpointURL: Endpoint.AI_DOCS_SUMMARIZE,
        additionalData: { lang: locale },
      },
      [FileType.Spreadsheet]: {
        typ: FileType.Spreadsheet,
        title: docsT("import.convertSheet"),
        extList: [".csv"],
        endpointURL: Endpoint.AI_DOCS_COVERT_SHEET,
      },
    }),
    [],
  );

  return (
    <>
      <Modal open={props.open} onClose={props.onClose}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            minWidth: 360,
            maxWidth: 480,
            width: { xs: "calc(100% - 48px)", sm: 480 },
            bgcolor: "background.paper",
            borderRadius: 2,
          }}
        >
          <Stack sx={{ width: "100%" }}>
            <Stack sx={{ width: "100%", p: 2 }} alignItems="center" spacing={1}>
              <Text variant="body1" fontWeight={700}>
                {docsT("import.formTitle")}
              </Text>
              <Box>
                <Text
                  variant="body2"
                  component={"span"}
                  sx={{ mr: 0.5 }}
                  color="#999999"
                >
                  {docsT("import.formSubTitle")}
                </Text>
                <Link href="#" variant="body2" underline="hover">
                  {commonT("learnMore")}.
                </Link>
              </Box>
            </Stack>

            <Stack sx={{ width: "100%", p: 2 }} spacing={2}>
              {Object.keys(FileType).map((key, idx) => (
                <OutlineBtn
                  key={`document-import-fromfile-${idx}`}
                  text={dialogTypeInfo[FileType[key]].title}
                  startIcon={<SmartToy />}
                  isLinear
                  onClick={() => handleOpenFileDialog(FileType[key])}
                />
              ))}
            </Stack>

            <Divider sx={{ width: "100%" }}>
              <Text variant="body2" color="#BABCC6">
                {docsT("import.formDivider")}
              </Text>
            </Divider>

            <Grid container p={2} spacing={1}>
              {thirdPartyList.map((item, idx) => (
                <Grid
                  key={`document-import-thirdpartyitem-${idx}`}
                  item
                  xs={12}
                  sm={6}
                >
                  <OutlineBtn
                    text={item.text}
                    startIcon={item.icon()}
                    sx={{ justifyContent: "flex-start", color: "#212121" }}
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Paper>
      </Modal>
      <DragDropFileDialog
        open={isShowFileDialog}
        typFileInfo={dialogTypeInfo[fileDialogType]}
        onClose={onHideFileDialog}
      />
    </>
  );
};

export default ImportForm;
