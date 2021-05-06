import * as functions from "firebase-functions";
import models from "../models";
import {hashSync, compareSync} from "bcrypt";
import ResponseStatus from "./ApiUtils/ResponseStatus";
import {
  RECORD_NOT_FOUND,
  RECORD_WITH_UNIQUE_FIELD_ALREADY_EXIST,
} from "../models/FirestoreUtils/ErrorInterface";
import Auth from "../auth";
import {Cookie, parseCookie} from "../auth/parse";

const SALT_ROUND = 10;

export const signUpUser = functions.https.onCall(async (data: {
  email: string;
  password: string;
}): Promise<{
  status: ResponseStatus;
  payload?: {
    email: string;
  };
  errors?: ("USER_ALREADY_EXISTS" | "UNHANDLED_SERVER_ERROR")[]
}> => {
  const {email, password} = data;
  return models.user.create({data: {
    email: email,
    password: hashSync(password, SALT_ROUND),
  }}).then(async function logInUser({email}) {
    const response = {
      status: ResponseStatus.SUCCESS,
      payload: {
        email,
      },
    };
    await Auth.login(email, response);
    return response;
  }).catch((err) => {
    if (err === RECORD_WITH_UNIQUE_FIELD_ALREADY_EXIST) {
      return {
        status: ResponseStatus.CLIENT_ERROR,
        errors: ["USER_ALREADY_EXISTS"],
      };
    } else {
      console.error(err);
      return {
        status: ResponseStatus.INTERNAL_ERROR,
        errors: ["UNHANDLED_SERVER_ERROR"],
      };
    }
  });
});

export const currentUser = functions.https.onCall(parseCookie(async (
    _data: undefined,
    cookie: Cookie
): Promise<{
  status: ResponseStatus;
  payload?: {
    email: string | undefined;
  };
  errors?: ("USER_NOT_LOGGED_IN")[];
}> => {
  if (cookie) {
    return {
      status: ResponseStatus.SUCCESS,
      payload: {
        email: cookie.email,
      },
    };
  } else {
    return {
      status: ResponseStatus.CLIENT_ERROR,
      errors: ["USER_NOT_LOGGED_IN"],
    };
  }
}));

export const signInUser = functions.https.onCall(parseCookie(async (
    data: {
      email: string;
      password: string;
    },
    cookie: Cookie,
): Promise<{
  status: ResponseStatus;
  payload?: {
    email: string | undefined;
  };
  errors?: (
    "USER_ALREADY_LOGGED_IN" | "USER_NOT_AUTH" | "UNHANDLED_SERVER_ERROR")[]
}> => {
  if (cookie) {
    return {
      status: ResponseStatus.CLIENT_ERROR,
      errors: ["USER_ALREADY_LOGGED_IN"],
    };
  }

  const {email, password} = data;
  return models.user.findUnique({where: {email}})
      .then(function validatePassword(userRecord) {
        const {password: hashRecord} = userRecord;
        return compareSync(password, hashRecord);
      }).then(async function maybeSignInUser(isPasswordMatched) {
        if (!isPasswordMatched) {
          return Promise.reject(new Error("USER_NOT_AUTH"));
        }
        const response = {
          status: ResponseStatus.SUCCESS,
          payload: {
            email,
          },
        };
        await Auth.login(email, response);
        return response;
      }).catch((err) => {
        if (err === RECORD_NOT_FOUND || err.message === "USER_NOT_AUTH") {
          return {
            status: ResponseStatus.CLIENT_ERROR,
            errors: ["USER_NOT_AUTH"],
          };
        }
        console.error(err);
        return {
          status: ResponseStatus.INTERNAL_ERROR,
          errors: ["UNHANDLED_SERVER_ERROR"],
        };
      });
}));


export const signOutUser = functions.https.onCall(parseCookie(async (
    _data: undefined,
    cookie: Cookie,
): Promise<{
    status: ResponseStatus;
    errors?: (
      "USER_NOT_LOGGED_IN" | "UNHANDLED_SERVER_ERROR")[]
    }> => {
  if (!cookie) {
    return {
      status: ResponseStatus.CLIENT_ERROR,
      errors: ["USER_NOT_LOGGED_IN"],
    };
  }

  return Auth.logout(cookie.sessionId).then(() => {
    return {
      status: ResponseStatus.SUCCESS,
    };
  }).catch((err) => {
    console.error(err);
    return {
      status: ResponseStatus.INTERNAL_ERROR,
      errors: ["UNHANDLED_SERVER_ERROR"],
    };
  });
}));

