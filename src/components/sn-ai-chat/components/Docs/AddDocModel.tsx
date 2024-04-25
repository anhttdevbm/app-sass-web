import { SearchRounded } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  List,
  ListItem,
  TextField,
} from "@mui/material";
import { IconButton, Text } from "components/shared";
import { NS_AI_CHAT } from "constant/index";
import DocOutlineIcon from "icons/DocOutlineIcon";
import PlusIcon from "icons/PlusIcon";
import { useTranslations } from "next-intl";
import React from "react";
import { useDocs } from "store/docs/selectors";

export const AddDocModal = ({ open, onClose }) => {
  const { onCreateDoc, onGetDocs, handleUpdateDoc } = useDocs();
  const [search, setSearch] = React.useState("");

  const t = useTranslations(NS_AI_CHAT);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleAddDoc = async () => {
    const doc = await onCreateDoc(search);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          borderRadius: "10px",
        },
      }}
    >
      <IconButton
        style={{
          position: "absolute",
          right: 8,
          top: 8,
          height: "16px",
          width: "16px",
        }}
        onClick={onClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <DialogTitle sx={{ padding: "24px 0px" }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding={0}
        >
          <Text variant="h5" padding={0}>
            {t("addDoc.title")}
          </Text>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          value={search}
          onChange={handleSearchChange}
          placeholder={t("addDoc.search")}
          sx={{
            width: "100%",
            padding: "4px 20px",
            backgroundColor: "#F7F7FD",
            borderRadius: "10px",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& .MuiOutlinedInput-input": {
              textAlign: "start",
              transition: "none",
              fontSize: "14px",
              fontWeight: "400",
              color: "grey.300",
            },
            "& .MuiSvgIcon-root": {
              width: "24px",
              height: "24px",
              color: "grey.300",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded />
              </InputAdornment>
            ),
          }}
        />
        <Box>
          <List>
            <ListItem alignItems="center">
              <div style={{ marginRight: '8px' }}>
                <DocOutlineIcon width={20} height={20} />
              </div>
              <Text variant="body1">Document 1</Text>
            </ListItem>
          </List>
          <DialogActions
            sx={{
              justifyContent: "flex-start",
              padding: "24px 0px 0px 0px",
            }}
          >
            <Box>
              <Button
                variant="text"
                color="primary"
                sx={{
                  border: "none",
                  outline: "none",
                  "& .MuiSvgIcon-root": {
                    marginLeft: "8px",
                  },
                }}
                startIcon={<PlusIcon />}
              >
                {t("addDoc.add")}
              </Button>
            </Box>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
