"use client"

import { useGetListReply } from "queries/ticket/useGetTicket/useGetListReply";

const EmailActivity = () => {
  const { data } = useGetListReply()
  console.log("check data reply" , data)
  return <>EmailActivity</>;
};
export default EmailActivity;
