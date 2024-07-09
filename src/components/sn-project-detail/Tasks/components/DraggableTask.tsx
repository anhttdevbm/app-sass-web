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
type DraggableTaskProps = {
  id: string;
  index: number;
  checked: boolean;
  isSubTask: boolean;
  onChange: () => void;
  children: React.ReactNode;
  isHide: boolean;
  isHovered: boolean;
  setHideIds: Dispatch<SetStateAction<string[]>>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
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
    isHovered,
    isSubTask,
    setHideIds,
    task,
    ...rest
  } = props;

  const { isXlSmaller } = useBreakpoint();

  const isMobile = useMemo(() => checkIsMobile(), []);

  const [isToggle, setIsToggle] = useState<boolean>(false);

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
        if (snapshot.isDragging) setIsToggle(true);
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
                "border-bottom": "1px solid",
                borderColor: {
                  xs: "background.paper",
                },
                content: "''",
                width: "100%",
                height: "1px",
                boxShadow: 1,
              },
              "&:hover": {
                backgroundColor: "rgba(236, 236, 243, 0.5)",
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
