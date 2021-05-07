import AppointmentModel from "./Appointment.model";
import AppointmentParticipantModel from "./AppointmentParticipant.model";
import SessionModel from "./Session.model";
import UserModel from "./User.model";

export default {
  user: UserModel,
  session: SessionModel,
  appointment: AppointmentModel,
  connectionAppointmentParticipant: AppointmentParticipantModel
};
