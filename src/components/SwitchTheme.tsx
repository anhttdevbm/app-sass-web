import { memo } from "react";
import { IconButton } from "./shared";
import SunIcon from "icons/SunIcon";
import MoonIcon from "icons/MoonIcon";
import useTheme from "hooks/useTheme";
import { ThemeMode } from "constant/enums";

const SwitchTheme = () => {
  const { isDarkMode, setMode } = useTheme();

  const onToggleMode = () => {
    setMode(isDarkMode ? ThemeMode.LIGHT : ThemeMode.DARK);
  };

  return (
    <IconButton onClick={onToggleMode}>
      {isDarkMode ? (
        <MoonIcon sx={{ color: "common.white" }} />
      ) : (
        <SunIcon sx={{ color: "common.black" }} />
      )}
    </IconButton>
  );
};

export default memo(SwitchTheme);
