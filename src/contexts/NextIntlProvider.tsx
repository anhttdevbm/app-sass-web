import { memo } from "react";
import {
  AbstractIntlMessages,
  IntlError,
  IntlErrorCode,
  NextIntlClientProvider,
} from "next-intl";
import { Locale } from "constant/types";

type NextIntlProviderProps = {
  children: React.ReactNode;
  locale: Locale;
  messages: AbstractIntlMessages;
};

const NextIntlProvider = (props: NextIntlProviderProps) => {
  const { children, locale, messages } = props;
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      onError={onError}
      getMessageFallback={getMessageFallback}
    >
      {children}
    </NextIntlClientProvider>
  );
};

export default memo(NextIntlProvider);

const onError = (error: IntlError) => {
  // Do nothing!
};

const getMessageFallback = ({
  namespace,
  key,
  error,
}: {
  error: IntlError;
  key: string;
  namespace?: string;
}) => {
  const path = [namespace, key].filter((part) => part != null).join(".");

  if (error.code === IntlErrorCode.MISSING_MESSAGE) {
    return "";
  } else {
    return `Dear developer, please fix this message: ${path}`;
  }
};
