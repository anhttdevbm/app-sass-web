import { createAsyncThunk } from "@reduxjs/toolkit";
import { Endpoint, client } from "api";
import { HttpStatusCode } from "constant/enums";
import { AN_ERROR_TRY_AGAIN, CAREER_API_URL } from "constant/index";
import { BaseQueries_Feedback } from "constant/types";
import StringFormat from "string-format";
import { serverQueries } from "utils/index";
import { CareergDataForm } from "./type";
import { IApplicant } from "constant/types";

export enum CareerStatus {
  PUBLISHED,
  DRAFT, // NHA
  
}

export enum UpdateStatusCareer {
  CLOSED = 'CLOSED',
  REOPEN = 'REOPEN'
}

export enum SearchStatus {
  IS_OPENING = "true",
  IS_CLOSED = "false" // NHA
}

export type CareerData = {
  status: UpdateStatusCareer;
  id?: string
  title?: string;
  description?: string;
  location?: string;
  start_time?: string;
  end_time?: string;
  numberOfHires?: number;
  is_opening?: boolean;
  slug?: string
  detail?: string;
}

export type GetCareerListQueries = BaseQueries_Feedback & {
  searchKey?: string;
  isOpening?: string;
};

export type ApplicantData = {
  jobpostId: string,
  applicantId: string,
  email?: string,
  subject?: string,
  content?: string,
  responsed_content?: string,
  type?: string,
  forward_email: string[],
  title?: string
  phone?: string
  name?: string
};

export type MailData = {
  mail: string;
}

//Get list Feedback
export const getAllCareer = createAsyncThunk(
  "/getAllCareer",
  async ({ ...queries }: GetCareerListQueries) => {
    try {
      console.log(queries);
      // Sử dụng fetch để gọi API và truyền tham số searchKey vào URL
      const response = await client.get(Endpoint.CAREER, queries, { baseURL: CAREER_API_URL });

      if (response?.status === HttpStatusCode.OK) {
        // console.log(response);
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }
);

export const postCareer = createAsyncThunk("postCareer",
  async ({ data, Token }: { data: CareergDataForm, Token: string | undefined | null }) => {
    // console.log(data);
    try {
      const response = await client.post(Endpoint.CAREER, data,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          Authorization: `${Token}`,
          baseURL: CAREER_API_URL,
        },
      );
      if (response?.status === HttpStatusCode.CREATED) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  }
);

export const upadteCareer = createAsyncThunk(
  "upadteCareer",
  async ({ id, data, Token }: { id: string, data: CareergDataForm, Token: string | undefined | null }) => {
    try {
      // console.log(Token);
      const response = await client.put(StringFormat(Endpoint.UPADATECAREER, { id }),
        data,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          Authorization: `${Token}`,
          baseURL: CAREER_API_URL,
        },
      );
      console.log(response?.status);
      if (response?.status === HttpStatusCode.CREATED) {
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

export const getCareerBySlug = createAsyncThunk(
  "getCareerBySlug", async (slug: string) => {      
      try {
          console.log(slug);
          
          const response = await client.get(StringFormat(Endpoint.DETAIL_CAREER, {slug}), 
            undefined,
            {
              baseURL: CAREER_API_URL,
          });
          if (response?.status === HttpStatusCode.OK) {
              return response.data;
          }
          throw AN_ERROR_TRY_AGAIN;
      } catch (error) {
          throw error;
      }
  }
);

// update sttaus 
export const updateStatusCareer = createAsyncThunk(
  'updateStatusCareer',
  async ({ careerList, opened, Token }: { careerList: CareerData[]; opened: boolean; Token: string | undefined | null }) => {
    console.log(opened);
    try {
      const promises = careerList.map(async (element) => {
        const item = {
          ...element,
          is_opening: opened, 
          start_time : element.start_time ? new Date(element.start_time).toISOString().split('T')[0] : null,
          end_time : element.end_time ? new Date(element.end_time).toISOString().split('T')[0] : null,
        };
        const response = await client.put(
          `${Endpoint.CAREER}/${element.id}`,
          item,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${Token}`,
            },
            baseURL: CAREER_API_URL,
          }
        );
        if (response?.status !== HttpStatusCode.CREATED) {
          throw AN_ERROR_TRY_AGAIN;
        }
        return response.data;
      });
      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      throw error;
    }
  }
);

export const updateStatusCareerNew = createAsyncThunk(
  'updateStatusCareerNew',
  async ({ careerList, opened, Token }: { careerList: CareerData[]; opened: string; Token: string | undefined | null }) => {
    console.log(opened);
    try {
      const promises = careerList.map(async (element) => {
        const item = {
          ...element,
          is_opening: opened, 
          start_time : element.start_time ? new Date(element.start_time).toISOString().split('T')[0] : null,
          end_time : element.end_time ? new Date(element.end_time).toISOString().split('T')[0] : null,
        };
        const status = opened === SearchStatus.IS_OPENING ? UpdateStatusCareer.REOPEN : UpdateStatusCareer.CLOSED
        const id = element.id
        const response = await client.patch(
          StringFormat(Endpoint.UPDATE_STATUS_CAREER, {id, status}),
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${Token}`,
            },
            baseURL: CAREER_API_URL,
          }
        );
        
        if (response?.status !== HttpStatusCode.OK) {
          throw AN_ERROR_TRY_AGAIN;
        }
        return response.data;
      });
      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      throw error;
    }
  }
);

export const getApplicantsByCareer = createAsyncThunk(
  'getApplicantsByCareer',
  async(slug: string) => {
    try {
      console.log(slug);
      
      const response = await client.get(StringFormat(Endpoint.GET_APPLICANTS_CAREER, {slug}), 
        undefined,
        {
          baseURL: CAREER_API_URL,
      });
      if (response?.status === HttpStatusCode.OK) {
          return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
  } catch (error) {
      throw error;
  }
  }
)

export const respondToApplicant = createAsyncThunk(
  "career/respondToApplicant",
  async ({ data, Token }: { data: ApplicantData, Token: string | undefined | null }) => {
    try {
      const respondToFeedback = {
        jobpostId: data.jobpostId,
        applicantId: data.applicantId,
        content: data.responsed_content,
        subject : data.title,
        type: 'BCC',
        forward_email: data.forward_email
      } as ApplicantData
      const response = await client.post(StringFormat(Endpoint.RESPONDAPPLICANT),
        respondToFeedback,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          Authorization: `${Token}`,
          baseURL: CAREER_API_URL,
        },
      );
      console.log(response?.status);
      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw AN_ERROR_TRY_AGAIN;
    }
  }
);