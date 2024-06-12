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
  Typography,
} from "@mui/material";
import { IconButton, Text } from "components/shared";
import { NS_AI_CHAT } from "constant/index";
import { DOCS_DETAIL_PATH } from "constant/paths";
import DocOutlineIcon from "icons/DocOutlineIcon";
import PlusIcon from "icons/PlusIcon";
import { debounce } from "lodash";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "store/app/selectors";
import { useDocs } from "store/docs/selectors";
import { getPath } from "utils/index";

interface DocItem {
  id: string;
  name: string;
}

interface AddDocModalProps {
  open: boolean;
  onClose: () => void;
  assistantContent: string;
}

export const AddDocModal: React.FC<AddDocModalProps> = ({
  open,
  onClose,
  assistantContent,
}) => {
  const { onGetDocs, items, onCreateDoc, onGetDocCustom, onUpdateDocCustom } = useDocs();
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations(NS_AI_CHAT);
  const loadMoreRef = useRef(null);

  const debouncedSearch = useCallback(
    debounce(
      (value) => onGetDocs({ user_id: user?.id, search_key: value }),
      300,
    ),
    [],
  );

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    debouncedSearch(event.target.value);
  };

  const handleAddDoc = async () => {
    await onCreateDoc(undefined, assistantContent);
    onClose();
  };

  const handleDocClick = async (doc: DocItem) => {
    const docDetail = await onGetDocCustom(doc.id)
    const newContent = docDetail.content ? docDetail.content + "</br>" + assistantContent : assistantContent;
    await onUpdateDocCustom( doc.id, { content: newContent } );
    const path = getPath(DOCS_DETAIL_PATH, undefined, { id: docDetail.id })
    router.push(`${path}`);
    onClose();
  };

  useEffect(() => {
    if (open) {
      onGetDocs({ user_id: user?.id, search_key: search });
    }
  }, [open]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onGetDocs({
          user_id: user?.id,
          search_key: search,
          page: items[0]?.docsPaging.pageIndex + 1,
        });
      }
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef]);

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
      {/*{loading && (*/}
      {/*  <Box*/}
      {/*    sx={{*/}
      {/*      display: "flex",*/}
      {/*      justifyContent: "center",*/}
      {/*      alignItems: "center",*/}
      {/*      position: "absolute",*/}
      {/*      top: 0,*/}
      {/*      left: 0,*/}
      {/*      width: "100%",*/}
      {/*      height: "100%",*/}
      {/*      backgroundColor: "rgba(0, 0, 0, 0.5)",*/}
      {/*      zIndex: 9999,*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <CircularProgress />*/}
      {/*  </Box>*/}
      {/*)}*/}
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
              color: "text.primary",
              "&::placeholder": {
                color: "grey.300",
              },
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
          <List sx={{ maxHeight: "300px", overflow: "auto" }}>
            {items &&
              items[0]?.docs.map((doc: DocItem) => (
                <ListItem alignItems="center" key={doc.id}>
                  <Button
                    onClick={() => handleDocClick(doc)}
                    sx={{
                      border: "none",
                      outline: "none",
                      background: "none",
                      padding: "8px",
                      "&:hover": {
                        background: "primary.dark",
                      },
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Box marginRight={1}>
                      <DocOutlineIcon />
                    </Box>
                    <Typography color={"grey.900"} variant="body1">
                      {doc.name}
                    </Typography>
                  </Button>
                </ListItem>
              ))}
            <div ref={loadMoreRef} />
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
                onClick={handleAddDoc}
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
