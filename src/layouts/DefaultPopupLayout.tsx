/* eslint-disable react-hooks/exhaustive-deps */
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogTitle, Divider, IconButton, Stack } from "@mui/material";
//import { Filter } from '../Common';
import React, { PropsWithChildren } from "react";

interface IProps {
  open: boolean;
  content?: React.ReactNode | JSX.Element;
  onClose: () => void;
  title: string | React.ReactNode;
  isCenterTitle?: boolean;
  sx?: object;
  width?: string | number;
  isSearchable?: boolean;
  onChangeSearch?(keyword: string): void;
}

const DefaultPopupLayout: React.FC<PropsWithChildren<IProps>> = ({
  open,
  onClose,
  content,
  title = "",
  isCenterTitle = false,
  sx,
  isSearchable = false,
  onChangeSearch,
  children,
}) => {
  const [keyword, setKeyword] = React.useState<string>("");

  React.useEffect(() => {
    if (!open) {
      setKeyword("");
      if (onChangeSearch) onChangeSearch("");
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      disableEnforceFocus={true}
      PaperProps={{
        sx,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          padding: "23px 24px",
          height: "69px",
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            fontSize: "16px",
            lineHeight: "20px",
            fontWeight: 600,
            padding: 0,
            width: "100%",
            textAlign: isCenterTitle ? "center" : "left",
          }}
        >
          {title || "Popup title"}
        </DialogTitle>
        <IconButton
          onClick={onClose}
          sx={{
            width: "26px",
            height: "26px",
            position: "absolute",
            right: 24,
          }}
        >
          <CloseIcon sx={{ width: "20px", height: "20px" }} />
        </IconButton>
      </Stack>
      {/* {isSearchable ? (
        <Filter.SearchField
          placeholder="Search by name"
          value={keyword}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setKeyword(event.target.value);
            if (onChangeSearch) onChangeSearch(event.target.value.trim());
          }}
          sx={{
            marginLeft: '24px',
            marginBottom: '24px',
            maxWidth: '353px',
            height: '32px',
            ' .MuiInputBase-root': {
              maxWidth: '353px',
              height: '32px',
            },
          }}
        />
      ) : null} */}

      <Divider />
      {content || children}
    </Dialog>
  );
};

export default DefaultPopupLayout;
