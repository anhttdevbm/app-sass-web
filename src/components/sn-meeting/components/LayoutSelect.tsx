import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import ArrowDownIcon from "icons/ArrowDownIcon";
import { FocusOnContentLayout } from "icons/FocusOnContentLayout";
import { GalleryLayoutIcon } from "icons/GalleryLayoutIcon";
import { SpeakerLayoutIcon } from "icons/SpeakerLayoutIcon";
import { LayoutType } from "../type";
import { useMeeting } from "store/meeting/selectors";

interface IProps {
  onBack: () => void;
}

interface LayoutDataProps {
  value: LayoutType;
  icon: JSX.Element;
  label: string;
}

const layoutData: LayoutDataProps[] = [
  {
    value: LayoutType.GALARY,
    icon: (
      <GalleryLayoutIcon
        sx={{
          width: "48px",
          height: "28px",
        }}
      />
    ),
    label: "Gallery",
  },
  {
    value: LayoutType.SPEAKER,
    icon: (
      <SpeakerLayoutIcon
        sx={{
          width: "48px",
          height: "28px",
        }}
      />
    ),
    label: "Speaker",
  },
  {
    value: LayoutType.FOCUS_ON_CONTENT,
    icon: (
      <FocusOnContentLayout
        sx={{
          width: "48px",
          height: "28px",
        }}
      />
    ),
    label: "Focus on content",
  },
];

const RadioLabel = (props: LayoutDataProps) => {
  const { label, icon } = props;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        justifyContent: "space-between",
      }}
    >
      {label}
      {icon}
    </Box>
  );
};

export default function LayoutSelect({ onBack }: IProps) {
  const { onSetMeetingLayout } = useMeeting();
  return (
    <Stack
      sx={{
        boxShadow: "2px 2px 24px 0px #0000001A",
        borderRadius: "4px",
        height: "100%",
      }}
    >
      <Box
        sx={{
          height: "56px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          pl: "16px",
        }}
      >
        <IconButton onClick={onBack}>
          <ArrowDownIcon
            sx={{
              width: "18px",
              height: "18px",
              color: "#666",
            }}
          />
        </IconButton>
        Change layout
      </Box>
      <Divider
        sx={{
          backgroundColor: "#ECECF3",
        }}
      />
      <Box
        sx={{
          p: "12px 24px",
        }}
      >
        <FormControl fullWidth>
          <RadioGroup
            aria-labelledby="layout-select"
            defaultValue={LayoutType.SPEAKER}
            name="layout-select-radio-buttons-group"
            sx={{
              gap: "8px",
            }}
            onChange={(e) => onSetMeetingLayout(e.target.value as LayoutType)}
          >
            {layoutData.map((item) => (
              <FormControlLabel
                key={item.value}
                control={<Radio />}
                value={item.value}
                sx={{
                  "& .MuiTypography-root": {
                    flex: 1,
                  },
                }}
                label={
                  <RadioLabel
                    label={item.label}
                    icon={item.icon}
                    value={item.value}
                  />
                }
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
    </Stack>
  );
}
