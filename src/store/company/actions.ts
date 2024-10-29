import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "api/client";
import { Endpoint } from "api/endpoint";
import { ClientCompany } from "components/sn-client-companies/type";
import { HttpStatusCode, Permission } from "constant/enums";
import {
  AN_ERROR_TRY_AGAIN,
  AUTH_API_URL,
  COMPANY_API_URL,
} from "constant/index";
import { BaseQueries } from "constant/types";
import { getPositions, getProjectTypes } from "store/global/actions";
import StringFormat from "string-format";
import { refactorRawItemListResponse, serverQueries } from "utils/index";

export enum CompanyStatus {
  REJECT,
  APPROVE,
  WAITING,
}

export type GetEmployeeListQueries = BaseQueries & {
  fullname?: string;
  email?: string;
  position?: string;
  is_pay_user?: boolean;
  status?: boolean;
  company?: string;
  date?: string;
  typeEmployee?: string;
  searchType?: "and" | "or" | "eq";
};

export type EmployeeData = {
  email: string;
  position: string;
};

export type InviteEmployeeData = EmployeeData & {
  password: string;
  company: string;
  roles: Permission[];
  client?: string;
  is_invite?: boolean;
};

export type EmployeeClientData = EmployeeData & {
  client_company: string;
  role: "CT" | "CL";
};

export type PositionData = {
  name: string;
};

export type ProjectTypeData = {
  name: string;
};

export type CompanyData = {
  name: string;
  address?: string;
  phone?: string;
  tax_code?: string;
  avatar?: string | File;
};

export type GetClientConpanyListQueries = BaseQueries & {
  name?: string;
  email?: string;
  position?: string;
  created_by?: string;
  searchType?: "and" | "or" | "eq";
};

export type GetClientConpanyOptionListQueries = BaseQueries & {
  name?: string;
  email?: string;
  searchType?: "and" | "or" | "eq";
};

export const getEmployees = createAsyncThunk(
  "company/getEmployees",
  async ({
    concat,
    ...queries
  }: GetEmployeeListQueries & { concat?: boolean }) => {
    queries = serverQueries(
      { ...queries, sort: "created_time=-1" },
      ["email", "fullname"],
      undefined,
      ["status"],
      {},
      ["typeEmployee"],
    ) as GetEmployeeListQueries;

    try {
      const response = await client.get(Endpoint.USERS, queries, {
        baseURL: AUTH_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return { ...refactorRawItemListResponse(response.data), concat };
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getEmployeeOptions = createAsyncThunk(
  "company/getEmployeeOptions",
  async (queries: BaseQueries & { email?: string; fullname?: string }) => {
    queries = serverQueries({ ...queries, sort: "created_time=-1" }, [
      "email",
      "fullname",
    ]) as GetEmployeeListQueries;
    try {
      const response = await client.get(Endpoint.COMPANY_MEMBERS, queries, {
        baseURL: AUTH_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return { ...refactorRawItemListResponse(response.data) };
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getMembers = async (queries: { page: number; query: string }) => {
  // queries = serverQueries({ ...queries, sort: "created_time=-1" }, [
  //   "email",
  //   "fullname",
  // ]) as GetEmployeeListQueries;
  try {
    const response = await client.get(Endpoint.COMPANY_MEMBERS, queries, {
      baseURL: AUTH_API_URL,
    });

    if (response?.status === HttpStatusCode.OK) {
      return response.data;
    }
    throw AN_ERROR_TRY_AGAIN;
  } catch (error) {
    throw error;
  }
};

export const createEmployee = createAsyncThunk(
  "company/createEmployee",
  async (data: EmployeeData) => {
    try {
      const response = await client.post(Endpoint.COMPANY_ADD_MEMBER, data, {
        baseURL: COMPANY_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data?.id ? response.data : response.data?.body;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const inviteEmployee = createAsyncThunk(
  "company/inviteEmployee",
  async (data: InviteEmployeeData) => {
    try {
      const { is_invite, ...rest } = data;
      const response = await client.post(
        Endpoint.INVITE_USER_TO_COMPANY,
        { ...rest },
        {
          baseURL: AUTH_API_URL,
          params: is_invite
            ? {
                is_invite: "true",
              }
            : {},
        },
      );

      if (response?.status === HttpStatusCode.CREATED) {
        return response.data?.id ? response.data : response.data?.body;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const createEmployeeClient = createAsyncThunk(
  "company/createEmployeeClient",
  async (data: EmployeeClientData) => {
    try {
      const response = await client.post(
        Endpoint.CLIENT_COMPANIES_ADD_MEMBER,
        data,
        {
          baseURL: COMPANY_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
        return response.data?.id ? response.data : response.data?.body;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateEmployee = createAsyncThunk(
  "company/updateEmployee",
  async ({ id, position }: { id: string; position: string }) => {
    try {
      const response = await client.put(
        StringFormat(Endpoint.USER_ITEM, { id }),
        { position },
        {
          baseURL: AUTH_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const deleteEmployees = createAsyncThunk(
  "company/deleteEmployees",
  async (ids: string[]) => {
    try {
      const response = await client.put(
        Endpoint.USERS_INACTIVE,
        { ids },
        {
          baseURL: AUTH_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
        return ids;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getPositionList = createAsyncThunk(
  "company/getPositionList",
  getPositions,
);

export const createPosition = createAsyncThunk(
  "company/createPosition",
  async (data: PositionData) => {
    try {
      const response = await client.post(Endpoint.POSITIONS, data, {
        baseURL: COMPANY_API_URL,
      });

      if (response?.status === HttpStatusCode.CREATED) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updatePosition = createAsyncThunk(
  "company/updatePosition",
  async ({ id, name }: { id: string; name: string }) => {
    try {
      const response = await client.put(
        StringFormat(Endpoint.POSITION_ITEM, { id }),
        { name },
        {
          baseURL: COMPANY_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.CREATED) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const deletePosition = createAsyncThunk(
  "company/deletePosition",
  async (id: string) => {
    try {
      const response = await client.put(
        Endpoint.POSITIONS_INACTIVE,
        { ids: [id] },
        {
          baseURL: COMPANY_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
        return id;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getProjectTypeList = createAsyncThunk(
  "company/getProjectTypeList",
  getProjectTypes,
);

export const createProjectType = createAsyncThunk(
  "company/createProjectType",
  async (data: ProjectTypeData) => {
    try {
      const response = await client.post(Endpoint.PROJECT_TYPES , data, {
        baseURL: COMPANY_API_URL,
      });

      if (response?.status === HttpStatusCode.CREATED) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateProjectType = createAsyncThunk(
  "company/updateProjectType",
  async ({ id, name }: { id: string; name: string }) => {
    try {
      const response = await client.put(
        StringFormat(Endpoint.PROJECT_TYPE_ITEM, { id }),
        { name },
        {
          baseURL: COMPANY_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const deleteProjectType = createAsyncThunk(
  "company/deleteProjectType",
  async (id: string) => {
    try {
      const response = await client.put(
        Endpoint.PROJECT_TYPES_INACTIVE,
        { ids: [id] },
        {
          baseURL: COMPANY_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
        return id;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getMyCompany = createAsyncThunk(
  "company/getMyCompany",
  async () => {
    try {
      const response = await client.get(Endpoint.MY_COMPANY, undefined, {
        baseURL: COMPANY_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateMyCompany = createAsyncThunk(
  "company/updateMyCompany",
  async (data: CompanyData, { getState }) => {
    try {
      const state = getState();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const myCompany = (state as any).company.myItem;

      const response = await client.put(Endpoint.COMPANIES, data, {
        baseURL: COMPANY_API_URL,
        params: {
          type: "code",
        },
      });

      if (response?.status === HttpStatusCode.OK) {
        const result = {
          ...myCompany,
          ...response.data,
          owner: { ...myCompany.owner },
          created_by: { ...myCompany.created_by },
        };

        return result;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getCostHistory = createAsyncThunk(
  "company/getCostHistory",
  async (queries: BaseQueries) => {
    queries = serverQueries(queries) as BaseQueries;

    try {
      const response = await client.get(Endpoint.COST_HISTORY, queries, {
        baseURL: COMPANY_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return refactorRawItemListResponse(response.data);
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getClientCompanies = createAsyncThunk(
  "company/getClientCompanies",
  async (queries: GetClientConpanyListQueries & { concat?: boolean }) => {
    queries = serverQueries(
      { ...queries, sort: "created_time=-1" },
      ["email", "name"],
      undefined,
      ["status"],
    ) as GetClientConpanyListQueries;

    try {
      const response = await client.get(Endpoint.CLIENT_COMPANIES, queries, {
        baseURL: COMPANY_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return refactorRawItemListResponse(response.data);
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getClientCompaniesMemberOptions = createAsyncThunk(
  "company/getClientCompaniesMemberOptions",
  async ({
    concat,
    ...queries
  }: GetEmployeeListQueries & { concat?: boolean }) => {
    queries = serverQueries(
      { ...queries, sort: "created_time=-1" },
      ["email", "fullname"],
      undefined,
      ["status"],
    ) as GetEmployeeListQueries;

    try {
      const response = await client.get(Endpoint.USERS, queries, {
        baseURL: AUTH_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return { ...refactorRawItemListResponse(response.data), concat };
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const createClientCompany = createAsyncThunk(
  "company/createClientCompany",
  async (data: ClientCompany) => {
    try {
      const response = await client.post(Endpoint.CLIENT_COMPANIES, data, {
        baseURL: COMPANY_API_URL,
      });

      if (response?.status === HttpStatusCode.CREATED) {
        return response.data?.id
          ? { ...response.data, contact: data?.contact }
          : response.data?.body;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const deleteClientCompany = createAsyncThunk(
  "company/deleteClientCompany",
  async (id: string) => {
    try {
      const response = await client.delete(
        `${Endpoint.CLIENT_COMPANIES}/${id}`,
        {
          baseURL: COMPANY_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
        return id;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const multipleDeleteClientCompany = createAsyncThunk(
  "company/multipleDeleteClientCompany",
  async (ids: string[]) => {
    try {
      const response = await client.post(
        `${Endpoint.CLIENT_COMPANIES_MULTI}`,
        { ids },
        {
          baseURL: COMPANY_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
        return ids;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getClientCompanyDetails = createAsyncThunk(
  "company/getClientCompany",
  async (id: string) => {
    try {
      const response = await client.get(
        `${Endpoint.CLIENT_COMPANIES_DETAIL}/${id}`,
        {},
        {
          baseURL: COMPANY_API_URL,
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

export const updateClientCompany = createAsyncThunk(
  "company/updateClientCompany",
  async (data: ClientCompany) => {
    const contact = data.contact;
    const body: ClientCompany = {
      ...data,
      contact: {
        name: contact?.name,
        avatar: contact?.avatar,
        address: contact?.address,
        email: contact?.email,
        phone: contact?.phone,
        position: contact?.position,
        website: contact?.website,
      },
    };
    try {
      const response = await client.put(
        `${Endpoint.CLIENT_COMPANIES}/${data?.id}`,
        body,
        {
          baseURL: COMPANY_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
        return response.data?.id
          ? { ...response.data, contact: data?.contact }
          : response.data?.body;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);
