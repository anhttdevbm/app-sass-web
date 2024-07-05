import { useEffect, useMemo, useRef, useState } from "react";
import {
  getPath,
  parseURLSearchParams,
  stringifyURLSearchParams,
} from "utils/index";
import { usePathname, useRouter } from "next-intl/client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { OPTIONS } from "components/Pagination";
import { useSearchParams } from "next/navigation";

const useQueryParams = () => {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const pathname = usePathname();

  const hasInitQueryRef = useRef<boolean>(false);
  const [initQuery, setInitQuery] = useState<Params>({});
  const [isReady, setIsReady] = useState<boolean>(false);

  const query = useMemo(
    () => parseURLSearchParams(searchParams),
    [searchParams],
  );

  const fullPath = useMemo(() => {
    return getPath(pathname, query);
  }, [pathname, query]);

  useEffect(() => {
    if (hasInitQueryRef.current) return;
    const queryParsed = parseURLSearchParams(searchParams);
    if (
      !queryParsed["pageSize"] ||
      OPTIONS.some((item) => item.value == queryParsed["pageSize"])
    ) {
      setInitQuery(queryParsed);
      hasInitQueryRef.current = true;
      setIsReady(true);
    } else {
      push(
        `${pathname}${stringifyURLSearchParams({
          ...queryParsed,
          pageSize: OPTIONS[0].value,
        })}`,
      );
    }
  }, [pathname, push, searchParams]);

  return {
    isReady,
    query,
    initQuery,
    fullPath,
  };
};

export default useQueryParams;
