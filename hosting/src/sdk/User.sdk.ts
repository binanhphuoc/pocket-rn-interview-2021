import { attach, parse } from "../cookie";
import firebaseFunctions from "./conf";
import { extractErrors, handleUnexpectedErrors, UnexpectedError } from "./ErrorUtils";

export type User = {
  email: string;
}

export type SignInUserError = "USER_ALREADY_LOGGED_IN" | "USER_NOT_AUTH" | "UNHANDLED_SERVER_ERROR" | UnexpectedError;
export async function signInUser(input: {
  email: string;
  password: string;
}): Promise<User> {
  const { email, password } = input;
  return firebaseFunctions.httpsCallable("signInUser")(attach({ email, password }))
    .then(({ data }) => {
      parse(data);
      return extractErrors(data);
    }).catch(handleUnexpectedErrors);
}

export type GetCurrentUserError = "USER_NOT_LOGGED_IN" | UnexpectedError;
export async function currentUser(): Promise<User> {
  return firebaseFunctions.httpsCallable("getCurrentUser")(attach({}))
    .then(({ data }) => {
      parse(data);
      return extractErrors(data);
    }).catch(handleUnexpectedErrors);
}

export type SignOutUserError = "USER_NOT_LOGGED_IN" | "UNHANDLED_SERVER_ERROR" | UnexpectedError;
export async function signOutUser(): Promise<void> {
  return firebaseFunctions.httpsCallable("signOutUser")(attach({}))
    .then(({ data }) => {
      parse(data);
      return extractErrors(data);
    }).catch(handleUnexpectedErrors);
}

export type SignUpUserError = "USER_ALREADY_EXISTS" | "UNHANDLED_SERVER_ERROR" | UnexpectedError;
export async function signUpUser(input: {
  email: string;
  password: string;
}): Promise<User> {
  const { email, password } = input;
  return firebaseFunctions.httpsCallable("signUpUser")(attach({ email, password }))
    .then(({ data }) => {
      parse(data);
      return extractErrors(data);
    }).catch(handleUnexpectedErrors);
}