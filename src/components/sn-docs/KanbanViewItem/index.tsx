import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import Box from "@mui/material/Box";

export default function KanbanViewItem() {
  return (
    <Card sx={{ width: 344, height: 238, borderRadius: 4 }}>
      <CardHeader
        sx={{ bgcolor: "#14B9E5", height: 54, color: "common.white" }}
        avatar={
          <Avatar
            sx={{ bgcolor: red[500], height: 25, width: 25 }}
            aria-label="avatar-header"
          >
            R
          </Avatar>
        }
        action={
          <IconButton
            aria-label="settings"
            sx={{
              padding: 0,
              marginRight: 1,
              "&:hover": { bgcolor: "transparent" },
            }}
          >
            <MoreHoriz sx={{ color: "#FFFF", height: 18, width: 18 }} />
          </IconButton>
        }
        title="Shrimp and Chorizo Paella"
      />
      <CardContent sx={{ padding: 0, paddingX: 2.5  }}>
        <Typography
          color="text.primary"
          fontSize={20}
          variant="h3"
          fontWeight={600}
          sx={{ fontWeight: "bold" }}
        >
          Overview
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar
            sx={{ bgcolor: "#ddd5d5", height: 18, width: 18 }}
            aria-label="avatar-content"
          >
            R
          </Avatar>
          <Typography variant="body1">Owned by</Typography>
          <Typography variant="body1" sx={{ color: "#0575E6" }}>
            Hang Pham
          </Typography>
        </Box>
        <Box sx={{}}>
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
            role, team and location (or if you're remote). 📄 Recent pages that
            I've worked on 🖐 Get in
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
