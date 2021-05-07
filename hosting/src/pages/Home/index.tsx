import { EditingState, IntegratedEditing, ViewState } from '@devexpress/dx-react-scheduler';
import {
  AppointmentForm, Appointments, AppointmentTooltip, DateNavigator, MonthView,
  Scheduler, TodayButton, Toolbar as SchedulerToolbar, ViewSwitcher, WeekView
} from '@devexpress/dx-react-scheduler-material-ui';
import { AppBar, Avatar, Button, CssBaseline, makeStyles, Toolbar, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { useEffect, useState } from 'react';
import { useAuth } from "../../providers/AuthProvider";
import { createAppointment, getAppointmentOfUser } from '../../sdk/Appointment.sdk';
import { Appointment } from "./components/AppointmentDataType";
import AppointmentFormBasicLayout from "./components/AppointmentFormBasicLayout";
import AppointmentFormTextEditor from "./components/AppointmentFormTextEditor";
import AppointmentTooltipContent from "./components/AppointmentTooltipContent";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    position: "fixed",
    top: 0,
    height: "64px"
  },
  title: {
    flexGrow: 1,
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
  },
  paper: {
    height: "calc(100% - 64px)"
  },
}));

const Home = () => {
  const classes = useStyles();
  const { signOut } = useAuth();
  const [allowEdit, setAllowEdit] = useState<boolean>(false);
  const [appointmentData, setAppointmentData] = useState<Appointment[]>([]);

  useEffect(() => {
    getAppointmentOfUser()
      .then((appointmentRawData) => {
        setAppointmentData(
          appointmentRawData.map(({ startDate, endDate, participants, ...rest }) => ({
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            ...rest,
            participants: participants.map(((participantInfo) => ({
              isOrganizer: participantInfo.email === rest.organizer.email,
              ...participantInfo,
              decision: participantInfo.decision as ("maybe" | "accepted" | "declined")
            })))
          })))
      })
      .catch(err => {
        console.error(err);
      })
  }, [])

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Pocket Nurse
          </Typography>
          <Button onClick={signOut}>Sign Out</Button>
          <Avatar />
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Paper classes={{ root: classes.paper }}>
          <Scheduler data={appointmentData} height={"auto"}>
            <ViewState
              defaultCurrentDate={new Date()}
              defaultCurrentViewName="Week"
            />

            <EditingState
              onCommitChanges={({ added, changed, deleted, ...rest }) => { 
                if (added) {
                  createAppointment({
                    title: added.title,
                    startDate: added.startDate?.toString(),
                    endDate: added.endDate?.toString(),
                    participantList: added.participants?.map(
                      ({ email }: { email: string }) => email)
                  }).then(console.log)
                  .catch(console.log);
                }
              }}
            />
            <IntegratedEditing />

            <WeekView startDayHour={9} endDayHour={19} />
            <MonthView />
            <SchedulerToolbar />
            <ViewSwitcher />
            <DateNavigator />
            <TodayButton />
            <Appointments />
            <AppointmentTooltip
              contentComponent={(props) => (<AppointmentTooltipContent {...props} toggleEdit={(allowEdit: boolean) => setAllowEdit(allowEdit)}/>)}
              showOpenButton={allowEdit}
              showDeleteButton={allowEdit}
            />
            <AppointmentForm 
              basicLayoutComponent={(props) => (<AppointmentFormBasicLayout {...props} toggleEdit={(allowEdit: boolean) => setAllowEdit(allowEdit)}/>)}
              textEditorComponent={AppointmentFormTextEditor}
              booleanEditorComponent={() => null}
              readOnly={!allowEdit}
              messages={{
                moreInformationLabel: ''
              }}
            />
          </Scheduler>
        </Paper>
      </main>
    </div>
  );
};

export default Home;