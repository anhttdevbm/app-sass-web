import {
  List,
  ListItem,
  ListItemText,
  Stack
} from "@mui/material";
import Avatar from "components/Avatar";
import { Search } from "components/Filters";
import { IconButton, Text } from "components/shared";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import LinkBudgetIcon from "icons/LinkBudgetIcon";
import LinkBudgetIconMap from "icons/LinkBudgetIconMap";
import { memo, useEffect, useMemo, useState } from "react";
import { Budgets, Service } from "store/billing/reducer";
import { formatNumber } from "utils/index";
import PopoverLayout from "./PopoverLayout";

type IProps = {
  arrBudgets?: Budgets[];
  service: Service;
  arrServices?: Service[];
  handleChangeValue: (
    id: string,
    keyObj: string,
    value: string | number | null,
  ) => void;
};
const LinkPopup = (props: IProps) => {
  const { arrBudgets, service, arrServices, handleChangeValue } = props;

  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [dense, setDense] = useState(false);

  const onChangeValue = (e) => {
    setSelectedBudget(e.target.value);
  };

  const findBudget = useMemo(() => {
    const dataBudget = arrBudgets?.find(
      (item) => item?.id === service.budgetId,
    );
    return dataBudget;
  }, [arrBudgets]);

  const findServiceInBudget = useMemo(() => {
    const data = arrServices?.filter(
      (item) => item?.budgetId === findBudget?.id,
    );
    return data;
  }, [arrServices, findBudget]);

  useEffect(() => {
    setSelectedBudget(service?.budgetId);
  }, [service]);

  const onSearch = (value) => {
    console.log(value);
  };

  const onLinkBudget = (data: Service) => {
    if (data && data.budgetId && data.budgetId !== "") {
      handleChangeValue(data?.id, "budgetId", null);
    }
  };

  return (
    <>
      <PopoverLayout
        // eslint-disable-next-line react/no-children-prop
        children={
          <>
            <Stack gap={2} p={2}>
              <Search
                placeholder="Tìm kiếm"
                name="search_key"
                onEnter={(name, value) => {
                  onSearch(value);
                }}
                // onChange={(name, value) => {

                // }}
              />
              <hr style={{ width: "100%", border: "1px solid #ECECF3" }} />
              {/* <Select
                options={OptionBudget ?? []}
                searchProps={{
                  placeholder: "Select service or expense",
                }}
                placeholder="Chọn"
                inputMode="search"
                value={selectedBudget}
                onChange={(event) => onChangeValue(event)}
                // disabled
                rootSx={sxConfig.input}
                fullWidth
                showSubText
              /> */}
              {service.budgetId && (
                <>
                  <Stack direction={"row"} gap={1} alignItems={"center"}>
                    <Avatar size={30} src={""} />
                    <Text variant={"body1"}>{findBudget?.name}</Text>
                  </Stack>
                  <List dense={dense}>
                    {findServiceInBudget &&
                      findServiceInBudget?.map((item) => {
                        return (
                          <ListItem key={item?.id} sx={{ padding: "2px 0px" }}>
                            <ListItemText
                              primary={
                                item?.name +
                                " : " +
                                formatNumber(item?.price, {
                                  // suffix: CURRENCY_CODE.USD,
                                  numberOfFixed: 2,
                                  prefix: CURRENCY_SYMBOL.USD,
                                })
                              }
                              // secondary={secondary ? 'Secondary text' : null}
                            />
                          </ListItem>
                        );
                      })}
                  </List>{" "}
                  <Text
                    variant={"body1"}
                    color={"#1BC5BD"}
                    onClick={() => {
                      onLinkBudget(service);
                    }}
                  >
                    Unlink
                  </Text>
                </>
              )}
            </Stack>
          </>
        }
        label={
          service?.budgetId && service?.budgetId !== "" ? (
            <Text variant={"body1"}>
              <IconButton>
                <LinkBudgetIconMap width={20} />
              </IconButton>
            </Text>
          ) : (
            <Text variant={"body1"}>
              <IconButton sx={{ color: "red" }}>
                <LinkBudgetIcon width={20} htmlColor="red" />
              </IconButton>
            </Text>
          )
        }
      />
    </>
  );
};
const sxConfig = {
  input: {
    height: 56,
  },
};
export default memo(LinkPopup);
