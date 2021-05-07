import { Appointments } from "@devexpress/dx-react-scheduler-material-ui";
import { useAuth } from "../../../providers/AuthProvider";

const getDecisionColor = (decision: string | null | undefined) => {
  if (decision === "maybe" || !decision) {
    return "#5DADE2";
  } else if (decision === "accepted") {
    return "#27AE60";
  }
  return "#EC7063";
}

const Appointment = ({
  children, data, ...restProps
}: Appointments.AppointmentProps) => {
  const { user } = useAuth();
  const participationInfo = data.participants.find(
    ({ email }: { email: string }) => email === user?.email);
  return (
    <Appointments.Appointment
      {...restProps}
      data={data}
      style={{
        backgroundColor: getDecisionColor(participationInfo?.decision),
        borderRadius: "8px",
      }}
    >
      {children}
    </Appointments.Appointment>
  );
};

export default Appointment;