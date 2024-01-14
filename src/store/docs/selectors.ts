import { Endpoint, client } from "api";
import { DataStatus, HttpStatusCode } from "constant/enums";
import { AN_ERROR_TRY_AGAIN, DOCS_API_URL } from "constant/index";
import { useRouter } from "next-intl/client";
import { useCallback, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getDocs } from "./actions";
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

  const onCreateDoc = async () => {
    setLoading(true);
    try {
      const response = await client.post(
        Endpoint.DOCS,
        {
          name: "No Name",
          description: "",
          // "project_id":"78537730-5155-11ee-a41a-97ec118da8c5",
        },
        {
          baseURL: DOCS_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.CREATED) {
        dispatch(changeDocInfo(response.data));
        push(`/documents/${response.data.id}`);
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

  const handleGetDocDetail = async (id) => {
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

    const res = await client.get(
      Endpoint.DETAIL_DOCS + id,
      {},
      {
        baseURL: DOCS_API_URL,
      },
    );

    if (res.status === HttpStatusCode.OK) {
      dispatch(getDocDetails(res.data));
    }
  };

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
  };
};

export { useDocs };
