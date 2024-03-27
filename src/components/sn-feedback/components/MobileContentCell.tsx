import { Chip, Stack, Tooltip } from "@mui/material";
import { BodyCell } from "components/Table";
import { IconButton, Text } from "components/shared";
import { memo, useState } from "react";
import { ACCESS_TOKEN_STORAGE_KEY, NS_FEEDBACK } from "constant/index";
import { useTranslations } from "next-intl";
import { FeedbackData } from "store/feedback/actions";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import { DataAction } from "constant/enums";
import Form from "./Form";
import { clientStorage } from "utils/storage";
import { useFeedback } from "store/feedback/selectors";

type MobileContentCellProps = {
  item: FeedbackData;
};
type InformationItemProps = {
  label: string;
  children?: string | React.ReactNode;
};

const MobileContentCell = (props: MobileContentCellProps) => {
  const feedbackT = useTranslations(NS_FEEDBACK);
  const { onRespondToFeedback } = useFeedback();
  const [item, setItem] = useState<FeedbackData>();
  const [action, setAction] = useState<DataAction | undefined>();

  const onActionToItem = (action: DataAction, item?: FeedbackData) => {
    return () => {
      if (action === DataAction.DELETE) {
        //Không Có chức năng này
        console.log(props.item);
      } else {
        item && setItem(props.item);
        // console.log(action);
      }
      setAction(action);
    };
  };

  const onResetAction = () => {
    setAction(undefined);
  };

  const onResponsedContent = async (data: FeedbackData) => {
    if (!item) return; // Nếu item là undefined, thoát khỏi hàm
    // console.log(data);
    const accessToken = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);
    return await onRespondToFeedback(data.id as string, data, accessToken);
    return 200;
  };

  return (
    <BodyCell align="left">
      <Stack spacing={2} py={1.5}>
        <InformationItem label={feedbackT("feedbackTable.topic")}>
          <Text>{props.item.topic}</Text>
        </InformationItem>
        <InformationItem label={feedbackT("feedbackTable.phone")}>
          {props.item.phone}
        </InformationItem>
        <InformationItem label={feedbackT("feedbackTable.email")}>
          {props.item.email}
        </InformationItem>
        <InformationItem label={feedbackT("feedbackTable.title")}>
          {props.item.title}
        </InformationItem>
        <InformationItem label={feedbackT("feedbackTable.content")}>
          {props.item.content}
        </InformationItem>
        <InformationItem label={feedbackT("feedbackTable.status")}>
          {props.item.status === "WATTING_RESPONSE" ? (
            <Chip
              size="small"
              label={feedbackT("feedbackTable.statusList.watting_response")}
              color="primary"
            />
          ) : (
            <Chip
              size="small"
              label={feedbackT("feedbackTable.statusList.responsed")}
              color="success"
            />
          )}
          <BodyCell align="left">
            {props.item.status === "WATTING_RESPONSE" ? (
              <Tooltip title={feedbackT("feedbackTable.editResponsed")}>
                <IconButton color="primary" size="large" onClick={onActionToItem(DataAction.UPDATE, props.item)}>
                  <ForwardToInboxIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <></>
            )}
          </BodyCell>
          {action === DataAction.UPDATE && (
            <Form
              open
              onClose={onResetAction}
              type={DataAction.UPDATE}
              initialValues={
                {
                  id: props.item?.id,
                  name: props.item?.name,
                  phone: props.item?.phone,
                  email: props.item?.email,
                  title: props.item?.title,
                  content: props.item?.content,
                  status: props.item?.status,
                  created_time: props.item?.created_time,
                  responsed_by: props.item?.responsed_by,
                  responsed_content: props.item?.responsed_content,
                  responsed_time: props.item?.responsed_time,
                  forward_email: props.item?.forward_email ?? [],
                } as FeedbackData
              }
              onSubmit={onResponsedContent}
            />
          )}
        </InformationItem>
      </Stack>
    </BodyCell>
  );
};

export default memo(MobileContentCell);

const InformationItem = (props: InformationItemProps) => {
  const { label, children = "--" } = props;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Text variant="caption" color="grey.400" width={57}>
        {label}
      </Text>
      {typeof children === "string" ? (
        <Text variant="body2" noWrap>
          {children}
        </Text>
      ) : (
        children
      )}
    </Stack>
  );
};
