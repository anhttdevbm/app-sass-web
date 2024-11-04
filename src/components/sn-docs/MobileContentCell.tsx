import { Stack } from "@mui/material";
import Avatar from "components/Avatar";
import { Text } from "components/shared";
import { BodyCell } from "components/Table";
import { DOCS_API_URL } from "constant/index";
import { useRouter } from "next-intl/client";
import { memo } from "react";
import { useDispatch } from "react-redux";
import axiosBaseQuery from "store/axiosBaseQuery";
import { setContentRow } from "store/docs/reducer";
import { formatDate } from "utils/index";

type MobileContentCellProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
};

const MobileContentCell = (props: MobileContentCellProps) => {
  const { item } = props;
  const { push } = useRouter();
  const dispatch = useDispatch();
  const api = axiosBaseQuery({ baseUrl: DOCS_API_URL });
  return (
    <>
      <BodyCell align="left" sx={{ px: "10px" }}>
        <div
          style={{ cursor: "pointer" }}
          // onClick={async () => {
          //   const result: any = await api(
          //     {
          //       url: `/docs/detail/${item.id}`,
          //       method: "GET",
          //       //@ts-ignore
          //     },
          //     {},
          //     {},
          //   );
          //   if (result.error) {
          //     console.error("Error:", result.error);
          //   } else {
          //     await dispatch(setContentRow(result?.data?.content));
          //     push(`/documents/${item.id}`);
          //   }
          // }}
        >
          <Text fontWeight={600} fontSize={12}>
            {item?.name}
          </Text>
        </div>
      </BodyCell>
      <BodyCell>
        <Text fontWeight={400} fontSize={12}>
          {formatDate(item.created_time)}
        </Text>
      </BodyCell>
      <BodyCell>
        <Text fontWeight={600} fontSize={12}>
          {formatDate(item.updated_time)}
        </Text>
      </BodyCell>
      <BodyCell sx={{ py: "10px" }} align="center">
        {item?.created_by?.id ? (
          <Stack
            justifyContent={"center"}
            direction="row"
            alignItems="center"
            spacing={1}
          >
            <Avatar size={24} src={item.created_by?.avatar} />
            <Stack
              justifyContent={"start"}
              alignItems={"start"}
              direction={"column"}
            >
              <Text fontWeight={600} fontSize={12}>
                {item.created_by?.fullname}
              </Text>
              <Text fontWeight={400} fontSize={12}>
                {item?.created_by?.position?.name}
              </Text>
            </Stack>
          </Stack>
        ) : null}
      </BodyCell>
    </>
  );
};

export default memo(MobileContentCell);
