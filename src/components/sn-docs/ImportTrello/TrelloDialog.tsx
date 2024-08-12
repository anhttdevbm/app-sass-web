import React, { useState } from "react";
import Dialog from "../Dialog";
import { ITrelloTeam } from ".";
import {
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { Button, Text } from "components/shared";
import { useTranslations } from "next-intl";
import { NS_DOCS } from "constant/index";
import { useDocs } from "store/docs/selectors";
import SuccessDialog from "../SuccessDialog";
import useToggle from "hooks/useToggle";

interface ITrelloDialogProps {
  open: boolean;
  data: ITrelloTeam[];
  onClose: () => void;
}

export default function TrelloDialog(props: ITrelloDialogProps) {
  const { open, data, onClose } = props;
  const docsT = useTranslations(NS_DOCS);
  const [team, setTeam] = useState<ITrelloTeam>(data[0]);
  const [boards, setBoards] = useState<string[]>([]);
  const { onCreateDoc, loading } = useDocs();
  const [isShowSuccessDialog, onShowSuccessDialog, onHideSuccessDialog] =
    useToggle();

  const handleChangeTeam = (e: SelectChangeEvent<string>) => {
    setTeam(data.find((team) => team.name == e.target.value) || data[0]);
  };

  const handleCheck = (name: string) => {
    if (name === "selectAll") {
      boards.length === team.boards.length
        ? setBoards([])
        : setBoards(team.boards.map((b) => b.name));
      return;
    }
    boards.includes(name)
      ? setBoards(boards.filter((b) => b !== name))
      : setBoards([...boards, name]);
  };

  const handleImport = () => {
    // onCreateDoc()

    onShowSuccessDialog();
    onClose();
  };

  return (
    <>
      <Dialog title={`Import from Trello`} open={open} onClose={onClose}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Text variant="caption">TEAM</Text>
            <FormControl>
              <Select value={team.name} onChange={handleChangeTeam}>
                {data.map((team, idx) => (
                  <MenuItem
                    key={`document-import-thirdparty-trello-team-select-item-${
                      team.name + idx
                    }`}
                    value={team.name}
                  >
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack spacing={2}>
            <Text variant="caption">BOARDS</Text>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={boards.length === team.boards.length}
                    onChange={() => handleCheck("selectAll")}
                  />
                }
                label={docsT("import.thirdparty.trello.selectAll")}
              />
              {team.boards.map((board, idx) => (
                <FormControlLabel
                  key={`document-import-thirdparty-trello-board-select-item-${
                    board.name + idx
                  }`}
                  control={
                    <Checkbox
                      checked={boards.includes(board.name)}
                      onChange={() => handleCheck(board.name)}
                    />
                  }
                  label={board.name}
                />
              ))}
            </FormGroup>
          </Stack>
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
            disabled={loading}
            onClick={handleImport}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <>
                <Text />
                {docsT("addDropdown.import")}
              </>
            )}
          </Button>
        </Stack>
      </Dialog>
      <SuccessDialog
        open={isShowSuccessDialog}
        title={docsT("import.thirdparty.trello.importSuccess")}
        onClose={onHideSuccessDialog}
      />
    </>
  );
}
