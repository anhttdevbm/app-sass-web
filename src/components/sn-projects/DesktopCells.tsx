import { Stack } from "@mui/material";
import Avatar from "components/Avatar";
import { Text, Tooltip } from "components/shared";
import { BodyCell } from "components/Table";
import { NS_COMMON } from "constant/index";
import { PROJECT_TASKS_PATH } from "constant/paths";
import { useTranslations } from "next-intl";
import ProjectPlaceholderImage from "public/images/img-logo-placeholder.webp";
import { memo } from "react";
import { Project } from "store/project/reducer";
import { getPath } from "utils/index";
import { Assigner, Saved, SelectStatus } from "./components";

type DesktopCellsProps = {
  item: Project;
  order: number;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const { item, order } = props;
  const commonT = useTranslations(NS_COMMON);

  return (
    <>
      <BodyCell align="center">{order}</BodyCell>
      <BodyCell
        href={getPath(PROJECT_TASKS_PATH, undefined, { id: item.id })}
        align="left"
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar size={32} src={item.avatar ?? ProjectPlaceholderImage} />
          <Text
            paddingLeft="10px"
            align="left"
            variant="body2"
            color="text.primary"
            fontWeight={600}
            lineHeight={1.28}
          >
            <Tooltip title={item.name} placement="bottom-start" aria-label="Project Name">
              <span
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'inline-block',
                  maxWidth: '200px',
                }}
              >
                {item.name}
              </span>
            </Tooltip>
          </Text>
        </Stack>
      </BodyCell>
      <BodyCell align="left" sx={{ paddingLeft: 0 }}>
        <Assigner
          value={item?.owner?.id}
          id={item.id}
          rootSx={{ "& > svg": { display: "none" } }}
          placeholder={item?.owner ? "" : commonT("form.title.noAssigner")}
        />
      </BodyCell>
      {item.status ? (
        <BodyCell align="center">
          <SelectStatus value={item.status} id={item.id} />
        </BodyCell>
      ) : (
        <BodyCell />
      )}
      <BodyCell align="center">
        <Saved id={item.id} value={item.saved} />
      </BodyCell>
    </>
  );
};

export default memo(DesktopCells);
