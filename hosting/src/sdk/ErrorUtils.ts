enum ResponseStatus {
  SUCCESS = "success",
  CLIENT_ERROR = "client_error",
  INTERNAL_ERROR = "internal_error"
}

export const extractErrors = async (dataResponseFromServer: {
  status: ResponseStatus;
  payload?: any; // eslint-disable-line
  errors?: any[]; // eslint-disable-line
}): Promise<any> => { // eslint-disable-line
  const { status, payload, errors } = dataResponseFromServer;
  if (status !== "success" || errors) {
    return Promise.reject(errors);
  }
  return payload;
}

export type UnexpectedError = "UNEXPECTED_ERROR";

export const handleUnexpectedErrors = async (err: Error): Promise<void> => {
  if (Array.isArray(err)) {
    return Promise.reject(err);
  }
  return Promise.reject(["UNEXPECTED_ERROR"]);
}