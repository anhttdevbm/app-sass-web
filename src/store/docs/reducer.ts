"use client";
import { AN_ERROR_TRY_AGAIN, DEFAULT_PAGING } from "constant/index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DataStatus, DocAccessibility } from "constant/enums";
import { getDocs } from "./actions";
import { getFiltersFromQueries, removeDuplicateItem } from "utils/index";
import { ItemDocsProps } from "components/sn-docs/detail/LeftSlide/ItemDocs";
/* eslint-disable no-var */

/* eslint-disable @typescript-eslint/no-explicit-any */

export type PageSettingsType = {
  font: string;
  smallText: boolean;
  fullWidth: boolean;
  lock: boolean;
};

export type CoverPictureType = {
  url: string;
  verticalPosition: number;
};

const storedPageInfo: any = null;
const storedWorkspaceInfo: any = null;

export type PageType = {
  id: string;
  reference: string;
  path: string | null;
  icon: string;
  title: string;
  createdAt: Date;
};

export interface WorkspaceState {
  id: string;
  name: string;
  icon: string;
  members: string[];
  pages: PageType[];
}

export type ContentType = {
  type: string;
  content: unknown[];
};

export interface PageState {
  id: string;
  reference: string;
  title: string;
  icon: string;
  coverPicture: CoverPictureType;
  content: any;
  pageSettings: PageSettingsType;
  path: string | null;
  workspaceId: string;
  createdAt: Date;
  updatedAt?: Date;
}

interface Paging {
  pageIndex: number;
  pageSize: number;
  totalPages?: number;
  totalItems?: number;
  totalDocs?: number;
}

export interface IDocs {
  docs: any[];
  docsStatus: DataStatus;
  docsPaging: Paging;
  docsError?: string;
  docsFilters: any;
  title: string;
  docOptions: any[];
  docOptionsStatus: DataStatus;
  docOptionsPaging: Paging;
  docOptionsError?: string;
  docOptionsFilters: Omit<any, "pageIndex" | "pageSize">;
  id: string;
  content: string;
  description: string;
  docDetails: {
    info: {};
    data: ItemDocsProps;
  };
  perm: keyof typeof DocAccessibility;
  project_id: string;
  pageInfo: PageState | null;
  workspaceInfo: WorkspaceState | null;
  docInfo: any;
  contentRow: string;
}

const initialState: IDocs = {
  docs: [],
  contentRow: '',
  docsStatus: DataStatus.IDLE,
  docsPaging: DEFAULT_PAGING,
  docsFilters: {},

  docOptions: [],
  docOptionsStatus: DataStatus.IDLE,
  docOptionsPaging: DEFAULT_PAGING,
  docOptionsFilters: {},
  docInfo: {},
  perm: "FULL_ACCESS",

  docDetails: {
    info: {},
    data: {
      title: "Page",
      // content: {
      //   title: "",
      //   content: "",
      // },
      children: [
        {
          id: "1",
          title: "page 1",
          // content: {
          //   title: "",
          //   content: "",
          // },
          children: [
            {
              id: "1.1",
              title: "page 1.1",
              // content: {
              //   title: "",
              //   content: "",
              // },
              children: [],
            },
          ],
        },
        // {
        //   id: "2",
        //   title: "page 2",
        //   content: {
        //     title: "",
        //     content: "",
        //   },
        //   children: [],
        // },
      ],
    },
  },
  id: "",
  project_id: "all",
  title: "No Name",
  content: "",
  description: "",
  pageInfo: storedPageInfo ? JSON.parse(storedPageInfo) : null,
  workspaceInfo: storedWorkspaceInfo ? JSON.parse(storedWorkspaceInfo) : null,
};

const docSlice = createSlice({
  name: "docs",
  initialState,
  reducers: {
    createPage(state, actions) {
      const { parentId, child } = actions.payload;
      function addChildToParent(parent, childToAdd) {
        if (parent.id === parentId) {
          parent.children.push(childToAdd);
        } else if (parent.children) {
          parent.children.forEach((child) => {
            addChildToParent(child, childToAdd);
          });
        }
      }

      addChildToParent(state, child);
    },
    setPage: (state, action: PayloadAction<PageState>) => {
      state.pageInfo = action.payload;
      localStorage.setItem("pageInfo", JSON.stringify(action.payload));
    },
    clearPage: (state) => {
      state.pageInfo = null;
      localStorage.removeItem("pageInfo");
    },
    setWorkspace: (state, action: PayloadAction<WorkspaceState>) => {
      state.workspaceInfo = action.payload;
      localStorage.setItem("workspaceInfo", JSON.stringify(action.payload));
    },
    clearWorkspace: (state) => {
      state.workspaceInfo = null;
      localStorage.removeItem("workspaceInfo");
    },
    changeContentDoc: (state, action: PayloadAction<any>) => {
      state.content = action.payload;
    },
    changeDocInfo: (state, action: PayloadAction<any>) => {
      state.docInfo = action.payload;
    },
    changeTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    changeDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    changeId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    changeProjectId: (state, action: PayloadAction<string>) => {
      state.project_id = action.payload;
    },
    setContentRow: (state, action: PayloadAction<string>) => {
      state.contentRow = action.payload;
    },
    getDocDetails: (state, action: PayloadAction<any>) => {
      state.content = action.payload?.content || "";
      state.docInfo = action.payload || {};
      state.title = action.payload?.name || "";
      state.description = action.payload?.description || "";
      state.project_id = action.payload?.project_id || "";
    },
    resetDocDetail: (state) => {
      state.content = "";
      state.docInfo = {};
      state.title = "";
      state.description = "";
      state.project_id = "";
    },
    changePermDoc: (state, action) => {
      state.perm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDocs.pending, (state, action) => {
      const prefixKey = action.meta.arg["concat"] ? "docOptions" : "docs";
      state[`${prefixKey}Status`] = DataStatus.LOADING;
      state.docsFilters = getFiltersFromQueries(action.meta.arg);
      state[`${prefixKey}Filters`] = getFiltersFromQueries(action.meta.arg);

      if (action.meta.arg?.concat && action.meta.arg.pageIndex === 1) {
        state.docOptions = [];
      }
      state[`${prefixKey}Paging`].pageIndex = Number(
        action.meta.arg.page ?? DEFAULT_PAGING.pageIndex,
      );
      state[`${prefixKey}Paging`].pageSize = Number(
        action.meta.arg.size ?? DEFAULT_PAGING.pageSize,
      );
    });
    builder.addCase(getDocs.fulfilled, (state, action: PayloadAction<any>) => {
      const { docs: items, concat, ...paging } = action.payload;
      if (concat) {
        state.docOptions = removeDuplicateItem(
          state.docOptions.concat(items as any[]),
        );
      } else {
        state.docs = items as any[];
      }

      const prefixKey = concat ? "docOptions" : "docs";

      state[`${prefixKey}Status`] = DataStatus.SUCCEEDED;
      state[`${prefixKey}Error`] = undefined;
      state[`${prefixKey}Paging`] = Object?.assign(
        state[`${prefixKey}Paging`],
        paging,
      );
    });
    builder.addCase(getDocs.rejected, (state, action) => {
      const prefixKey = action.meta.arg["concat"] ? "docOptions" : "docs";

      state[`${prefixKey}Status`] = DataStatus.FAILED;
      state[`${prefixKey}Error`] = action.error?.message ?? AN_ERROR_TRY_AGAIN;
    });
  },
});

export const {
  createPage,
  clearPage,
  setPage,
  setWorkspace,
  clearWorkspace,
  changeContentDoc,
  changeDocInfo,
  changeId,
  changeTitle,
  getDocDetails,
  resetDocDetail,
  changeProjectId,
  changeDescription,
  changePermDoc,
  setContentRow
} = docSlice.actions;

export default docSlice.reducer;
