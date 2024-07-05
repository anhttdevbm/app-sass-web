import createMiddleware from "next-intl/middleware";
import { i18n } from "./constant";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore locales are readonly
export default createMiddleware(i18n);

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|favicon.ico|images.*\\..*).*)"],
};
