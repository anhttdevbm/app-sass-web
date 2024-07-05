"use client";

import {
  ForwardedRef,
  forwardRef,
  memo,
  useRef,
  useState,
} from "react";
import Editor from "components/Editor";
import { useTranslations } from "next-intl";
import { ACCESS_TOKEN_STORAGE_KEY, NS_BLOG, NS_COMMON } from "constant/index";
import { Stack } from "@mui/material";
import { Button } from "components/shared";
import { getMessageErrorByAPI } from "utils/index";
import { useAuth, useSnackbar } from "store/app/selectors";
import { UnprivilegedEditor } from "react-quill";
import { useBlogs } from "store/blog/selectors";
import { CommentBlogData } from "store/blog/actions";
import { useParams } from "next/navigation";
import { clientStorage } from "utils/storage";

// CommentEditor.tsx
interface CommentEditorProps {
  postId: string;
  replyToCommentId: string | null;
  resetReplyToCommentId: () => void;
  forwardedRef: React.ForwardedRef<HTMLDivElement | null>;
}

const CommentEditor = forwardRef(
  ({ postId, replyToCommentId, resetReplyToCommentId, forwardedRef }: CommentEditorProps, ref: ForwardedRef<HTMLDivElement | null>) => {
    const commonT = useTranslations(NS_COMMON);
    const blogT = useTranslations(NS_BLOG);
    const { onCreateCommentBlog } = useBlogs();
    const { onAddSnackbar } = useSnackbar();
    const { user } = useAuth();

    const editorRef = useRef<UnprivilegedEditor | undefined>();
    const [content, setContent] = useState<string>("");

    const onChange = (value: string, delta, _, editor: UnprivilegedEditor) => {
      const isEmpty = value === VALUE_AS_EMPTY;
      setContent(isEmpty ? "" : value);
      editorRef.current = editor;
    };

    const onSubmit = async () => {
      try {
        const data = {
          name: user?.fullname,
          email: user?.email,
          reply_to: replyToCommentId ?? "",
          content: editorRef.current?.getHTML() ?? content,
          post_slug: postId,
          avatar: user?.avatar?.link,
        } as CommentBlogData;

        const accessToken = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);
        const newData = await onCreateCommentBlog(postId, data, accessToken as string);
        if (newData) {
          setContent("");
          resetReplyToCommentId();
          ((forwardedRef as any)?.current as HTMLDivElement)?.scrollIntoView();
        }
      } catch (error) {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      }
    };

    return (
      <Editor
        hasAttachment
        placeholder={blogT("comment.writeComment")}
        onChange={onChange}
        value={content}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mt={2}
        >
          <Button
            onClick={onSubmit}
            variant="primary"
            size="small"
          >
            {blogT("comment.sendComment")}
          </Button>
        </Stack>
      </Editor>
    );
  },
);

CommentEditor.displayName = "CommentEditor";

export default memo(CommentEditor);




// const CommentEditor = forwardRef(
//   ({ postIdOrSlug }, ref: ForwardedRef<HTMLDivElement | null>) => {
//     const commonT = useTranslations(NS_COMMON);
//     const blogT = useTranslations(NS_BLOG);
//     const { onCreateCommentBlog } = useBlogs();
//     const { onAddSnackbar } = useSnackbar();

//     const editorRef = useRef<UnprivilegedEditor | undefined>();
//     const [content, setContent] = useState<string>("");

//     const onChange = (value: string, delta, _, editor: UnprivilegedEditor) => {
//       const isEmpty = value === VALUE_AS_EMPTY;
//       setContent(isEmpty ? "" : value);
//       editorRef.current = editor;
//     };

//     const onSubmit = async () => {
//       try {
//         const data = {
//           name: "",
//           email: "",
//           reply_to: "",
//           content: editorRef.current?.getHTML() ?? content,
//           post_slug: postIdOrSlug,
//         } as CommentBlogData;

//         const newData = await onCreateCommentBlog(postIdOrSlug, data);
//         if (newData) {
//           setContent("");
//           ((ref as any)?.current as HTMLDivElement)?.scrollIntoView();
//         }
//       } catch (error) {
//         onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
//       }
//     };

//     return (
//       <Editor
//         hasAttachment
//         placeholder={blogT("comment.writeComment")}
//         onChange={onChange}
//         value={content}
//       >
//         <Stack direction="row" alignItems="center" justifyContent="space-between" mt={2}>
//           <Button onClick={onSubmit} variant="primary" size="small">
//             {blogT("comment.sendComment")}
//           </Button>
//         </Stack>
//       </Editor>
//     );
//   },
// );

// CommentEditor.displayName = "CommentEditor";

// export default memo(CommentEditor);

const VALUE_AS_EMPTY = "<p><br></p>";