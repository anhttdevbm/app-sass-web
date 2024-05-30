"use client"
import { Box, Button, Card, Divider, Grid, List, ListItem, ListItemText, Paper, Stack } from '@mui/material';
import Avatar from "components/Avatar";
import StatusServer from 'components/StatusServer';
import { Text } from 'components/shared';
import CommentEditor from 'components/sn-blog-detail/components/CommentEditor';
import { DATE_TIME_FORMAT_SLASH, NS_BLOG } from 'constant/index';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import React, { memo, useEffect, useRef, useState } from 'react';
import { AttachmentsBlogs, BlogFormData } from 'store/blog/actions';
import { useBlogs } from 'store/blog/selectors';
import { formatDate } from 'utils/index';

import { DataAction } from 'constant/enums';
import useToggle from 'hooks/useToggle';
import parse, { HTMLReactParserOptions, domToReact } from 'html-react-parser';
import EditIcon from 'icons/EditIcon';
import UserPlaceholderImage from "public/images/img-user-placeholder.webp";
import CommentsTreeView from './components/Comments';
import Form from './components/Form';

const BlogDetailSection = () => {
    const blogT = useTranslations(NS_BLOG);
    const scrollEndRef = useRef<HTMLDivElement | null>(null);
    const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);
    const [isShow, onShow, onHide] = useToggle();
    const { onGetBlogs,onUpdateBlog } = useBlogs();
    const [files, setFiles] = useState<File[]>([]);
    const [background, setBackground] = useState<File>();

    const { id } = useParams();
    const {
        item: detailItem,
        error: detailItemError,
        isFetching: detailItemIsFetching,
        relatedBlogs,
        onGetRelatedBlogs,
        onGetBlogBySlug,
    } = useBlogs();
    function getFileExtension(filename) {
        return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
      }
      function getMimeTypeFromExtension(extension) {
        switch (extension.toLowerCase()) {
          case "jpg":
          case "jpeg":
          case "png":
            return "image/" + extension;
          case "mp4":
          case "avi":
          case "mov":
            return "video/" + extension;
          default:
            return "application/octet-stream";
        }
      }
      useEffect(() => {
        onGetBlogBySlug(id as string);
        onGetRelatedBlogs(id as string);
    }, [id]);

  useEffect(() => {
    if (Array.isArray(detailItem?.attachments_down) && detailItem?.attachments_down) {
        const filesArray: Promise<File>[] = detailItem?.attachments_down.map(async (attachment) => {
          const { name, link } = attachment;
          try {
            const response = await fetch(link as string);
            const blob = await response.blob();
            const fileName = getFileExtension(name);
            const type = getMimeTypeFromExtension(fileName);
            return new File([blob], name as string, { type });
          } catch (error) {
            console.error('Error creating File object:', error);
            throw error;
          }
        });
    
        if (filesArray.length > 0) {
          Promise.all(filesArray)
            .then((resolvedFiles) => {
              setFiles(resolvedFiles);
            })
            .catch((error) => {
              console.error('Error creating File objects:', error);
            });
        }
      }
  }, [detailItem]);
  useEffect(() => {
    const fetchBackgroundFile = async () => {
      if (detailItem?.background_down) {
        const { name, link } = detailItem.background_down;
        try {
          const response = await fetch(link as string);
          const blob = await response.blob();
          const fileName = getFileExtension(name);
          const type = getMimeTypeFromExtension(fileName);
          const backgroundFile = new File([blob], name as string, { type });
          setBackground(backgroundFile);
        } catch (error) {
          console.error('Error creating Background File object:', error);
        }
      }
    };
  
    fetchBackgroundFile();
  }, [detailItem?.background_down]);

  const optionsRenderHtml: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode.type === 'tag' && domNode.name === 'code') {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return (
          <div style={{ width: '100%', overflowX: "auto" }}>
            <code>
              {domToReact(domNode.children as any, optionsRenderHtml)}
            </code>
          </div>
        );
      }
    }
  };
    return (
        <>
            <StatusServer isFetching={detailItemIsFetching} error={detailItemError} noData={!detailItem}>
                <Stack width="100%"
                    flex={1}
                    bgcolor={{ md: "background.default" }} style={{ overflowY: "auto" }}>
                    <Stack
                        maxWidth={1360}
                        mx="auto"
                        width="100%"
                        bgcolor={{ md: "background.paper" }}
                        overflow="auto"
                        padding={3}
                    >
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={8} padding={6}>
                                <Paper
                                    sx={{
                                        maxHeight: 250,
                                        minHeight: 200,
                                        position: 'relative',
                                        backgroundColor: 'grey.800',
                                        color: '#fff',
                                        mb: 4,
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center',
                                        backgroundImage: `url(${detailItem?.background_down?.link || ''})`,
                                    }}>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            bottom: 0,
                                            right: 0,
                                            left: 0,
                                            backgroundColor: 'rgba(0,0,0,.3)',
                                        }}
                                    />
                                    <Grid container>
                                        <Grid item md={7}>
                                            <Stack
                                                sx={{
                                                    position: 'relative',
                                                    p: { xs: 3, md: 6 },
                                                    pr: { md: 0 },
                                                }}>
                                            </Stack>

                                        </Grid>
                                    </Grid>

                                </Paper>
                                <Grid container spacing={5} >
                                    <Grid item xs={12} md={12} sx={{ '& .markdown': { py: 3, }, }}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Avatar src={detailItem?.created_by?.avatar?.link} size={40} alt='' />
                                            <Stack>
                                                <Text variant="h4">{detailItem?.title}</Text>
                                                <Text color="GrayText" fontSize={12}>
                                                    {formatDate(detailItem?.created_time, DATE_TIME_FORMAT_SLASH)}
                                                </Text>
                                            </Stack>
                                        </Stack>
                                        <Stack marginTop={5} width={"100%"} sx={{wordBreak: "break-word"}}>
                                            {/* {renderContentWithAttachments(detailItem?.content as string, detailItem?.attachments_down as AttachmentsBlogs[])} */}
                                            {typeof detailItem?.content === 'string' ? parse(detailItem.content, optionsRenderHtml) : 'Content is not a string'}
                                        </Stack>
                                        <Stack>
                                            <CommentEditor
                                                ref={scrollEndRef}
                                                key={id as string}
                                                postId={id as string}
                                                replyToCommentId={null}
                                                forwardedRef={scrollEndRef}
                                                resetReplyToCommentId={() => setReplyToCommentId(null)} />
                                            <CommentsTreeView />
                                        </Stack>
                                    </Grid>

                                </Grid>
                            </Grid>
                            <Divider />
                            <Grid item xs={12} sm={4}>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    mt={2}>
                                   <Button
                                    onClick={onShow}
                                    startIcon={<EditIcon />}
                                    size="extraSmall"
                                    variant="primary"
                                    sx={{
                                        height: 36,
                                        px: ({ spacing }) => `${spacing(2)}!important`,
                                        background: '#3699FF',
                                        color: '#FFFFFF',
                                        fontSize: 12,
                                        marginBottom: 2,
                                        '&:hover': {
                                        background: '#2676C3',
                                        },
                                    }}
                                    >
                                    {blogT("actions.updateBlog")}
                                    </Button>
                                </Stack>
                                <Stack>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        marginBottom="1em"
                                        fontWeight="bold">{blogT("blogList.category")}
                                    </Box>
                                    <Card >
                                        <List sx={{ width: '100%', maxWidth: 360 }}>
                                            {detailItem?.categories && detailItem.categories.length > 0 && (
                                                detailItem.categories.map((category, index) => (
                                                    <React.Fragment key={index}>
                                                        <ListItem
                                                            alignItems="flex-start"
                                                            sx={{
                                                                '&:hover': {
                                                                    backgroundColor: '#e0e0e0',
                                                                },
                                                            }}>
                                                            <ListItemText
                                                                primary={category.name}
                                                            />
                                                        </ListItem>
                                                    </React.Fragment>
                                                ))
                                            )}
                                        </List>
                                    </Card>
                                </Stack>
                                <Stack paddingTop={5}>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        marginBottom="1em"
                                        fontWeight="bold">{blogT("blogList.tag")}
                                    </Box>
                                    <Card >
                                        <List sx={{ width: '100%', maxWidth: 360 }}>
                                            {detailItem?.tag && detailItem.tag.length > 0 && (
                                                detailItem.tag.map((tg, index) => (
                                                    <React.Fragment key={index}>
                                                        <ListItem
                                                            alignItems="flex-start"
                                                            sx={{
                                                                '&:hover': {
                                                                    backgroundColor: '#e0e0e0',
                                                                },
                                                            }}>
                                                            <ListItemText
                                                                primary={tg}
                                                            />
                                                        </ListItem>
                                                    </React.Fragment>
                                                ))
                                            )}
                                        </List>
                                    </Card>
                                </Stack>
                                <Stack paddingTop={5}>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        marginBottom="1em"
                                        fontWeight="bold">{blogT("blogList.relatedBlogs")}
                                    </Box>
                                    <Card>
                                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                            {relatedBlogs.map((blog, index) => (
                                                <React.Fragment key={blog.id} >
                                                    <ListItem alignItems="flex-start" sx={{
                                                        '&:hover': {
                                                            backgroundColor: '#e0e0e0',
                                                        },
                                                    }}>
                                                        <ListItemText
                                                            primary={blog.title}
                                                            secondary={
                                                                <Text color="GrayText" fontSize={12}>
                                                                    - {formatDate(blog.created_time, DATE_TIME_FORMAT_SLASH)}
                                                                </Text>
                                                            }
                                                        />
                                                    </ListItem>
                                                    {index < relatedBlogs.length - 1 && (
                                                        <Divider component="li" />
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Card>

                                </Stack>

                            </Grid>
                        </Grid>
                    </Stack>
                    {isShow && (
                        <Form
                            open={isShow}
                            onClose={onHide}
                            type={DataAction.UPDATE}
                            initialValues={ {
                                id: detailItem?.id,
                                title: detailItem?.title,
                                slug: detailItem?.slug,
                                content:detailItem?.content,
                                tag:detailItem?.tag,
                                status:detailItem?.status,
                                backgroundUpload:background,
                                category:detailItem?.categories?.map(a=>a.id),
                                attachmentsUpload : files,
                                attachments : detailItem?.attachments_down?.map(a=>a.object),
                                background : detailItem?.background_down?.object,
                                short_description :  detailItem?.short_description,
                                meta_title : detailItem?.meta_title,
                                meta_description : detailItem?.meta_description,
                            } as  BlogFormData}
                            onSubmit={onUpdateBlog}
                        />
                    )}
                </Stack>
            </StatusServer>
        </>
    )
};

const AttachmentComponent = ({ attachment }) => (
    <div className="attachment">
      <img
        alt={attachment.name || ''}
        src={(attachment.link ? attachment.link : UserPlaceholderImage) || ''}
        style={{
          width: '100%',
          height: 400,
          objectFit: 'contain',
        }}
      />
    </div>
  );
  
  const renderContentWithAttachments = (content: string, attachments: AttachmentsBlogs[]) => {
    if (typeof content !== 'string') {
      return null;
    }
  
    const attachmentPlaceholders = content.split(/<\/p>|<br\s*\/?>/).filter((item) => item.trim() !== '');
  
    return (
        <div className="blog-post">
        {attachmentPlaceholders.map((placeholder, index) => (
          <React.Fragment key={index}>
            <div className="content" dangerouslySetInnerHTML={{ __html: parseHTML(placeholder) }} />
            {attachments && index < attachments.length && (
              <AttachmentComponent attachment={attachments[index]} />
            )}
          </React.Fragment>
        ))}
        {/* Handle the case where there are more attachments than placeholders */}
        {attachments && attachments.slice(attachmentPlaceholders.length).map((attachment, index) => (
          <AttachmentComponent key={index} attachment={attachment} />
        ))}
      </div>
    );
  };
  
  
  const parseHTML = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const paragraphs = Array.from(doc.body.childNodes);
    const result = [];
  
    for (const node of paragraphs) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        result.push((node as Element).outerHTML as string as never);
      } else if (node.nodeType === Node.TEXT_NODE) {
        result.push(node.textContent as string as never);
      }
    }
    return result.join('');
  };
export default memo(BlogDetailSection);
