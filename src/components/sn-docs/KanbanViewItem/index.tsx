import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Box from "@mui/material/Box";
import { NS_DOCS } from "constant/index";
import { useTranslations } from "next-intl";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from "react";
import MoveArrowIcon from "icons/MoveArrowIcon";
import { IKanbanViewDocItem } from "../KanbanViewDocList";


export default function KanbanViewItem({itemKanban} : {itemKanban: IKanbanViewDocItem}) {
  const docsT = useTranslations(NS_DOCS);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };
  
  const handleRenameDoc = () => {
    setAnchorEl(null);
  }

  const handleMoveDoc = () => {
    setAnchorEl(null);
  }

  const handleDuplicateDoc = () => {
    setAnchorEl(null);
  }

  const handleDeleteDoc = () => {
    setAnchorEl(null);
  }

  return (
    <Card sx={{ 
      width: 344, 
      height: 238, 
      borderRadius: 4,
      '&:hover .MuiCardHeader-root, &.menu-open .MuiCardHeader-root': {
        bgcolor: '#14B9E5',
        transition: 'background-color 0.3s'
      }
    }}
    >
      <CardHeader
        sx={{ bgcolor: "#E6F1FD", height: 54, color: "common.white" }}
        avatar={
          <Avatar
            alt={itemKanban.created_by?.avatar.name}
            src={itemKanban.created_by?.avatar.link}
            sx={{ height: 25, width: 25 }}
            aria-label="avatar-header"
          />
        }
        action={
          <>
            <IconButton
              aria-label="settings"
              sx={{
                padding: 0,
                marginRight: 1,
                "&:hover": { bgcolor: "transparent" },
              }}
              onClick={(event) => {
                  event.stopPropagation();
                  handleClick(event);
                }}
            >
              <MoreHoriz sx={{ color: "#FFFF", height: 18, width: 18 }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              PaperProps={{
                sx: {
                  width: 193,
                },
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={handleRenameDoc} >
                <ContentPasteGoIcon sx={{ height: 15, width: 15, color: "grey.400" }} /> {docsT("extendBtn.rename")}
              </MenuItem>
              <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={handleMoveDoc}>
                <MoveArrowIcon sx={{ height: 15, width: 15, color: "grey.400" }} /> {docsT("extendBtn.move")}
              </MenuItem>
              <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={handleDuplicateDoc}>
              <ContentCopyIcon sx={{ height: 15, width: 15, color: "grey.400" }} /> {docsT("extendBtn.duplicate")}
              </MenuItem>
              <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1, color: "#DE360E" }} onClick={handleDeleteDoc}>
               <DeleteOutlineIcon sx={{ height: 15, width: 15 }} /> {docsT("extendBtn.delete")}
              </MenuItem>
            </Menu>
          </>
        }
        title="Shrimp and Chorizo Paella"
      />
      <CardContent sx={{ paddingTop: 0.5, paddingX: 2.5, height: 184 }}>
        <Box display="flex" flexDirection="column" gap={0.5}>
          <Typography
            color="text.primary"
            fontSize={20}
            variant="h3"
            fontWeight={600}
            sx={{ fontWeight: "bold" }}
          >
            {itemKanban?.name}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              alt={itemKanban.owner?.avatar.name}
              src={itemKanban.owner?.avatar.link}
              sx={{ bgcolor: "#ddd5d5", height: 18, width: 18 }}
              aria-label="avatar-content"
            />
            <Typography variant="body1">Owned by</Typography>
            <Typography variant="body1" sx={{ color: "#0575E6" }}>
              {itemKanban.owner?.fullname}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="body1"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                lineHeight: "1.5",
              }}
            >
              Say hello to your colleagues who want to know your name, pronouns,
              role, team and location (or if you re remote). 📄 Recent pages that
              I ve worked on 🖐 Get in
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" paddingTop={1} gap={1} sx={{ color: "grey.300" }}>
            <AccessTimeIcon sx={{ height: 16, width: 16 }} />
            <Typography variant="body1" paddingLeft={1} fontSize={10}>
              {itemKanban.updated_time}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
