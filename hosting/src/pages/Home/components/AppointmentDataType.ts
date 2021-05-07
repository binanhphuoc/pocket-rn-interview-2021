export type Participant = {
  firstName: string;
  lastName: string;
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