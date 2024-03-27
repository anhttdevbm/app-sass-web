import StringFormat from "string-format";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Endpoint, client } from "api";
import { AN_ERROR_TRY_AGAIN, AUTH_API_URL, SALE_API_URL } from "constant/index";
import {
  refactorRawItemListResponse,
  cleanObject,
  serverQueries,
} from "utils/index";
import { HttpStatusCode } from "constant/enums";
import { BaseQueries } from "constant/types";
import { Employee } from "store/company/reducer";
import { Service } from "./reducer";

export interface GetSalesListQueries extends BaseQueries {
  sort?: string;
  search_key?: string;
  company?: string;
}

export interface DealData {
  name: string;
  company_id?: string;
  status?: string;
  description?: string;
  currency: string;
  owner: Partial<Employee>;
  members?: Record<string, string>[];
  start_date?: string;
  end_date?: string;
  estimate?: number;
  revenue?: number;
  revenuePJ?: number;
  probability?: number;
  tags?: string[];
  stage?: string;
}
export interface TodoItemData {
  name: string;
  is_done?: boolean;
  owner?: string;
  priority?: number;
  expiration_date?: string;
}
export interface TodoData {
  deal_id: string;
  todo_list: TodoItemData[] | TodoItemData;
}

export type CommentData = {
  deal_id: string;
  content?: string;
  attachments?: string[];
  attachments_down?: string[];
};

export type ServiceData = Partial<
  Omit<Service, "id" | "updatedAt" | "createdAt" | "creator">
>;
export interface SectionData {
  start_date: string;
  services: ServiceData[];
  service?: ServiceData[];
}
export const getSales = createAsyncThunk(
  "sales/getSales",
  async (queries: GetSalesListQueries) => {
    const newQueries = cleanObject({
      search_key: queries.search_key || undefined,
      sort_by: queries.sort || "DESC",
      company: queries.company || undefined,
      page: queries.pageIndex ? (queries.pageIndex as number) : undefined,
      size: isNaN(queries.pageSize as number)
        ? queries.pageSize
        : Number(queries.pageSize),
    }) as GetSalesListQueries;

    try {
      const response = await client.get(Endpoint.SALES_LIST, newQueries, {
        baseURL: SALE_API_URL,
      });
      if (response?.status === HttpStatusCode.OK) {
        const { data } = response;
        const formattedData = {
          total: data.totalDocs,
          total_page: data.totalPages,
          page: data.page - 1,
          data: data.docs,
          totalDetail: data.total,
        };

        return refactorRawItemListResponse(formattedData);
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const createDeal = createAsyncThunk(
  "sales/createDeal",
  async (data: DealData) => {
    try {
      const response = await client.post(Endpoint.CREATE_DEAL, data, {
        baseURL: SALE_API_URL,
      });
      if (response?.status === HttpStatusCode.CREATED) {
        const { data } = response;
        return data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateDeal = createAsyncThunk(
  "sales/updateDeal",
  async ({ id, data }: { id: string; data: Partial<DealData> }) => {
    try {
      const response = await client.put(
        StringFormat(Endpoint.SALES_DEAL_DETAIL, { id }),
        data,
        {
          baseURL: SALE_API_URL,
        },
      );
      if (response?.status === HttpStatusCode.OK) {
        const { data } = response;
        return data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getDetailDeal = createAsyncThunk(
  "sales/getDetailDeal",
  async (id: string) => {
    try {
      const response = await client.get(
        StringFormat(Endpoint.SALES_DEAL_DETAIL, { id }),
        {},
        {
          baseURL: SALE_API_URL,
        },
      );
      if (response?.status === HttpStatusCode.OK) {
        const { data } = response;
        return data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const createTodo = createAsyncThunk(
  "sales/createTodo",
  async (data: TodoData) => {
    try {
      const response = await client.post(Endpoint.SALES_TODO, data, {
        baseURL: SALE_API_URL,
      });
      if (response?.status === HttpStatusCode.CREATED) {
        const { data } = response;
        return data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateTodo = createAsyncThunk(
  "sales/updateTodo",
  async ({ id, data }: { id: string; data: TodoData }) => {
    try {
      const response = await client.put(
        StringFormat(Endpoint.SALES_TODO_DETAIL, { id }),
        data,
        {
          baseURL: SALE_API_URL,
        },
      );
      if (response?.status === HttpStatusCode.OK) {
        const { data } = response;
        return data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const deleteTodo = createAsyncThunk(
  "sales/deleteTodo",
  async ({ id, dealId }: { id: string; dealId: string }) => {
    try {
      const response = await client.delete(Endpoint.SALES_TODO, {
        baseURL: SALE_API_URL,
        data: {
          deal_id: dealId,
          todo_id: id,
        },
      });
      if (response?.status === HttpStatusCode.OK) {
        const { data } = response;
        return data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updatePriority = async ({
  id,
  data,
}: {
  id: string;
  data: TodoData;
}) => {
  try {
    const response = await client.put(
      StringFormat(Endpoint.SALES_TODO_DETAIL, { id }),
      data,
      {
        baseURL: SALE_API_URL,
      },
    );
    if (response?.status === HttpStatusCode.OK) {
      const { data } = response;
      return data;
    }
    throw AN_ERROR_TRY_AGAIN;
  } catch (error) {
    throw error;
  }
};

export const createComment = createAsyncThunk(
  "sales/createComment",
  async ({ data }: { data: CommentData }) => {
    try {
      const response = await client.post(Endpoint.SALES_COMMENT, data, {
        baseURL: SALE_API_URL,
      });
      if (response?.status === HttpStatusCode.CREATED) {
        const { data } = response;
        return data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getServices = createAsyncThunk(
  "sales/getServices",
  async ({ dealId }: { dealId: string }) => {
    try {
      const response = await client.get(
        StringFormat(Endpoint.SALES_SERVICE_DETAIL, { id: dealId }),
        {},
        {
          baseURL: SALE_API_URL,
        },
      );
      if (response?.status === HttpStatusCode.OK) {
        const { data } = response;
        return data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateServiceSection = createAsyncThunk(
  "sales/updateServiceSection",
  async ({ sectionId, data }: { sectionId: string; data: SectionData }) => {
    try {
      const response = await client.put(
        StringFormat(Endpoint.SALES_SERVICE_DETAIL, { id: sectionId }),
        data,
        {
          baseURL: SALE_API_URL,
        },
      );
      if (response?.status === HttpStatusCode.OK) {
        const { data } = response;
        return data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const createServiceSection = createAsyncThunk(
  "sales/createServiceSection",
  async ({
    dealId,
    start_date,
    data,
  }: {
    dealId: string;
    start_date: string;
    data: SectionData[];
  }) => {
    try {
      const response = await client.post(
        StringFormat(Endpoint.SALES_SERVICE),
        {
          deal_id: dealId,
          sections: [...data],
          start_date: start_date,
        },
        {
          baseURL: SALE_API_URL,
        },
      );
      if (response?.status === HttpStatusCode.CREATED) {
        const { data } = response;
        return data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const deleteSection = createAsyncThunk(
  "sales/deleteSection",
  async ({ sectionId }: { sectionId: string }) => {
    try {
      const response = await client.delete(
        StringFormat(Endpoint.SALES_SECTION_DETAIL, { id: sectionId }),
        {
          baseURL: SALE_API_URL,
        },
      );
      if (response?.status === HttpStatusCode.OK) {
        const { data } = response;
        return data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);
