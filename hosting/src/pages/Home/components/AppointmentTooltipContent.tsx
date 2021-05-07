import { AppointmentTooltip } from "@devexpress/dx-react-scheduler-material-ui";
import { FormControlLabel, Grid, makeStyles, Radio, RadioGroup } from "@material-ui/core";
import { useAuth } from "../../../providers/AuthProvider";
import ParticipantList from "./ParticipantList";

const useStyles = makeStyles(() => ({
  textCenter: {
    textAlign: 'center',
  }
}));
const Content = ({
  children, appointmentData, toggleEdit, setDecision, ...restProps
}: AppointmentTooltip.ContentProps & {
  toggleEdit: (shouldAllowEdit: boolean) => void;
  setDecision: (appointmentId: string, decision: "maybe" | "accepted" | "declined") => void;
}) => {
  const classes = useStyles();
  const { user: currentUser } = useAuth();

  if (!appointmentData) {
    return <div></div>;
  }

  const { participants, id: appointmentId } = appointmentData;

  const organizerInfo = (participants as any[]).find(({ isOrganizer }) => isOrganizer);

  if (organizerInfo.email !== currentUser?.email) {
    toggleEdit(false);
  } else {
    toggleEdit(true);
  }

  const userParticipationInfo = (participants as any[]).find(({ email }) => email === currentUser?.email);

  return (
    <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
      <ParticipantList data={participants}/>
      {!userParticipationInfo.isOrganizer && <Grid container alignItems="center">
        <Grid item xs={2} className={classes.textCenter}>
          Going?
        </Grid>
        <Grid item xs={10}>
          <RadioGroup row aria-label="position" name="position" 
              value={userParticipationInfo.decision}
              onChange={(e) => { 
                setDecision(
                  appointmentId as string, 
                  e.target.value as "maybe" | "accepted" | "declined");
              }}>
            <FormControlLabel value="accepted" control={<Radio color="primary" />} label="Accept" />
            <FormControlLabel value="maybe" control={<Radio color="primary" />} label="Maybe" />
            <FormControlLabel value="declined" control={<Radio color="primary" />} label="Decline" />
          </RadioGroup>
        </Grid>
      </Grid>}
    </AppointmentTooltip.Content>
  )
};

export default Content;