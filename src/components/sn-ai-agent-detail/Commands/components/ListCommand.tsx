import { Box, Stack } from "@mui/material";
import { Text } from "components/shared";
import { PRIMARY_GRADIENT_COLOR } from "components/sn-ai-agent/components";
import CompassIcon from "icons/CompassIcon";
import CheckIcon from "icons/CheckIcon";
import KnowledgeIcon from "icons/KnowledgeIcon";
import { Command } from "store/aiAgent/types";

interface ListCommandProps {
  list: Command[];
}

export const ListCommand = ({ list }: ListCommandProps) => {
  return (
    <Box overflow={"auto"} height={"100%"}>
      {list.length > 0 &&
        list.map((command, index) => {
          const listOptions = {
            webSearch: {
              icon: (
                <CompassIcon
                  style={{color: command.web_search ? "#43BC6A" : "#3333"}}
                />
              ),
              name: "Web Search",
            },
            backgroundTask: {
              icon: (
                <CheckIcon
                  style={{color: command.background_task ? "#43BC6A" : "#3333"}}
                />
              ),
              name: "Background Task",
            },
            useKnowledge: {
              icon: (
                <KnowledgeIcon
                  style={{color: command.knowledge ? "#43BC6A" : "#3333"}}
                />
              ),
              name: "Use Knowledge",
            },
          };
          return (
            <Box
              key={index}
              sx={{
                position: "relative",
                borderRadius: "1em",
                overflow: "hidden",
                marginBottom: "16px",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  backgroundImage: PRIMARY_GRADIENT_COLOR,
                  border: "2px solid transparent",
                  backgroundClip: "border-box",
                  zIndex: -1,
                },
              }}
            >
              <Stack
                bgcolor={"background.default"}
                direction={"column"}
                spacing={"4px"}
                padding={"12px 16px"}
                sx={{
                  backgroundColor: "background.default",
                }}
              >
                <Text
                  fontSize={"13px"}
                  fontWeight={600}
                  whiteSpace={"nowrap"}
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                >
                  {command.name}
                </Text>
                <Text
                  fontSize={"13px"}
                  fontWeight={400}
                  color={"grey.300"}
                  whiteSpace={"nowrap"}
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                >
                  {command.prompt}
                </Text>
                <Stack direction={"row"} spacing={"4px"}>
                  {Object.keys(listOptions).map((key) => (
                    <Stack
                      key={key}
                      direction={"row"}
                      spacing={"4px"}
                      alignItems={"center"}
                      padding={"2px 8px"}
                      borderRadius={"4px"}
                      sx={{
                        background: "#E6E6E6",
                      }}
                    >
                      {listOptions[key].icon}
                      <Text
                        fontSize={"11px"}
                        fontWeight={400}
                        color={"#333333"}
                      >
                        {listOptions[key].name}
                      </Text>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Box>
          );
        })}
    </Box>
  );
};
