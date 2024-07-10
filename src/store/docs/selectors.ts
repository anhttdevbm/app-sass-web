import { Endpoint, client } from "api";
import { DataStatus, HttpStatusCode } from "constant/enums";
import { AN_ERROR_TRY_AGAIN, DOCS_API_URL } from "constant/index";
import { useRouter } from "next-intl/client";
import { useCallback, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getDocCustom, getDocs, updateDocCustom } from "./actions";
import {
  changeDocInfo,
  changeId,
  changePermDoc,
  getDocDetails,
} from "./reducer";

const useDocs = () => {
  const [loading, setLoading] = useState(false);
  const IdUser = useAppSelector((data) => data?.app?.user?.id);

  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const {
    docs: items,
    docsStatus: status,
    docsError: error,
    docsFilters: filters,

    getDocCustomStatus,
    docCustom
  } = useAppSelector((state) => state.doc, shallowEqual);
  const { pageIndex, pageSize, totalDocs, totalPages } = useAppSelector(
    (state) => state.doc.docsPaging,
  );

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetDocs = useCallback(
    async (queries) => {
      await dispatch(getDocs(queries));
    },
    [dispatch],
  );

  const onCreateDoc = async (projectId?: string, content?: string) => {
    setLoading(true);
    try {
      const response = await client.post(
        Endpoint.DOCS,
        {
          name: "No Name",
          description: "",
          project_id: projectId,
          content,
        },
        {
          baseURL: DOCS_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.CREATED) {
        dispatch(changeId(response.data.id));
        push(`/documents/${response.data.id}`);
        dispatch(getDocDetails(response.data));
        return response.data.id;
      }
      setLoading(false);
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const handleUpdateDoc = async (data, id) => {
    await client.put(Endpoint.DOCS + `/${id}`, data, {
      baseURL: "http://113.192.9.79:6813/api/v1",
    });
  };

  const handleGetDocDetail = async (id, content?: string) => {
    const resPrem = await client.get(
      Endpoint.PERM_DOCS + id,
      {},
      {
        baseURL: DOCS_API_URL,
      },
    );
    const isView = resPrem.data.find((e) => e?.user?.id === IdUser);

    dispatch(changeId(id));
    dispatch(changePermDoc(isView?.perm || ""));

    if (!isView?.perm) {
      return;
    }

    console.log({ id });

    const res = await client.get(
      Endpoint.DETAIL_DOCS + id,
      {},
      {
        baseURL: DOCS_API_URL,
      },
    );

    if (res.status === HttpStatusCode.OK) {
      console.log({ data: res.data });
      if (content) {
        res.data.content = content;
      }
      dispatch(getDocDetails(res.data));
    }
  };

  const onGetDocCustom = useCallback(
    async (id: string) => {
      const actionResult = await dispatch(getDocCustom(id));
      if (getDocCustom.fulfilled.match(actionResult)) {
        return actionResult.payload;
      }
    },
    [dispatch],
  );

  const onUpdateDocCustom = useCallback(
    async (id: string, data: { content: string }) => {
      await dispatch(updateDocCustom({id, data}));
    },
    [dispatch],
  );

  return {
    items,
    status,
    error,
    filters,
    isIdle,
    isFetching,
    pageIndex,
    pageSize,
    totalItems: totalDocs,
    totalPages,
    onGetDocs,
    onCreateDoc,
    loading,
    handleUpdateDoc,
    handleGetDocDetail,
    onGetDocCustom,
    docCustom,
    onUpdateDocCustom
  };
};

export { useDocs };
