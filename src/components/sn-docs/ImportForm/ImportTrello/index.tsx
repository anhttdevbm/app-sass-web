import { East } from "@mui/icons-material";
import { Modal, Paper, Stack } from "@mui/material";
import AppLogo from "components/AppLogo";
import { Button, Text } from "components/shared";
import { NS_DOCS } from "constant/index";
import useToggle from "hooks/useToggle";
import { useTranslations } from "next-intl";
import { IThirdPartyItem } from "../thirdPartyList";
import TrelloDialog from "./TrelloDialog";

interface IImportTrelloProps {
  thirdParty?: IThirdPartyItem;
  onClose: () => void;
}

export interface ITrelloBoard {
  name: string;
}

export interface ITrelloTeam {
  name: string;
  boards: ITrelloBoard[];
}

const mockData: ITrelloTeam[] = [
  {
    name: "Không gian làm việc của Hằng Phạm 1",
    boards: [
      {
        name: "Hang Pham 1",
      },
      {
        name: "Hang Pham 2",
      },
    ],
  },
  {
    name: "Không gian làm việc của Hằng Phạm 2",
    boards: [
      {
        name: "Hang Pham 2",
      },
    ],
  },
];

export default function ImportTrello(props: IImportTrelloProps) {
  const { thirdParty, onClose } = props;
  const docsT = useTranslations(NS_DOCS);
  const [isShowTrelloDialog, onShowTrelloDialog, onHideTrelloDialog] =
    useToggle(false);

  const handleAuthenticate = () => {
    // add auth to Trello: TBC

    onClose();
    onShowTrelloDialog();
  };

  return (
    <>
      <Modal
        open={!!thirdParty && thirdParty.text == "Trello"}
        onClose={onClose}
      >
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
          <Stack p={3} gap={3} alignItems="center">
            <Text variant="h5" fontWeight={700}>
              {docsT("import.thirdparty.trello.importFrom")}
            </Text>
            <Stack direction="row" alignItems="center" gap={3}>
              {thirdParty?.icon()}
              <East sx={{ color: "grey.500" }} />
              <AppLogo icon width={32} />
            </Stack>
            <Text variant="body2" align="center">
              {docsT("import.thirdparty.trello.caption")}
            </Text>
            <Button
              variant="primary"
              fullWidth
              sx={{
                background: "linear-gradient(-90deg, #2AF598 0%, #009EFD 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(-90deg, #2AF598 0%, #009EFD 100%)",
                  opacity: 0.9,
                },
              }}
              type="button"
              size="small"
              onClick={handleAuthenticate}
            >
              <Text variant="body2" color="white" fontWeight={600}>
                {docsT("import.thirdparty.authBtn")}
              </Text>
            </Button>
          </Stack>
        </Paper>
      </Modal>
      <TrelloDialog
        open={isShowTrelloDialog}
        data={mockData}
        onClose={onHideTrelloDialog}
      />
    </>
  );
}
