import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import { Button } from "components/shared";
import { inter } from "components/sn-time-tracking/CalendarTracking/CalendarTracking.styles";
import { useUpdateDocMutation } from "store/docs/api";
import SelectProjectInDoc from "../detail/SelectProjectInDoc";
import { IDocItem } from "../KanbanViewDocList";
import { useAppSelector } from "store/hooks";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: "500px",
    maxWidth: "unset",
    borderRadius: theme.spacing(2),
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
}));

interface ConfirmChangeModalProps {
  open: boolean;
  onClose: () => void;
  docItem: IDocItem;
}

export default function ConfirmChangeModal({
  open,
  onClose,
  docItem,
}: ConfirmChangeModalProps) {
  const [updateDoc] = useUpdateDocMutation();
  const { project_id: project, id } = docItem;
  const { project_id } = useAppSelector((state) => state.doc);
  const onMoveProject = () => {
    updateDoc({
      id,
      payload: {
        project_id,
      },
    });
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="document-access-dialog-title"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle
        id="document-access-dialog-title"
        sx={{
          m: 0,
          p: 3,
          fontWeight: "600",
          textAlign: "center",
          color: "neutral.800",
          fontSize: "20px",
          fontFamily: inter.style.fontFamily,
          position: "relative",
        }}
      >
        Move this document to another project ?
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 3,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#666",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
        }}
      >
        <Typography>Select Project:</Typography>
        <SelectProjectInDoc currentProjectId={project?.id} />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", mb: 2, gap: "20px" }}>
        <Button
          onClick={onClose}
          variant="primaryOutlined"
          size="small"
          sx={{
            width: "150px",
            borderRadius: "100px",
            borderColor: "#3699FF",
            "&:hover": {
              borderColor: "#3699FF",
              opacity: 0.8,
            },
          }}
        >
          Cancle
        </Button>
        <Button
          onClick={onMoveProject}
          variant="primary"
          disabled={project_id === "all" || project_id === project?.id}
          sx={{
            width: "150px",
            borderRadius: "100px",
            background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
            "&:hover": {
              background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
              opacity: 0.8,
            },
          }}
          size="small"
        >
          Move
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
