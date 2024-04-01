import { memo, useState } from "react";
import { Text } from "components/shared";
import { formatDate } from "utils/index";
import { BodyCell } from "components/Table";
import { NS_APPLICANTS, ACCESS_TOKEN_STORAGE_KEY } from "constant/index";
import { useTranslations } from "next-intl";
import { IApplicant } from "constant/types";
import { Stack, Link, Tooltip,　IconButton } from "@mui/material";
import Preview, { TitlePreview } from "components/Preview";
import { downloadImage,　copyImage } from "utils/index";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import { DataAction } from "constant/enums";
import DownloadIcon from "icons/DownloadIcon";
import LinkIcon from "icons/LinkIcon";
import Form from "./components/Form";
import { clientStorage } from "utils/storage";
import { useCareer } from "store/career/selectors";
import { ApplicantData } from "store/career/action";

type MobileContentCellProps = {
  item: IApplicant;
};

type InformationItemProps = {
  label: string;
  children?: string | React.ReactNode;
};

const MobileContentCell = (props: MobileContentCellProps) => {
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
  const applicantT = useTranslations(NS_APPLICANTS);
  return (
    <BodyCell align="left" sx={{ px: 0.5 }}>
      <Stack spacing={2} py={1.5}>
        <InformationItem label={applicantT("applicants.information.first_name")}>
          <Text>{props.item.first_name}</Text>
        </InformationItem>
        <InformationItem label={applicantT("applicants.information.last_name")}>
          <Text>{props.item.last_name}</Text>
        </InformationItem>
        <InformationItem label={applicantT("applicants.information.email")}>
          <Text>{props.item.email}</Text>
        </InformationItem>
        <InformationItem label={applicantT("applicants.information.birth")}>
          <Text>{formatDate(props.item.birth)}</Text>
        </InformationItem>
        <InformationItem label={applicantT("applicants.information.gender")}>
          <Text>{props.item.gender}</Text>
        </InformationItem>
        <InformationItem label={applicantT("applicants.information.resume_down")}>
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
        </InformationItem>
        <InformationItem label={applicantT("applicants.information.social_link")}>
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
        </InformationItem>
        <InformationItem label={applicantT("applicants.information.note")}>
          <Tooltip title={applicantsT("applicants.information.note")}>
            <IconButton color="primary" size="large" onClick={onActionToItem(DataAction.UPDATE, props.item)} >
              <ForwardToInboxIcon />
            </IconButton>
          </Tooltip>
        </InformationItem>
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
      </Stack>
    </BodyCell>
  );
};

export default memo(MobileContentCell);

const InformationItem = (props: InformationItemProps) => {
  const { label, children = "--" } = props;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Text variant="caption" color="grey.400" width={100}>
        {label}
      </Text>

      {typeof children === "string" ? (
        <Text variant="body2" color="text.primary" noWrap>
          {children}
        </Text>
      ) : (
        children
      )}
    </Stack>
  );
};
