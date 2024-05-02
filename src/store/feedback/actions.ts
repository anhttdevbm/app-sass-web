import { createAsyncThunk } from "@reduxjs/toolkit";
import { Endpoint, client } from "api";
import { HttpStatusCode } from "constant/enums";
import { AN_ERROR_TRY_AGAIN, FEEDBACK_API_URL } from "constant/index";
import { BaseQueries_Feedback } from "constant/types";
import StringFormat from "string-format";
import { serverQueries } from "utils/index";

export enum FeedbackStatus {
  RESPONSED = "RESPONSED",
  WATTING_RESPONSE = "WATTING_RESPONSE"
}

export type FeedbackData = {
  id?: string;
  topic?: string;
  name?: string;
  phone?: string;
  email?: string;
  type?: string;
  title?: string;
  content?: string;
  status?: string;
  created_time?: Date;
  responsed_by?: string;
  responsed_content?: string;
  responsed_time?: Date;
  forward_email?: string[]
};

export type Responsed_Feedback = {
  content?: string;
  type?: string;
  forwardEmail: string[]
}

export type GetFeedbackDataListQueries = BaseQueries_Feedback & {
  searchKey?: string;
  status?: string;
};

export type MailData = {
  mail: string;
}

//Get list Feedback
export const getFeedbacks = createAsyncThunk(
  "feedback/getFeedbacks",
  async ({ ...queries }: GetFeedbackDataListQueries) => {
    try {
      // console.log(queries);
      // Sử dụng fetch để gọi API và truyền tham số searchKey vào URL
      const response = await client.get(Endpoint.FEEDBACK, queries, { baseURL: FEEDBACK_API_URL });

      if (response?.status === HttpStatusCode.OK) {
        // console.log(response);
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }
);

//Phải Hồi Lại
//Đang gặp vướng mắc
export const respondToFeedback = createAsyncThunk(
  "feedback/respondToFeedback",
  async ({ id, data, Token }: { id: string, data: FeedbackData, Token: string | undefined | null }) => {
    
    try {
      const respondToFeedback = {
        content: data.responsed_content,
        subject : data.title,
        type: 'BCC',
        forwardEmail: data.forward_email
      } as Responsed_Feedback
      const response = await client.post(StringFormat(Endpoint.RESPONDFEEDBACK, { id }),
        respondToFeedback,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          Authorization: `${Token}`,
          baseURL: FEEDBACK_API_URL,
        },
      );
      // console.log(response?.status);
      if (response?.status === HttpStatusCode.OK) {
        // console.log(response);
        // console.log(response.data?.id ? response.data : response.data?.body);
        return response.data?.id ? response.data : response.data?.body;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw AN_ERROR_TRY_AGAIN;
    }
  }
);