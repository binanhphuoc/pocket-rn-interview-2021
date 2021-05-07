import * as functions from "firebase-functions";
import { Cookie, parseCookie } from "../auth/parse";
import models from "../models";
import { RECORD_NOT_FOUND } from "../models/FirestoreUtils/ErrorInterface";
import { retrieveOrganizerInfoForEachApt, retrieveParticipantListForEachApt } from "./AppointmentUtils";
import ResponseStatus from "./GeneralUtils/ResponseStatus";

type AppointmentPayload = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
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

export const getAppointmentOfUser = functions.https.onCall(parseCookie(async (
  _data: undefined,
  cookie: Cookie
): Promise<{
  status: ResponseStatus;
  payload?: AppointmentPayload[];
  errors?: ("USER_NOT_LOGGED_IN" | "UNHANDLED_SERVER_ERROR")[]
}> => {
  if (!cookie) {
    return {
      status: ResponseStatus.CLIENT_ERROR,
      errors: ["USER_NOT_LOGGED_IN"]
    }
  }

  return models.user.findUnique({
    where: {
      email: cookie.email
    }
  })
  .then(function retrieveAptIdList(user) {
    return models.connectionAppointmentParticipant.findMany({
      where: {
        participantId: user.id
      }
    });
  })
  .then(function retrieveAptInfoList(aptIdList) {
    return Promise.all(aptIdList.map(({ appointmentId }) => {
      return models.appointment.findUnique({
        where: {
          id: appointmentId
        }
      });
    }));
  })
  .then(retrieveOrganizerInfoForEachApt)
  .then(retrieveParticipantListForEachApt)
  .then(payload => ({
    status: ResponseStatus.SUCCESS,
    payload
  })).catch(err => {
    console.log(err);
    return {
      status: ResponseStatus.INTERNAL_ERROR,
      errors: ["UNHANDLED_SERVER_ERROR"]
    };
  });
}));

export const createAppointment = functions.https.onCall(parseCookie(async (
  data: {
    title: string;
    startDate: string;
    endDate: string;
    participantList: [string];
  },
  cookie: Cookie
): Promise<{
  status: ResponseStatus;
  payload?: AppointmentPayload;
  errors?: ("FIELDS_NOT_PROVIDED_PROPERLY" | "PARTICIPANT_NOT_FOUND" | "USER_NOT_LOGGED_IN" | "UNHANDLED_SERVER_ERROR")[]
}> => {
  if (!cookie) {
    return {
      status: ResponseStatus.CLIENT_ERROR,
      errors: ["USER_NOT_LOGGED_IN"]
    }
  }

  const { startDate , endDate , title, participantList } = data;
  if (!startDate || !endDate || !title || !participantList) {
    console.log(participantList);
    return {
      status: ResponseStatus.CLIENT_ERROR,
      errors: ["FIELDS_NOT_PROVIDED_PROPERLY"]
    };
  }

  let organizerId = "";
  const didCreateAptAndFormatPayload = models.user.findUnique({
    where: {
      email: cookie.email
    }
  })
  .then(({ id }) => (organizerId = id))
  .then(() => {
    if (!participantList.find((email) => email === cookie.email)) {
      participantList.push(cookie.email);
    }
    return Promise.all(participantList.map(participantEmail =>
      models.user.findUnique({
        where: {
          email: participantEmail
        }
      })))
    .then(participantRecordList => Promise.all([
      participantRecordList, 
      models.appointment.create({
        data: {
          title,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          organizerId
        }
      })
    ]))
    .then(([participantRecordList, apt]) => Promise.all([Promise.all(
      participantRecordList.map(({ id, email }) => 
        models.connectionAppointmentParticipant.create({
          data: {
            participantId: id,
            appointmentId: apt.id,
            decision: email === cookie.email ? "accepted" : "maybe"
          }
        }).then(({ decision, participantId }) => ({
          id: participantId,
          email,
          decision
        }))
      )),
      apt
    ])
    .then(([formattedParticipantList, apt]) => ({
      id: apt.id,
      title: apt.title,
      startDate: apt.startDate.toString(),
      endDate: apt.endDate.toString(),
      organizer: {
        id: apt.organizerId,
        email: cookie.email
      },
      participants: formattedParticipantList
    })));
  });

  return didCreateAptAndFormatPayload
  .then(payload => {
    return {
      status: ResponseStatus.SUCCESS,
      payload
    }
  })
  .catch(err => {
    if (err === "RECORD_NOT_FOUND") {
      return {
        status: ResponseStatus.CLIENT_ERROR,
        errors: ["PARTICIPANT_NOT_FOUND"]
      }
    }
    console.error(err);
    return {
      status: ResponseStatus.INTERNAL_ERROR,
      errors: ["UNHANDLED_SERVER_ERROR"]
    }
  })
}));

export const updateAppointmentDecision = functions.https.onCall(parseCookie(
  async (
    data: {
      appointmentId: string;
      decision: string;
    },
    cookie
  ): Promise<{
    status: ResponseStatus;
    errors?: ("INVALID_DECISION" | "APPOINTMENT_NOT_FOUND" | "USER_NOT_LOGGED_IN" | "UNHANDLED_SERVER_ERROR")[]
  }> => {
    if (!cookie) {
      return {
        status: ResponseStatus.CLIENT_ERROR,
        errors: ["USER_NOT_LOGGED_IN"]
      };
    }

    return models.user.findUnique({
      where: {
        email: cookie.email
      }
    })
    .then(function validateDecision(user) {
      if (["maybe", "accepted", "declined"].findIndex(
          acceptedValue => data.decision === acceptedValue) < 0) {
        return Promise.reject("INVALID_DECISION");
      }
      return user;
    })
    .then((({ id: userId }) => 
      models.connectionAppointmentParticipant.update({
        where: {
          appointmentId: data.appointmentId,
          participantId: userId
        },
        data: {
          decision: data.decision
        }
      })
    )).then(() => ({
      status: ResponseStatus.SUCCESS
    })).catch(err => {
      if (err !== "INVALID_DECISION" && err !== RECORD_NOT_FOUND) {
        return {
            status: ResponseStatus.INTERNAL_ERROR,
            errors: ["UNHANDLED_SERVER_ERROR"]
        };
      }
      return {
          status: ResponseStatus.CLIENT_ERROR,
          errors: [err === RECORD_NOT_FOUND ? 
            "APPOINTMENT_NOT_FOUND" : "INVALID_DECISION"]
      };
    });
  }
));