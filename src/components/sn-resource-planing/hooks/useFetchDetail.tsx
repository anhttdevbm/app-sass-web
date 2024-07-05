import { Endpoint, client } from "api";
import { AN_ERROR_TRY_AGAIN, AUTH_API_URL } from "constant/index";
import { User } from "constant/types";
import { useCallback, useEffect, useState } from "react";
import StringFormat from "string-format";
import { Project } from "store/project/reducer";
import { HttpStatusCode } from "constant/enums";

export const useFetchDetail = (projectId: string, userId: string) => {
  const [project, setProject] = useState<Project>();
  const [user, setUser] = useState<User>();

  const fetchProject = useCallback(async () => {
    try {
      const response = await client.get(
        StringFormat(Endpoint.PROJECT_ITEM, { id: projectId }),
      );

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  }, [projectId]);

  const fetchUser = async () => {
    try {
      const response = await client.get(
        StringFormat(Endpoint.USER_ITEM, { id: userId }),
        undefined,
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
  };

  useEffect(() => {
    if (projectId) {
      fetchProject().then((res) => {
        setProject(res);
      });
    }
    if (userId) {
      fetchUser().then((res) => {
        setUser(res);
      });
    }
  }, [projectId, userId]);

  return {
    projectDetail: project,
    userDetail: user,
  };
};
