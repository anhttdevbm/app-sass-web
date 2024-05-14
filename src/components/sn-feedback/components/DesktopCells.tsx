import { AddIcCallOutlined } from "@mui/icons-material";
import { Chip, Fab, IconButton, Tooltip } from "@mui/material";
import { BodyCell } from "components/Table";
import { ACCESS_TOKEN_STORAGE_KEY, NS_FEEDBACK } from "constant/index";
import { useTranslations } from "next-intl";
import { memo, useState } from "react";
import { FeedbackData } from "store/feedback/actions";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import SendIcon from '@mui/icons-material/Send';
import { DataAction } from "constant/enums";
import Form from "./Form";
import { useFeedback } from "store/feedback/selectors";
import { clientStorage } from "utils/storage";

type DesktopCellsProps = {
  item: FeedbackData;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const { onRespondToFeedback} = useFeedback();
  const feedbackT = useTranslations(NS_FEEDBACK);
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
    // console.log(accessToken);
    // return 200;
  };

  return (
    <>
      <BodyCell align="left">{props.item.topic}</BodyCell>
      <BodyCell align="left">{props.item.phone}</BodyCell>
      <BodyCell align="left">{props.item.email}</BodyCell>
      <BodyCell align="left">{props.item.title}</BodyCell>
      <BodyCell align="left">{props.item.content}</BodyCell>
      {/* <BodyCell align="left">{item.responsed_content}</BodyCell> */}
      <BodyCell align="left">
        {props.item.status === "WATTING_RESPONDE" ? (
          <Chip
            size="small"
            label={feedbackT("feedbackTable.statusList.watting_responde")}
            color="primary"
          />
        ) : (
          <Chip
            size="small"
            label={feedbackT("feedbackTable.statusList.responded")}
            color="success"

          />
        )}
      </BodyCell>
      <BodyCell align="left">
        {props.item.status === "WATTING_RESPONSE" ? (
          <Tooltip title={feedbackT("feedbackTable.statusList.watting_responde")}>
            <IconButton color="primary" size="large" onClick={onActionToItem(DataAction.UPDATE, props.item)} >
              <ForwardToInboxIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title={feedbackT("feedbackTable.statusList.responded")}>
            <IconButton color="primary" size="large" >
              <SendIcon />
            </IconButton>
          </Tooltip>
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
              response_cc: props.item?.response_cc ?? [],
              response_bcc: props.item?.response_bcc ?? [],
            } as FeedbackData
          }
          onSubmit={onResponsedContent}
        />
      )}
    </>
  );
};
export default memo(DesktopCells);
