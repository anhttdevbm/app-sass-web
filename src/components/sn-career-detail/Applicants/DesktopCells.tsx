import { memo, useState } from "react";
import { BodyCell, StatusCell } from "components/Table";
import { DATE_TIME_FORMAT_SLASH, NS_COMPANY, NS_MANAGER,　ACCESS_TOKEN_STORAGE_KEY } from "constant/index";
import { formatDate } from "utils/index";
import { Stack, Link, Tooltip,　IconButton } from "@mui/material";
import { IApplicant } from "constant/types";
import LinkIcon from "icons/LinkIcon";
import DownloadIcon from "icons/DownloadIcon";
import { NS_APPLICANTS } from "constant/index";
import { useTranslations } from "next-intl";
import Preview, { TitlePreview } from "components/Preview";
import { downloadImage,　copyImage } from "utils/index";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import { DataAction } from "constant/enums";
import Form from "./components/Form";
import { clientStorage } from "utils/storage";
import { useCareer } from "store/career/selectors";
import { ApplicantData } from "store/career/action";

type DesktopCellsProps = {
  item: IApplicant;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const { item: detailItem, onRespondToApplicant} = useCareer();
  const [item, setItem] = useState<IApplicant>();
  const [action, setAction] = useState<DataAction | undefined>();
  const applicantsT = useTranslations(NS_APPLICANTS);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedImageData, setSelectedImageData] = useState({
    type: "",
    src: "",
    name: "",
  });

  const onActionToItem = (action: DataAction, item?: IApplicant) => {
    return () => {
      if (action === DataAction.DELETE) {
        console.log(props.item);
      } else {
        item && setItem(props.item);
      }
      setAction(action);
    };
  };

  const onResetAction = () => {
    setAction(undefined);
  }

  const handleOpenPreview = (src, name) => {
    const type = name.split(".").pop()
    setSelectedImageData({ type, src, name });
    setOpenPreview(true);
  }

  const handleClosePreview = () => {
    setOpenPreview(false);
  }

  const onResponsedContent = async (data: ApplicantData) => {
    if (!item) return; // Nếu item là undefined, thoát khỏi hàm
    // console.log(data);
    const accessToken = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);
    return await onRespondToApplicant(data, accessToken);
  };

  return (
    <>
      <BodyCell align="left" noWrap>
        {props.item.first_name}
      </BodyCell>
      <BodyCell align="left" noWrap>
        {props.item.last_name}
      </BodyCell>
      <BodyCell align="left" noWrap>
        {formatDate(props.item.birth)}
      </BodyCell>
      <BodyCell align="left" noWrap>
        {props.item.gender}
      </BodyCell>
      <BodyCell align="center" noWrap>
        { props.item.resume_down &&
          (
            <>
              <IconButton
                color="primary"
                size="large"
                onClick={() => handleOpenPreview(props.item.resume_down.link,　props.item.resume_down.name)}
                >
                <DownloadIcon />
              </IconButton>
              <Preview
                open={openPreview}
                onClose={handleClosePreview}
                type={selectedImageData.type as string}
                src={selectedImageData.src as string}
                titleProps={{
                  children: (
                    <TitlePreview
                      time={""}
                      onClose={() => handleClosePreview()}
                      onCopy={() => copyImage(selectedImageData.src || "")}
                      onDownloadFile={() =>
                        downloadImage(
                          selectedImageData.src || "",
                          selectedImageData.name || "",
                        )
                      }
                    />
                  ),
                }}
              />
            </>
          )
        }
      </BodyCell>
      <BodyCell align="center" noWrap>
        <Link
          href={props.item.socialLink}
          sx={{
            textDecoration: "none",
            display: "flex",
            justifyContent: "center"
          }}
          target="_blank"
        >
          <LinkIcon sx={{ color: "#1BC5BD", mr: 1 }} />
        </Link>
      </BodyCell>
      <BodyCell align="center" noWrap>
        <Tooltip title={applicantsT("applicants.information.note")}>
          <IconButton color="primary" size="large" onClick={onActionToItem(DataAction.UPDATE, props.item)} >
            <ForwardToInboxIcon />
          </IconButton>
        </Tooltip>
      </BodyCell>
      <BodyCell align="left" noWrap>
      </BodyCell>
      {action === DataAction.UPDATE && (
        <Form
          open
          onClose={onResetAction}
          type={DataAction.UPDATE}
          initialValues={
            {
              jobpostId: detailItem?.id,
              applicantId: props.item?.id,
              phone: props.item?.phone,
              email: props.item?.email,
              subject: "",
              content: "",
              responsed_content: "",
              forward_email: [],
            } as ApplicantData
          }
          onSubmit={onResponsedContent}
        />
      )}
    </>
  );
};

export default memo(DesktopCells);
