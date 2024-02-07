/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Box,
  ButtonBase,
  Grow,
  MenuItem,
  MenuList,
  popoverClasses,
  Popper,
  Stack,
  TableRow,
  Typography,
} from "@mui/material";
import Avatar from "components/Avatar";
import { IconButton, Text } from "components/shared";
import { BodyCell, CellProps, TableLayout } from "components/Table";
import { NS_BUDGETING, NS_COMMON } from "constant/index";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import EditIcon from "icons/EditIcon";
import moment from "moment";
import { useTranslations } from "next-intl";
import { useBudgetTimeRemove } from "queries/budgeting/time-range";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useSnackbar } from "store/app/selectors";
import { formatNumber, getMessageErrorByAPI, toHoursAndMinutes } from "utils/index";
import MoreDotIcon from "../../../icons/MoreDotIcon";
import TrashIcon from "../../../icons/TrashIcon";
import { budgetDetailRef } from "../BudgetDetail";
import _ from "lodash";

export type TTimeRanges = {
  id: string;
  docId: string;
  service: string;
  date: string;
  createdAt: string;
  name: string;
  person: {
    fullname: string;
    avatar: string;
  };
  note: string;
  timeRanges: number;
  billableTime: number;
  startTime: string | null;
  endTime: string | null;
  index?: number;
};

export type TForm = {
  times: TTimeRanges[];
};

interface Props {
  timeList: TTimeRanges[];
  selectedTime?: TTimeRanges | null;
  refetch: () => void;
}

export const Time = ({
  selectedTime,
  timeList = [],
  refetch = () => {},
}: Props) => {
  const { onAddSnackbar } = useSnackbar();
  const removeTimeRange = useBudgetTimeRemove();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const budgetT = useTranslations(NS_BUDGETING);
  const commonT = useTranslations(NS_COMMON);

  const { control, setValue } = useForm<TForm>();
  const { fields, remove } = useFieldArray({
    name: "times",
    control,
  });

  const headerList: CellProps[] = useMemo(() => {
    const totalTime: any = toHoursAndMinutes(
      _.reduce(
        timeList || [],
        (total: number, timeItem: TTimeRanges) =>
          total + timeItem.timeRanges * 60,
        0,
      ),
    );

    const totalBillable: any = toHoursAndMinutes(
      _.reduce(
        timeList || [],
        (total: number, timeItem: TTimeRanges) =>
          total + timeItem.billableTime * 60,
        0,
      ),
    );

    return [
      { value: "", align: "center", width: "10%" },
      { value: budgetT("tabTime.service"), align: "center", width: "20%" },
      { value: budgetT("tabTime.person"), align: "center", width: "20%" },
      { value: budgetT("tabTime.notes"), align: "center", width: "20%" },
      {
        value: budgetT("tabTime.time"),
        align: "center",
        data: `${totalTime.hours < 1 ? "00" : totalTime.hours}:${
          totalTime.minutes < 1 ? "00" : totalTime.minutes
        }`,
        width: "10%",
      },
      {
        value: budgetT("tabTime.billable"),
        align: "center",
        data: `${totalBillable.hours < 1 ? "00" : totalBillable.hours}:${
          totalBillable.minutes < 1 ? "00" : totalBillable.minutes
        }`,
        width: "15%",
      },
      { value: "", align: "center", width: "5%" },
    ];
  }, [timeList]);

  const refClickOutSide = useOnClickOutside(() => setAnchorEl(null));

  useEffect(() => {
    const times: TTimeRanges[] = _.map(timeList, (doc, index) => {
      return {
        index: index,
        id: doc.id,
        docId: doc.id,
        createdAt: doc?.createdAt,
        date: doc?.date,
        note: doc?.note,
        service: _.get(doc, "services.id", ""),
        timeRanges: doc.timeRanges,
        billableTime: doc.billableTime,
        name: _.get(doc, "services.name", ""),
        person: {
          avatar: _.get(doc, "created_by.avatar.link", ""),
          fullname: _.get(doc, "created_by.fullname", ""),
        },
      } as any;
    });

    setValue("times", times);
  }, [timeList]);

  const handleRemoveTimeRange = async () => {
    removeTimeRange.mutateAsync(_.get(selectedTime, "docId", ""), {
      onSuccess() {
        onAddSnackbar("Success", "success");
        remove(_.get(selectedTime, "index"));
        setAnchorEl(null);
        refetch();
      },
      onError(error) {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      },
    });
  };

  return (
    <>
      <TableLayout headerList={headerList} noData={false} titleColor="grey.300">
        {fields.map((data, index) => {
          return (
            <TableRow key={`budget-time-${index}`}>
              <BodyCell sx={{ textAlign: "center" }}>
                {`${moment(data.createdAt).format("DD MMM")}`}
                <br></br>
                {`${moment(data.createdAt).format("hh:mm")}`}
              </BodyCell>
              <BodyCell sx={{ textAlign: "center" }}>{data.name}</BodyCell>
              <BodyCell
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Avatar src={_.get(data, "person.avatar", "")} size={20} />
                <Typography ml={1}>
                  {_.get(data, "person.fullname", "")}
                </Typography>
              </BodyCell>
              <BodyCell sx={{ textAlign: "center" }}>
                {_.get(data, "note", "")}
              </BodyCell>
              <BodyCell sx={{ textAlign: "center" }}>
                {formatNumber(_.get(data, "timeRanges", ""), { numberOfFixed: 2 })}
              </BodyCell>
              <BodyCell sx={{ textAlign: "center" }}>
                {formatNumber(_.get(data, "billableTime", ""), { numberOfFixed: 2 })}
              </BodyCell>
              <BodyCell sx={{ p: 0 }}>
                <IconButton
                  noPadding
                  onClick={(e) => {
                    if (Boolean(anchorEl)) {
                      budgetDetailRef.current?.setSelectedTimeData(null);
                      setAnchorEl(null);
                    } else {
                      budgetDetailRef.current?.setSelectedTimeData(data);
                      setAnchorEl(e.currentTarget);
                    }
                  }}
                >
                  <MoreDotIcon fontSize="medium" sx={{ color: "grey.300" }} />
                </IconButton>
              </BodyCell>
            </TableRow>
          );
        })}

        <Popper
          ref={refClickOutSide}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          sx={{
            [`& .${popoverClasses.paper}`]: {
              backgroundImage: "white",
              minWidth: 150,
              maxWidth: 250,
            },
            zIndex: 1000,
          }}
          transition
          placement={"bottom-end"}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} timeout={350}>
              <Stack
                py={2}
                sx={{
                  boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.2)",
                  border: "1px solid",
                  borderTopWidth: 0,
                  borderColor: "grey.100",
                  borderRadius: 1,
                  bgcolor: "background.paper",
                }}
              >
                <MenuList component={Box} sx={{ py: 0 }}>
                  <MenuItem
                    onClick={() => {
                      budgetDetailRef.current?.openModalTime();
                    }}
                    component={ButtonBase}
                    sx={{ width: "100%", py: 1, px: 2 }}
                  >
                    <EditIcon sx={{ color: "grey.400" }} fontSize="medium" />
                    <Text ml={2} variant="body2" color="grey.400">
                      {budgetT("tabTime.edit")}
                    </Text>
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleRemoveTimeRange()}
                    component={ButtonBase}
                    sx={{ width: "100%", py: 1, px: 2 }}
                  >
                    <TrashIcon color="error" fontSize="medium" />
                    <Text ml={2} variant="body2" color="error.main">
                      {budgetT("tabTime.delete")}
                    </Text>
                  </MenuItem>
                </MenuList>
              </Stack>
            </Grow>
          )}
        </Popper>
      </TableLayout>
    </>
  );
};
