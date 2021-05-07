import { Appointment as RawAppointment } from "../../../sdk/Appointment.sdk";

export type Participant = {
  id: string;
  email: string;
  isOrganizer: boolean;
  decision: "accepted" | "maybe" | "declined";
};

export type Appointment = {
  title: string;
  startDate: Date;
  endDate: Date;
  id: string;
  participants: Participant[];
};

export const formatAppointmentRawData = ({ startDate, endDate, participants, ...rest }: RawAppointment) => ({
  startDate: new Date(startDate),
  endDate: new Date(endDate),
  ...rest,
  participants: participants.map(((participantInfo) => ({
    isOrganizer: participantInfo.email === rest.organizer.email,
    ...participantInfo,
    decision: participantInfo.decision as ("maybe" | "accepted" | "declined")
  })))
});