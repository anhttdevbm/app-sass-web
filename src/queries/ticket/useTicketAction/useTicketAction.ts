import { useMutation } from "react-query";
import { createCommentApi, createTicketApi, deleteCommentApi, editCommentApi } from "../api";

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

  return { createTicket, createComment, editComment, deleteComment };
};
export default useTicketAction;
