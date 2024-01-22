import { ThemeMode } from "constant/enums";
import {
  AN_ERROR_TRY_AGAIN,
  AN_ERROR_TRY_RELOAD_PAGE,
  DARK_THEME_MEDIA_SYSTEM,
  DATE_FORMAT_SLASH,
  DATE_LOCALE_FORMAT,
} from "constant/index";
import { ItemListResponse, OptionFormatNumber } from "constant/types";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { ReadonlyURLSearchParams } from "next/navigation";
import StringFormat from "string-format";
import { clientStorage } from "./storage";
import dayjs, { OpUnitType, QUnitType } from "dayjs";
import { get } from "lodash";

export const parseHashURL = (value: string) => `#${value}`;

export const cleanObject = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paramsObject: { [key: string]: any },
  ignoreKeys: string[] = [],
) => {
  const cloneParamsObject = { ...paramsObject };
  for (const keyParam in paramsObject) {
    if (
      !ignoreKeys.includes(keyParam) &&
      (cloneParamsObject[keyParam] === null ||
        cloneParamsObject[keyParam] === "" ||
        cloneParamsObject[keyParam] === undefined)
    ) {
      delete cloneParamsObject[keyParam];
    }
  }
  return cloneParamsObject;
};

export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  waitFor: number,
) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
};

export const parseURLSearchParams = (
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {};
  searchParams.forEach((value, key) => {
    params[key] = params[key]
      ? Array.isArray(params[key])
        ? [...params[key], value]
        : [params[key], value]
      : value;
  });
  return params;
};

export const stringifyURLSearchParams = (data) => {
  data = cleanObject(data);
  if (!Object.keys(data).length) return "";
  return (
    "?" +
    Object.entries(data)
      .reduce((out: string[], [key, value]) => {
        if (Array.isArray(value)) {
          out = [...out, ...value.map((valueItem) => `${key}=${valueItem}`)];
        } else {
          out.push(`${key}=${value}`);
        }
        return out;
      }, [])
      .join("&")
  );
};

export const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
    .replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
    .replace(/-/g, "");
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getMessageErrorByAPI = (
  error: unknown,
  t: (key: string) => string,
) => {
  const isAnError = [AN_ERROR_TRY_AGAIN, AN_ERROR_TRY_RELOAD_PAGE].includes(
    error?.["message"],
  );
  return typeof error === "string"
    ? error
    : (isAnError ? t(error?.["message"]) : error?.["message"]) ??
        t(AN_ERROR_TRY_AGAIN);
};

export const getDataFromKeys = (data, keys: string[]) => {
  return keys.reduce((outData, key) => {
    outData[key] = data[key];
    return outData;
  }, {});
};

export const getFiltersFromQueries = (
  queries,
  skipValue = [undefined, null, ""],
) => {
  return Object.entries(queries).reduce((out, [key, value]) => {
    if (
      !["pageIndex", "pageSize", "concat"].includes(key) &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      !skipValue.includes(value as any)
    ) {
      out[key] = value;
    }
    return out;
  }, {});
};

export const formatDocResponseToItemResponse = (data: {
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
  docs: any[];
}) => {
  return {
    total: data.totalDocs,
    total_page: data.totalPages,
    page: data.page - 1,
    data: data.docs,
    pageSize: data.limit,
  };
};

export const refactorRawItemListResponse = (rawData: {
  page: number;
  total: number;
  total_page: number;
  data: unknown[];
}) => {
  return {
    ...rawData,
    pageIndex: rawData.page + 1,
    totalItems: rawData.total,
    totalPages: rawData.total_page,
    items: rawData.data,
  } as ItemListResponse;
};

const KEYS = ["page", "size", "sort", "searchType"];

export const serverQueries = (
  {
    pageIndex,
    pageSize,
    ...rest
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  },
  likeKeys?: string[],
  booleanKeys?: string[],
  numberKeys?: string[],
  schemaKeys?: {
    [key: string]: string;
  },
  keys?: string[],
) => {
  const queries = cleanObject({
    ...rest,
    page: pageIndex ? (pageIndex as number) - 1 : undefined,
    size: isNaN(pageSize) ? pageSize : Number(pageSize),
  });

  const data = Object.entries(queries).reduce(
    (out: { [key: string]: string[] }, [key, value]) => {
      if (KEYS.includes(key) || keys?.includes(key)) {
        out[key] = value;
      } else {
        if (likeKeys?.includes(key)) {
          out.query.push(`like(${key},"${value}")`);
        } else if (typeof value === "boolean" || booleanKeys?.includes(key)) {
          const boolValue =
            typeof value === "boolean"
              ? value
              : value === "true" || Number(value) === 1;
          out.query.push(`eq(${key},${boolValue})`);
        } else if (typeof value === "number" || numberKeys?.includes(key)) {
          out.query.push(`eq(${key},${value})`);
        } else {
          const schema = schemaKeys?.[key] ?? "eq";
          out.query.push(`${schema}(${key},"${value}")`);
        }
      }
      return out;
    },
    { query: [] },
  );

  const cleanData = cleanObject(data);

  if (cleanData["query"].length && rest.searchType === "or") {
    cleanData["query"] = `or(${cleanData["query"].join(",")})`;
  } else if (cleanData["query"].length && rest.searchType === "and") {
    cleanData["query"] = `and(${cleanData["query"].join(",")})`;
  } else if (cleanData["query"].length && rest.searchType === "eq") {
    cleanData["query"] = `eq(${cleanData["query"].join(",")})`;
  } else {
    delete cleanData["query"];
  }

  return cleanData;
};

export const serverQueriesOr = (
  {
    pageIndex,
    pageSize,
    ...rest
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  },
  likeKeys?: string[],
  booleanKeys?: string[],
  numberKeys?: string[],
  schemaKeys?: {
    [key: string]: string;
  },
  keys?: string[],
) => {
  const queries = cleanObject({
    ...rest,
    page: pageIndex ? (pageIndex as number) - 1 : undefined,
    size: isNaN(pageSize) ? pageSize : Number(pageSize),
  });

  const data = Object.entries(queries).reduce(
    (out: { [key: string]: string[] }, [key, value]) => {
      if (KEYS.includes(key) || keys?.includes(key)) {
        out[key] = value;
      } else {
        if (likeKeys?.includes(key)) {
          out.query.push(`like(${key},"${value}")`);
        } else if (typeof value === "boolean" || booleanKeys?.includes(key)) {
          const boolValue =
            typeof value === "boolean"
              ? value
              : value === "true" || Number(value) === 1;
          out.query.push(`like(${key},${boolValue})`);
        } else if (typeof value === "number" || numberKeys?.includes(key)) {
          out.query.push(`like(${key},${value})`);
        } else {
          const schema = schemaKeys?.[key] ?? "like";
          out.query.push(`${schema}(${key},"${value}")`);
        }
      }
      return out;
    },
    { query: [] },
  );

  const cleanData = cleanObject(data);

  if (cleanData["query"].length) {
    cleanData["query"] = `or(${cleanData["query"].join(",")})`;
  } else {
    delete cleanData["query"];
  }
  return cleanData;
};

export const formatDate = (
  date?: number | string | Date,
  format?: string,
  fallback?: string,
) => {
  if (!date) return fallback ?? "";
  if (!format) format = DATE_FORMAT_SLASH;
  const dateObj = new Date(date);

  const year = dateObj.getFullYear();

  if (year === 1 || year === 1970) return fallback ?? "";

  if (format === DATE_LOCALE_FORMAT) {
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const day = `0${dateObj.getDate()}`.substr(-2);
  const month = `0${dateObj.getMonth() + 1}`.substr(-2);
  const hours = `0${dateObj.getHours()}`.substr(-2);
  const minutes = `0${dateObj.getMinutes()}`.substr(-2);
  const seconds = `0${dateObj.getSeconds()}`.substr(-2);
  const milliseconds = `${dateObj.getMilliseconds()}`.substr(-2);
  let dateFormat = format.replace("yyyy", year.toString());
  dateFormat = dateFormat.replace("MM", month);
  dateFormat = dateFormat.replace("dd", day);
  dateFormat = dateFormat.replace("HH", hours);
  dateFormat = dateFormat.replace("mm", minutes);
  dateFormat = dateFormat.replace("ss", seconds);
  dateFormat = dateFormat.replace("ms", milliseconds);

  return dateFormat;
};

export const formatNumber = (
  number?: number | null | string,
  options: OptionFormatNumber = {},
) => {
  if (typeof number === "string") return number;
  const {
    numberOfFixed = 4,
    emptyText = "--",
    suffix,
    prefix = "",
    space = true,
    ...localeOption
  } = options;
  const suffixParsed = suffix ? `${space ? " " : ""}${suffix}` : "";
  if (!number && number !== 0) return emptyText + suffixParsed;
  const num = Number(number || 0);
  const maximumFractionDigits = Number.isInteger(num) ? 0 : numberOfFixed;
  return (
    prefix +
    num.toLocaleString("en-US", {
      maximumFractionDigits,
      ...localeOption,
    }) +
    suffixParsed
  );
};

export const formatCurrency = (
  number?: number | null | string,
  options: OptionFormatNumber = {},
) => {
  if (typeof number === "string") return number;
  const {
    numberOfFixed = 4,
    emptyText = "--",
    suffix,
    prefix = "",
    space = true,
    ...localeOption
  } = options;
  const suffixParsed = suffix ? `${space ? " " : ""}${suffix}` : "";
  if (!number && number !== 0) return emptyText + suffixParsed;
  const num = Number(number || 0);
  const maximumFractionDigits = Number.isInteger(num) ? 0 : numberOfFixed;
  if (num > 10000000000) {
    let newNum = num / 1000000;
    while (newNum > 10000000) {
      newNum /= 10;
    }
    return (
      prefix +
      Math.round(newNum)
        .toLocaleString("en-US", {
          maximumFractionDigits: 0,
          ...localeOption,
        })
        .toString() +
      "..." +
      suffixParsed
    );
  }
  return (
    prefix +
    num.toLocaleString("en-US", {
      maximumFractionDigits,
      ...localeOption,
    }) +
    suffixParsed
  );
};

export const getPath = (
  basePath: string,
  queries?: Params,
  data?: { [key: string]: string },
) => {
  queries = cleanObject(queries ?? {});
  const queryString = stringifyURLSearchParams(queries);
  const path = data ? StringFormat(basePath, data) : basePath;
  return path + queryString;
};

export const getFiltersIgnoreId = (filters, key = "id") => {
  const _filters = { ...filters };
  delete _filters[key];
  return _filters;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const removeDuplicateItem = (data: any[], key = "id") => {
  return data.reduce((outArr, currentItem) => {
    const isExisted = outArr.some((item) => item[key] === currentItem[key]);
    if (isExisted) {
      return outArr;
    }
    outArr.push(currentItem);
    return outArr;
  }, []);
};

export const getTheme = (key: string, fallback: ThemeMode): ThemeMode => {
  if (typeof window === "undefined") return fallback;
  try {
    const theme = (clientStorage.get(key) as ThemeMode) || getThemeSystem();
    return theme || fallback;
  } catch (error) {
    // Unsupported
    console.error(error);
  }
  return fallback;
};

export const getThemeSystem = (e?: MediaQueryList): ThemeMode => {
  if (!e) {
    e = window.matchMedia(DARK_THEME_MEDIA_SYSTEM);
  }

  const isDark = e.matches;

  const themeSystem = isDark ? ThemeMode.DARK : ThemeMode.LIGHT;
  return themeSystem;
};

export const getDaysDiff = (
  date_1: Date,
  date_2: Date,
  trick: QUnitType | OpUnitType = "minutes",
) => {
  return dayjs(date_2).diff(dayjs(date_1), trick);
};

export const hasValue = (value?) => {
  return value !== null && value !== "" && value !== undefined;
};

export const checkIsMobile = () => /Android|iPhone/i.test(navigator?.userAgent);

export const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const getMonthShortName = (monthNo) => {
  const date = new Date();
  date.setMonth(monthNo);
  return date.toLocaleString("en-US", { month: "short" });
};

export const renderTimeDiff = (ts: string | Date) => {
  if (!ts) return;
  const currentDate = new Date();
  const date = new Date(ts);
  const timeDiff = getDaysDiff(currentDate, date);
  const timePositive = Math.abs(timeDiff);
  const isShowYear = currentDate.getFullYear() !== date.getFullYear();
  const showDate = `${date.getDate()} ${getMonthShortName(
    Number(date.getMonth()),
  )} ${isShowYear ? date.getFullYear() : ""}`.trim();

  if (timePositive === 0) {
    return "1m";
  } else if (timePositive < 60) {
    return timePositive + "m";
  } else if (timePositive < 1440) {
    return (timePositive / 60).toFixed(0) + "h";
  } else if (timePositive < 4320) {
    return (timePositive / 60 / 24).toFixed(0) + "d";
  } else {
    return showDate;
  }
};

export const formatEstimateTime = (time: string | number, isHour?: boolean) => {
  const totalHours = Math.floor(Number(time) / 60);
  const remainingMinutes = Math.floor(Number(time)) % 60;

  const formattedHours = totalHours < 10 ? `0${totalHours}` : totalHours;
  const formattedMinutes =
    remainingMinutes < 10 ? `0${remainingMinutes}` : remainingMinutes;

  if (isHour) {
    return `${formattedHours}h`;
  }
  return `${formattedHours}:${formattedMinutes}`;
};

export const formatNumberHourToTime = (time: number, isHour?: boolean) => {
  const Hour = Math.floor(time);
  const Minute = Math.floor((time - Hour) * 60);

  const formattedHour = Hour < 10 ? `0${Hour}` : Hour;
  const formattedMinute = Minute < 10 ? `0${Minute}` : Minute;

  if (isHour) {
    return `${formattedHour}h`;
  }
  return `${formattedHour}:${formattedMinute}h`;
};

export const deepEqual = (foo, bar) => {
  const has = Object.prototype.hasOwnProperty;
  let ctor, len;
  if (foo === bar) return true;

  if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
    if (ctor === Date) return foo.getTime() === bar.getTime();
    if (ctor === RegExp) return foo.toString() === bar.toString();

    if (ctor === Array) {
      if ((len = foo.length) === bar.length) {
        while (len-- && deepEqual(foo[len], bar[len]));
      }
      return len === -1;
    }

    if (!ctor || typeof foo === "object") {
      len = 0;
      for (ctor in foo) {
        if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
        if (!(ctor in bar) || !deepEqual(foo[ctor], bar[ctor])) return false;
      }
      return Object.keys(bar).length === len;
    }
  }

  return foo !== foo && bar !== bar;
};

export const copyImage = (url: string) => {
  const img = document.createElement("img");
  img.src = url;
  img.alt = "";
  img?.setAttribute("crossorigin", "anonymous");
  img.onload = (e) => {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    ctx?.drawImage(img, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          return navigator.clipboard
            .write([
              new ClipboardItem({
                ["image/png"]: blob,
              }),
            ])
            .then(() => {
              console.log("Copied");
            });
        }
      },
      "image/png",
      0.9,
    );
  };
};

export const downloadImage = async (url: string, name: string) => {
  try {
    const copiedImage = await fetch(url);
    const blobImage = await copiedImage.blob();
    const href = URL.createObjectURL(blobImage);
    const anchorElement = document.createElement("a");
    anchorElement.href = href;
    anchorElement.download = name;
    document.body.appendChild(anchorElement);
    anchorElement.click();

    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(href);
  } catch (error) {
    throw new Error();
  }
};

export const descendingComparator = (a, b, orderBy) => {
  if (typeof get(a, orderBy) === "string") {
    return get(b, orderBy).localeCompare(get(a, orderBy));
  }
  if (get(b, orderBy) < get(a, orderBy)) return -1;
  if (get(b, orderBy) > get(a, orderBy)) return 1;
  return 0;
};

export const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

export const sortedRowInformation = (rows, comparator) => {
  const stabilizedThis = rows.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

export const toHoursAndMinutes = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
}
