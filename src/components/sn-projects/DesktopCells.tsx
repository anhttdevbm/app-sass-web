import { memo } from "react";
import { BodyCell } from "components/Table";
import { Project } from "store/project/reducer";
import { getPath } from "utils/index";
import { PROJECT_TASKS_PATH } from "constant/paths";
import { formatDate } from "utils/index";
import Avatar from "components/Avatar";
import { Stack } from "@mui/material";
import { Text } from "components/shared";
import ProjectPlaceholderImage from "public/images/img-logo-placeholder.webp";
import { Saved, SelectStatus, Assigner } from "./components";
import { useTranslations } from "next-intl";
import { NS_COMMON, DATE_LOCALE_FORMAT} from "constant/index";
import dayjs from "dayjs";
import DatePicker from "./components/DatePicker";

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
          <Avatar
            size={32}
            src={item.avatar?.link ?? ProjectPlaceholderImage}
          />
          <Text
            variant="body2"
            color="text.primary"
            fontWeight={600}
            lineHeight={1.28}
            sx={{ "&:hover": { color: "primary.main" } }}
          >
            {item.name}
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
