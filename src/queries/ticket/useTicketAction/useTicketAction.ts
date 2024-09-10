import { useMutation } from "react-query";
import { createCommentApi, createTicketApi, deleteCommentApi, editCommentApi , sendReplyApi } from "../api";

const useTicketAction = () => {
  const createTicket = useMutation({
    mutationFn: createTicketApi,
  });

  const createComment = useMutation({
    mutationFn: createCommentApi,
  });

  const editComment = useMutation({
    mutationFn: editCommentApi,
  });
  const deleteComment = useMutation({
    mutationFn: deleteCommentApi,
  });

  const sendReply = useMutation({
    mutationFn : sendReplyApi
  })

  return { createTicket, createComment, editComment, deleteComment , sendReply };
};
export default useTicketAction;
