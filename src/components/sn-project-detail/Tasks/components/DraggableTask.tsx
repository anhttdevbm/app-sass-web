import { Box, Stack, Paper } from "@mui/material";
import { IconButton } from "components/shared";
import useBreakpoint from "hooks/useBreakpoint";
import CheckBoxCustom from "components/shared/CheckBoxCustom";
import MoveTagIcon from "icons/MoveTagIcon";
import {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Draggable } from "react-beautiful-dnd";
import { Task } from "store/project/reducer";
import { checkIsMobile } from "utils/index";
import snResetPassword from "components/sn-reset-password";
import ProjectTaskIcon from "icons/ProjectTaskIcon";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
type DraggableTaskProps = {
  id: string;
  index: number;
  checked: boolean;
  isSubTask: boolean;
  onChange: () => void;
  children: React.ReactNode;
  isHide: boolean;
  setHideIds: Dispatch<SetStateAction<string[]>>;
  task: Task;
};

const DraggableTask = (props: DraggableTaskProps) => {
  const {
    id,
    index,
    checked,
    onChange,
    children,
    isHide,
    isSubTask,
    setHideIds,
    task,
    ...rest
  } = props;

  const { isXlSmaller } = useBreakpoint();

  const isMobile = useMemo(() => checkIsMobile(), []);

  const [isToggle, setIsToggle] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState(false);

  // const onToggle = () => {
  //   setHideIds((prevIds) => {
  //     const newIds = [...prevIds];
  //     const indexSelected = newIds.findIndex((idValue) => idValue === id);
  //     if (indexSelected === -1) {
  //       newIds.push(id);
  //     } else {
  //       newIds.splice(indexSelected, 1);
  //     }
  //     return newIds;
  //   });
  // };

  const onHandlerHide = useCallback(() => {
    setHideIds((prevIds) => {
      const newIds = [...prevIds];
      const indexSelected = newIds.findIndex((idValue) => idValue === id);

      if (indexSelected !== -1) {
        newIds.splice(indexSelected, 1);
      }

      return newIds;
    });
  }, [id, setHideIds]);

  const onHandlerShow = useCallback(() => {
    setHideIds((prevIds) => {
      const newIds = [...prevIds];
      const indexSelected = newIds.findIndex((idValue) => idValue === id);
      if (indexSelected === -1) {
        newIds.push(id);
      }
      return newIds;
    });
  }, [id, setHideIds]);

  useEffect(() => {
    if (isToggle) onHandlerShow();
    else onHandlerHide();
  }, [isToggle, onHandlerHide, onHandlerShow]);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => {
        if (snapshot.isDragging || isHidden) setIsToggle(true);
        else setIsToggle(false);

        return (
          <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={{
              overflow: "hidden",
              ...provided.draggableProps.style,
            }}
            className="draggable"
            sx={{
              "&::after": {
                position: "absolute",
                top: "40px",
                borderBottom: {
                  xs: "none",
                  md: "1px solid",
                },
                borderColor: {
                  xs: "background.paper",
                  md: "background.default",
                },
                content: "''",
                width: "100%",
                height: "1px",
              },
              borderBottom: {
                xs: "1px solid",
                md: "none",
              },
              borderColor: {
                xs: "background.default",
                md: "background.paper",
              },
            }}
            {...rest}
          >
            <Stack
              direction="row"
              alignItems="center"
              height={40}
              ml={2}
              spacing={{ xs: 0.5, sm: 1 }}
              gap={1}
              display={{ xs: "none", sm: "flex" }}
            >
              <CheckBoxCustom
                size="small"
                className="checkbox"
                checked={checked}
                onChange={onChange}
              />
              <IconButton
                noPadding
                sx={{ zIndex: 10 }}
                onClick={() => setIsHidden((_isHidden) => !_isHidden)}
              >
                {isHidden ? (
                  <ExpandLess sx={{ color: "text.primary" }} />
                ) : (
                  <ExpandMore sx={{ color: "text.primary" }} />
                )}
              </IconButton>
              <IconButton
                noPadding
                sx={{ zIndex: 10 }}
                {...provided.dragHandleProps}
              >
                <ProjectTaskIcon
                  fontSize={isXlSmaller ? "small" : "medium"}
                  sx={{ color: "grey.A200" }}
                />
              </IconButton>
            </Stack>

            {children}
          </Box>
        );
      }}
    </Draggable>
  );
};

export default memo(DraggableTask);
