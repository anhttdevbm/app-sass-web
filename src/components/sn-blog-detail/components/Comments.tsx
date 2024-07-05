"use client"
import { Box, Divider, Stack } from '@mui/material';
import { Button, Text } from 'components/shared';
import { useParams } from 'next/navigation';
import  { memo, useEffect, useRef, useState } from 'react';
import { CommentBlogData } from 'store/blog/actions';
import { useBlogs } from 'store/blog/selectors';
import { formatDate } from 'utils/index';
import CommentEditor from './CommentEditor';
import Avatar from 'components/Avatar';
import React from 'react';
// Comment.tsx
interface CommentProps {
  comment: CommentBlogData;
  commentsMap: Record<string, CommentBlogData[]>;
  onReply: (commentId: string) => void;
}

const Comment = ({ comment, commentsMap, onReply }: CommentProps) => {
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const { id } = useParams();
  const handleReply = (commentId: string) => {
    setReplyToCommentId((prevId) => (prevId === commentId ? null : commentId));
  };
  const avatarSrc = comment.avatar || '';
  const resetReplyToCommentId = () => {
    setReplyToCommentId(null);
  };

  return (
    <Stack style={{ marginTop: 10,padding:8,paddingRight:0 }} bgcolor="grey.50">
      <Stack style={{ paddingLeft: comment.reply_to ? 4 : 0 }}>
        <Stack direction="row" justifyContent="space-between" spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar size={32} src={avatarSrc} />
            <Stack>
              <Text variant="h6">{comment.name ?? "--"}</Text>
              <Text variant="caption" color="grey.400">
                {formatDate(comment.created_time, "HH:mm - dd/MM/yyyy")}
              </Text>
            </Stack>
          </Stack>
          <Button variant="primary"
            size="small" onClick={() => handleReply(comment.id)} style={{ marginRight: 8,maxHeight:30 }} >Reply
            </Button>
        </Stack>
        <Stack
          sx={{
            fontSize: 14,
            '& *': {
              marginBlockStart: 0,
              marginBlockEnd: 0,
              wordBreak: 'break-all',
            },
          }}
          className="html"
          dangerouslySetInnerHTML={{ __html: comment.content }} // Sử dụng dangerouslySetInnerHTML để hiển thị nội dung HTML
        />
        {replyToCommentId === comment.id && (
          <CommentEditor
            key={`reply-editor-${comment.id}`}
            forwardedRef={scrollEndRef}
            postId={id as string}
            replyToCommentId={comment.id}
            resetReplyToCommentId={resetReplyToCommentId}
          />
        )}
        {commentsMap[comment.id] && (
          <Stack ml={2} mt={1}>
            {commentsMap[comment.id].map((reply) => (
              <React.Fragment key={comment.id}>
              <Divider component="div" />
              <Comment key={reply.id} comment={reply} commentsMap={commentsMap} onReply={handleReply} />
            </React.Fragment>
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
const CommentsTreeView = () => {
  const { id } = useParams();
  const { listBlogComment, onGetBlogComments } = useBlogs();

  useEffect(() => {
    onGetBlogComments(id as string);
  }, [id]);

  const buildCommentTree = (comments) => {
    const commentMap = {};

    comments.forEach((comment) => {
      const parentId = comment.reply_to || '';
      if (!commentMap[parentId]) {
        commentMap[parentId] = [];
      }
      commentMap[parentId].push(comment);
    });

    return commentMap;
  };

  const commentsMap = buildCommentTree(listBlogComment || []);

  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);

  const handleReply = (commentId: string | null) => {
    setReplyingToCommentId(commentId);
  };

  return (
    <Stack spacing={2}>
      {commentsMap['']?.map((comment) => (
          <Comment comment={comment} commentsMap={commentsMap} onReply={handleReply}  key={comment.id} />
      ))}
    </Stack>
  );
  
};

export default CommentsTreeView;

