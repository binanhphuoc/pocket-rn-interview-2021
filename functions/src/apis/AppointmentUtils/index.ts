import models from "../../models";

export const retrieveOrganizerInfoWithId = async (id: string): Promise<{
  id: string;
  email: string;
}> => {
  return models.user.findUnique({
    where: {
      id
    }
  }).then(({ id, email }) => ({
    id,
    email
  }));
}

export const retrieveOrganizerInfoForEachApt = async (aptList: {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  organizerId: string;
}[]): Promise<{
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  organizer: {
      id: string;
      email: string;
  };
}[]> => {
  return Promise.all(aptList.map(({ organizerId, ...rest }) => 
    retrieveOrganizerInfoWithId(organizerId)
      .then((organizerInfo) => ({
        organizer: organizerInfo,
        ...rest
      }))
  ))
}

export const retrieveParticipantListForEachApt = async (aptList: {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  organizer: {
      id: string;
      email: string;
  };
}[]): Promise<{
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
}[]> => {
  return Promise.all(aptList.map(async ({ id, startDate, endDate, ...rest }) => {
    return models.connectionAppointmentParticipant.findMany({
      where: {
        appointmentId: id
      }
    }).then(function getParticipantIdList(rawAptList) {
      return rawAptList.map(({ participantId, decision }) => ({ 
        id: participantId,
        decision
      }));
    }).then(function getParticipantEmail(participantIdList) {
      return Promise.all(participantIdList.map(({ id, ...rest }) => 
        models.user.findUnique({
          where: {
            id
          }
        }).then(({ email }) => ({
          id,
          email,
          ...rest
        }))
      ));
    }).then(participantList => ({
      id,
      startDate: startDate.toString(),
      endDate: endDate.toString(),
      participants: participantList,
      ...rest
    }));
  }));
}