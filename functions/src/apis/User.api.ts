import * as functions from "firebase-functions";
import models from "../models";
import {hashSync} from "bcrypt";
import ResponseStatus from "./ApiUtils/ResponseStatus";
import {
  RECORD_WITH_UNIQUE_FIELD_ALREADY_EXIST,
} from "../models/FirestoreUtils/ErrorInterface";

const SALT_ROUND = 10;

export const signUpUser = functions.https.onCall(async (data: {
  email: string;
  password: string;
}): Promise<{
  status: ResponseStatus;
  payload?: {
    email: string;
    appointments: string[];
  };
  errors?: ("USER_ALREADY_EXISTS" | "UNHANDLED_SERVER_ERROR")[]
}> => {
  const {email, password} = data;
  return models.user.create({data: {
    email: email,
    password: hashSync(password, SALT_ROUND),
  }}).then(({email, appointments}) => {
    return {
      status: ResponseStatus.SUCCESS,
      payload: {
        email,
        appointments: appointments ?? [],
      },
    };
  }).catch((err) => {
    if (err === RECORD_WITH_UNIQUE_FIELD_ALREADY_EXIST) {
      return {
        status: ResponseStatus.CLIENT_ERROR,
        errors: ["USER_ALREADY_EXISTS"],
      };
    } else {
      return {
        status: ResponseStatus.INTERNAL_ERROR,
        errors: ["UNHANDLED_SERVER_ERROR"],
      };
    }
  });
});
