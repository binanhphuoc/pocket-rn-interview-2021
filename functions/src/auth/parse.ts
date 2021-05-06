import models from "../models";
import {COOKIE_KEY} from "./constants";

const parseCookieCore = async (requestData: Record<string, any>): // eslint-disable-line
    Promise<{
      sessionId: string;
      email: string;
    } | undefined> => {
  if (!requestData || !requestData[COOKIE_KEY]) {
    return Promise.resolve(undefined);
  }
  const cookieData = requestData[COOKIE_KEY];
  delete requestData[COOKIE_KEY];
  return models.session.findUnique({
    where: {
      id: cookieData,
    },
  })
      .then(({email}) => ({sessionId: cookieData, email}))
      .catch(() => {
        return undefined;
      });
};

// eslint-disable-next-line
type AfterParseFunctionType = (data: any) => any;

export type Cookie = {
  sessionId: string;
  email: string;
} | undefined;

// eslint-disable-next-line
export const parseCookie = (cb: (data: any, cookie: Cookie) => any): AfterParseFunctionType => {
  return async (data: any) => { // eslint-disable-line
    return parseCookieCore(data).then((cookie) => cb(data, cookie));
  };
};
