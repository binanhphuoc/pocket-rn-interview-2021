import { attach, parse } from "../cookie";
import firebaseFunctions from "./conf";
import { extractErrors, handleUnexpectedErrors, UnexpectedError } from "./ErrorUtils";

type Appointment = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  organizer: {
    id: string;
    email: string;
  };
  participants: {
    id: string;
    email: string;
    decision: string;
  }[];
};

export type GetAppointmentOfUserError = "USER_NOT_LOGGED_IN" | "UNHANDLED_SERVER_ERROR" | UnexpectedError;
export async function getAppointmentOfUser(): Promise<Appointment[]> {
  return firebaseFunctions.httpsCallable("getAppointmentOfUser")(attach({}))
    .then(({ data }) => {
      parse(data);
      return extractErrors(data);
    }).catch(handleUnexpectedErrors);
};

export type CreateAppointmentError = "FIELDS_NOT_PROVIDED_PROPERLY" | "PARTICIPANT_NOT_FOUND" | "USER_NOT_LOGGED_IN" | "UNHANDLED_SERVER_ERROR" | UnexpectedError;
export async function createAppointment(input: {
  title: string;
  startDate: string;
  endDate: string;
  participantList: string[];
}): Promise<Appointment[]> {
  return firebaseFunctions.httpsCallable("createAppointment")(attach(input))
    .then(({ data }) => {
      parse(data);
      return extractErrors(data);
    }).catch(handleUnexpectedErrors);
};