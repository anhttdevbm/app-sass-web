"use client";

import React, { memo, useEffect, useState } from "react";
import { Box, Stack, StackProps } from "@mui/material";
import { Button, Text } from "components/shared";
import { useProject, useProjectAttachment } from "store/project/selectors";
import TextStatus from "components/TextStatus";
import {
  COLOR_STATUS,
  TEXT_STATUS,
  ATTACHMENT_TYPE,
} from "components/sn-projects/components/helpers";
import { formatBytes, formatDate, formatNumber } from "utils/index";
import Avatar from "components/Avatar";
import StatusServer from "components/StatusServer";
import { NS_COMMON, NS_PROJECT } from "constant/index";
import { useTranslations } from "next-intl";
import useBreakpoint from "hooks/useBreakpoint";
import ArrowTriangleIcon from "icons/ArrowTriangleIcon";
import ProjectPlaceholderImage from "public/images/img-logo-placeholder.webp";
import FixedLayout from "components/FixedLayout";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import FilePdfIcon from "../../../icons/FilePdfIcon";
import FileDocIcon from "../../../icons/FileDocIcon";
import FileExcelIcon from "../../../icons/FileExcelIcon";
import FileIcon from "../../../icons/FileIcon";
import { useParams } from "next/navigation";
import { FILE_ACCEPT, IMAGES_ACCEPT } from "constant/index";
import Link from "@mui/material/Link";
import Preview, { TitlePreview } from "components/Preview";
import { copyImage, downloadImage } from "utils/index";
import { MediaType, TypeMedia } from "store/chat/media/typeMedia";

type InformationItemProps = StackProps & {
  label: string;
  children?: string | number | React.ReactNode;
  color?: string;
};
export type MediaInfo = MediaType & {
  type: TypeMedia;
};
export type MediaPreview = Partial<MediaInfo> & {
  isPreview: boolean;
};
const InformationProjectPage = () => {
  const { item, isFetching, error } = useProject();
  const { items, onGetProjectAttachment } = useProjectAttachment();
  const params = useParams();
  const { isSmSmaller } = useBreakpoint();
  useEffect(() => {
    onGetProjectAttachment(params.id);
  }, [onGetProjectAttachment, params.id]);
  return (
    <StatusServer isFetching={isFetching} error={error} noData={!item}>
      <FixedLayout flex={1}>
        <Stack p={{ xs: 1, sm: 3 }} spacing={3}>
          {isSmSmaller ? (
            <MobileInformation attachments={items} />
          ) : (
            <DesktopInformation attachments={items} />
          )}
        </Stack>
      </FixedLayout>
    </StatusServer>
  );
};

export default memo(InformationProjectPage);

const DesktopInformation = (props) => {
  const { attachments } = props;
  const { item } = useProject();

  const filtered_images = attachments.filter((attachment) => {
    return attachment.type === "image/jpeg" || attachment.type === "image/png";
  });

  console.log("filtered_images", filtered_images);

  const [openPreview, setOpenPreview] = useState(false);
  const [selectedImageData, setSelectedImageData] = useState({
    type: "",
    src: "",
    name: "",
    listData: [],
  });

  const [mediaPreview, setMediaPreview] = useState<MediaPreview>({
    isPreview: false,
    url: "",
    type: "image_url",
  });

  const handleOpenPreview = (type, src, name, listData) => {
    setSelectedImageData({ type, src, name, listData });
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);
  const [active, setActive] = useState("0");
  const [dataFilter, setDataFilter] = useState(attachments);
  const handleFilterAttachment = (event) => {
    setActive(event.target.id);
    if (event.target.id == ATTACHMENT_TYPE.IMAGE) {
      const filtered = attachments.filter((attachment) => {
        return IMAGES_ACCEPT.indexOf(attachment.type) !== -1;
      });
      setDataFilter(filtered);
    } else if (event.target.id == ATTACHMENT_TYPE.FILE) {
      const filtered = attachments.filter((attachment) => {
        return FILE_ACCEPT.indexOf(attachment.type) !== -1;
      });
      setDataFilter(filtered);
    } else {
      setDataFilter(attachments);
    }
  };
  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: "12px",
    textAlign: "center",
    color: "#000000",
    borderRadius: "4px",
    background: "#F7F7FD",
    height: "70px",
    display: "flex",
    gap: "15px",
  }));

  const fileIcon = (extension, url) => {
    if (
      extension.indexOf(".jpeg") !== -1 ||
      extension.indexOf(".jpg") !== -1 ||
      extension.indexOf("png") !== -1
    ) {
      return (
        <Box
          component="img"
          src={url}
          height="auto"
          width="auto"
          alt="Image"
          sx={{
            maxWidth: "50px",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      );
    } else if (extension == ".docx" || extension == ".doc") {
      return <FileDocIcon sx={{ fontSize: 40 }} />;
    } else if (extension == ".pdf") {
      return <FilePdfIcon sx={{ fontSize: 40 }} />;
    } else if (extension == ".xls" || extension == ".xlsx") {
      return <FileExcelIcon sx={{ fontSize: 40 }} />;
    } else {
      return <FileIcon sx={{ fontSize: 40 }} />;
    }
  };

  const handleChangeSlide = (url) => {
    const info = filtered_images.find((item) => item.url === url);
    setMediaPreview((state) => ({ ...info, isPreview: true }));
  };

  return (
    <>
      <Stack>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar
              src={item?.avatar?.link ?? ProjectPlaceholderImage}
              size={40}
            />

            <Stack>
              <Text variant="h4">{item?.name}</Text>
              <Text variant="h6" color="grey.400">{`#${
                item?.number ?? item?.id
              }`}</Text>
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Text variant="caption" color="grey.400">
              {commonT("status")}
            </Text>
            {item?.status ? (
              <TextStatus
                color={COLOR_STATUS[item.status]}
                text={TEXT_STATUS[item.status]}
              />
            ) : (
              <Text variant="body2">{"--"}</Text>
            )}
          </Stack>
        </Stack>
      </Stack>

      <InformationItem label={commonT("assigner")}>
        {item?.owner?.fullname ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar size={32} src={item?.owner?.avatar?.link} />
            <Text variant="body2">{item?.owner?.fullname ?? "--"}</Text>
          </Stack>
        ) : undefined}
      </InformationItem>
      <Stack direction="row" alignItems="center" spacing={2}>
        <InformationItem label={commonT("form.title.startDate")}>
          {formatDate(item?.start_date, undefined, "--")}
        </InformationItem>
        <ArrowTriangleIcon sx={{ width: 100, color: "grey.400" }} />
        <InformationItem label={commonT("form.title.endDate")}>
          {formatDate(item?.end_date, undefined, "--")}
        </InformationItem>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={{ xs: 2, sm: 16.5 }}>
        <InformationItem
          label={projectT("list.form.title.estimatedWorkingHours")}
          width={170}
        >
          {formatNumber(item?.working_hours)}
        </InformationItem>
        <InformationItem
          color="secondary.main"
          label={projectT("detail.workingHoursActual")}
        >
          {formatNumber()}
        </InformationItem>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={{ xs: 2, sm: 16.5 }}>
        <InformationItem
          label={projectT("list.form.title.estimatedCost")}
          width={170}
        >
          {formatNumber(item?.expected_cost)} {item?.currency}
        </InformationItem>
        <InformationItem
          color="secondary.main"
          label={projectT("detail.costSpent")}
        >
          {formatNumber()}
        </InformationItem>
      </Stack>
      <InformationItem label={commonT("form.title.description")} maxWidth={700}>
        {item?.description || "--"}
      </InformationItem>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        className="attachment-filter"
        style={{
          borderTop: "1px solid #5e5e5e",
          paddingTop: "20px",
        }}
      >
        <Text
          variant="body2"
          sx={{
            fontWeight: "600",
          }}
        >
          {projectT("detail.listFile.title")}
        </Text>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Button
            type="button"
            onClick={handleFilterAttachment}
            variant="primaryOutlined"
            size="small"
            sx={{
              minWidth: "100px",
              borderRadius: "30px",
              minHeight: "32px",
              border: "1px solid #BABCC6",
              color: "#666",
            }}
            id={ATTACHMENT_TYPE.ALL}
            className={active === ATTACHMENT_TYPE.ALL ? "active" : undefined}
          >
            {projectT("detail.listFile.filter.all")}
          </Button>

          <Button
            type="button"
            onClick={handleFilterAttachment}
            variant="primaryOutlined"
            size="small"
            sx={{
              minWidth: "100px",
              borderRadius: "30px",
              minHeight: "32px",
              border: "1px solid #BABCC6",
              color: "#666",
            }}
            id={ATTACHMENT_TYPE.IMAGE}
            className={active === ATTACHMENT_TYPE.IMAGE ? "active" : undefined}
          >
            {projectT("detail.listFile.filter.image")}
          </Button>

          <Button
            type="button"
            onClick={handleFilterAttachment}
            variant="primaryOutlined"
            size="small"
            sx={{
              minWidth: "100px",
              borderRadius: "30px",
              minHeight: "32px",
              border: "1px solid #BABCC6",
              color: "#666",
            }}
            id={ATTACHMENT_TYPE.FILE}
            className={active === ATTACHMENT_TYPE.FILE ? "active" : undefined}
          >
            {projectT("detail.listFile.filter.file")}
          </Button>
        </Stack>
      </Stack>

      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {dataFilter?.length == 0 && (
          <p style={{ margin: "auto" }}>{projectT("detail.listFile.noData")}</p>
        )}
        {dataFilter?.map((data, index) => (
          <Grid
            item
            xs={2}
            sm={4}
            md={4}
            key={index}
            sx={{
              paddingRight: "16px",
            }}
          >
            {["image/jpeg", "image/png"].includes(data.type) ? (
              <Link
                href={data.link}
                style={{ textDecoration: "none" }}
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenPreview(
                    data.type,
                    data.link,
                    data.name,
                    filtered_images,
                  );
                }}
              >
                <Item sx={{ height: "100%" }}>
                  {fileIcon(data.extension, data.link)}
                  <Stack className="description-file">
                    <Text
                      sx={{
                        color: "#000",
                        fontWeight: 500,
                        textAlign: "left",
                        width: "160px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "pre",
                      }}
                    >
                      {data.name}
                    </Text>

                    <Text
                      sx={{
                        color: "#666",
                        fontSize: "12px",
                        fontWeight: 400,
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <span>{formatBytes(data.size)}</span>
                      <span>{formatDate(data.created_time, "HH:mm")}</span>
                      <span>{data.uploaded_by}</span>
                    </Text>
                  </Stack>
                </Item>
              </Link>
            ) : (
              <Link href={data.link} style={{ textDecoration: "none" }}>
                <Item sx={{ height: "100%" }}>
                  {fileIcon(data.extension, data.link)}
                  <Stack className="description-file">
                    <Text
                      sx={{
                        color: "#000",
                        fontWeight: 500,
                        textAlign: "left",
                        width: "160px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "pre",
                      }}
                    >
                      {data.name}
                    </Text>

                    <Text
                      sx={{
                        color: "#666",
                        fontSize: "12px",
                        fontWeight: 400,
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <span>{formatBytes(data.size)}</span>
                      <span>{formatDate(data.created_time, "HH:mm")}</span>
                      <span>{data.uploaded_by}</span>
                    </Text>
                  </Stack>
                </Item>
              </Link>
            )}
          </Grid>
        ))}
        {openPreview && (
          <Preview
            open={openPreview}
            onClose={handleClosePreview}
            type={selectedImageData.type as string}
            src={selectedImageData.src as string}
            listData={selectedImageData.listData}
            listAttachmentsDown={selectedImageData.listData}
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
            onStartChangeSlide={handleChangeSlide}
          />
        )}
      </Grid>
    </>
  );
};

const MobileInformation = (props) => {
  const { attachments } = props;
  const { item } = useProject();

  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);

  const [active, setActive] = useState("0");
  const [dataFilter, setDataFilter] = useState(attachments);

  const handleFilterAttachment = (event) => {
    setActive(event.target.id);
    if (event.target.id == ATTACHMENT_TYPE.IMAGE) {
      const filtered = attachments.filter((attachment) => {
        return IMAGES_ACCEPT.indexOf(attachment.type) !== -1;
      });
      setDataFilter(filtered);
    } else if (event.target.id == ATTACHMENT_TYPE.FILE) {
      const filtered = attachments.filter((attachment) => {
        return FILE_ACCEPT.indexOf(attachment.type) !== -1;
      });
      setDataFilter(filtered);
    } else {
      setDataFilter(attachments);
    }
  };

  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: "12px",
    textAlign: "center",
    color: "#000000",
    borderRadius: "4px",
    background: "#F7F7FD",
    height: "70px",
    display: "flex",
    gap: "15px",
  }));

  const fileIcon = (extension, url) => {
    if (
      extension.indexOf(".jpeg") !== -1 ||
      extension.indexOf(".jpg") !== -1 ||
      extension.indexOf("png") !== -1
    ) {
      return (
        <Box
          component="img"
          src={url}
          height="auto"
          width="auto"
          alt="Image"
          sx={{
            maxWidth: "50px",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      );
    } else if (extension == ".docx" || extension == ".doc") {
      return <FileDocIcon sx={{ fontSize: 40 }} />;
    } else if (extension == ".pdf") {
      return <FilePdfIcon sx={{ fontSize: 40 }} />;
    } else if (extension == ".xls" || extension == ".xlsx") {
      return <FileExcelIcon sx={{ fontSize: 40 }} />;
    } else {
      return <FileIcon sx={{ fontSize: 40 }} />;
    }
  };
  return (
    <>
      <InformationItem label={projectT("list.projectCode")}>
        {item?.number}
      </InformationItem>
      <InformationItem label={projectT("list.form.title.name")}>
        {item?.name}
      </InformationItem>
      <InformationItem label={commonT("assigner")}>
        {item?.owner?.fullname ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar size={32} src={item?.owner?.avatar?.link} />
            <Text variant="body2">{item?.owner?.fullname ?? "--"}</Text>
          </Stack>
        ) : undefined}
      </InformationItem>
      <InformationItem label={commonT("form.title.startDate")}>
        {formatDate(item?.start_date, undefined, "--")}
      </InformationItem>
      <InformationItem label={commonT("form.title.endDate")}>
        {formatDate(item?.end_date, undefined, "--")}
      </InformationItem>
      <InformationItem label={projectT("list.form.title.estimatedCost")}>
        {formatNumber(item?.expected_cost)}
      </InformationItem>
      <InformationItem
        color="secondary.main"
        label={projectT("detail.costSpent")}
      >
        {formatNumber()}
      </InformationItem>
      <InformationItem
        label={projectT("list.form.title.estimatedWorkingHours")}
      >
        {formatNumber(item?.working_hours)}
      </InformationItem>
      <InformationItem
        color="secondary.main"
        label={projectT("detail.workingHoursActual")}
      >
        {formatNumber()}
      </InformationItem>
      <InformationItem label={commonT("status")}>
        {item?.status ? (
          <TextStatus
            color={COLOR_STATUS[item.status]}
            text={TEXT_STATUS[item.status]}
          />
        ) : (
          <Text variant="body2">{"--"}</Text>
        )}
      </InformationItem>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        className="attachment-filter"
      >
        <Text
          variant="body2"
          sx={{
            fontWeight: "600",
          }}
        >
          {projectT("detail.listFile.title")}
        </Text>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Button
            type="button"
            onClick={handleFilterAttachment}
            variant="primaryOutlined"
            size="small"
            sx={{
              minWidth: "100px",
              borderRadius: "30px",
              minHeight: "32px",
              border: "1px solid #BABCC6",
              color: "#666",
            }}
            id={ATTACHMENT_TYPE.ALL}
            className={active === ATTACHMENT_TYPE.ALL ? "active" : undefined}
          >
            {projectT("detail.listFile.filter.all")}
          </Button>

          <Button
            type="button"
            onClick={handleFilterAttachment}
            variant="primaryOutlined"
            size="small"
            sx={{
              minWidth: "100px",
              borderRadius: "30px",
              minHeight: "32px",
              border: "1px solid #BABCC6",
              color: "#666",
            }}
            id={ATTACHMENT_TYPE.IMAGE}
            className={active === ATTACHMENT_TYPE.IMAGE ? "active" : undefined}
          >
            {projectT("detail.listFile.filter.image")}
          </Button>

          <Button
            type="button"
            onClick={handleFilterAttachment}
            variant="primaryOutlined"
            size="small"
            sx={{
              minWidth: "100px",
              borderRadius: "30px",
              minHeight: "32px",
              border: "1px solid #BABCC6",
              color: "#666",
            }}
            id={ATTACHMENT_TYPE.FILE}
            className={active === ATTACHMENT_TYPE.FILE ? "active" : undefined}
          >
            {projectT("detail.listFile.filter.file")}
          </Button>
        </Stack>
      </Stack>

      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 1, sm: 2, md: 3 }}
      >
        {dataFilter?.length == 0 && (
          <p style={{ margin: "auto" }}>{projectT("detail.listFile.noData")}</p>
        )}

        {dataFilter?.map((data, index) => (
          <Grid
            item
            xs={2}
            sm={4}
            md={4}
            key={index}
            sx={{
              paddingRight: "16px",
            }}
          >
            <Link href={data.link} style={{ textDecoration: "none" }}>
              <Item>
                {fileIcon(data.extension, data.link)}
                <Stack className="description-file">
                  <Text
                    sx={{
                      color: "#000",
                      fontWeight: 500,
                      textAlign: "left",
                      width: "160px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "pre",
                    }}
                  >
                    {data.name}
                  </Text>

                  <Text
                    sx={{
                      color: "#666",
                      fontSize: "12px",
                      fontWeight: 400,
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <span>{formatBytes(data.size)}</span>
                    <span>{formatDate(data.created_time, "HH:mm")}</span>
                    <span>{data.uploaded_by}</span>
                  </Text>
                </Stack>
              </Item>
            </Link>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

const InformationItem = (props: InformationItemProps) => {
  const { label, children = "--", color = "text.primary", ...rest } = props;
  const { isSmSmaller } = useBreakpoint();
  return (
    <Stack
      direction={{ xs: "row", sm: "column" }}
      spacing={{ xs: 3, sm: 0.5 }}
      {...rest}
    >
      <Text
        color={{ xs: "grey.300", md: "grey.400" }}
        lineHeight={1.33}
        variant={{ xs: "h6", sm: "caption" }}
        width={170}
        minWidth={170}
      >
        {label}
      </Text>
      {typeof children === "string" ? (
        <Text
          variant="body2"
          lineHeight={1.57}
          color={color}
          sx={{ wordBreak: "break-all" }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Stack>
  );
};
