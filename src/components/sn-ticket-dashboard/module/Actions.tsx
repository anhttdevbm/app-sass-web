import { NS_TICKET } from "constant/index";
import { useTranslations } from "next-intl";
import { memo, useState } from "react"
import FilterSearchDocs from "../FilterSearchDocs/FilterSearchDocs";
import { Stack } from "@mui/material";
import { Text } from "components/shared";



const Actions = () => {
  const t = useTranslations(NS_TICKET);

  const [queries, setQueries] = useState<any>({});
  const onChangeQueries = (name: string, value: any) => {
    setQueries((prevQueries) => ({ ...prevQueries, [name]: value }));

  };


  return (
    <>
      <Stack direction={{ xs: "column", sm: "row", md: "row" }}>
        <Stack flex={{ xs: 2, sm: 7, md: 7 }}>
          <Text
            fontSize={25}
            color={"#4D4D4D"}
            fontWeight={600}
          >
            {t("dashboard.title")}
          </Text>
        </Stack>
        <Stack
          flex={{ xs: 8, sm: 3, md: 3 }}
          direction={{ xs: "column", sm: "row", md: "row" }}
          alignItems="center"
          justifyContent="flex-start"
          width={{ xs: "100%", sm: "fit-content", md: "fit-content" }}
          spacing={3}
          py={{ xs: 1.25, md: 1, lg: 1.25 }}
          px={{ xs: 0, md: 2, lg: 2 }}
          overflow="auto"
          sx={{
            '&::-webkit-scrollbar': {
              display: "none"
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <FilterSearchDocs queries={queries} onChange={onChangeQueries} />

        </Stack>
      </Stack>
    </>
  )
}

export default memo(Actions)