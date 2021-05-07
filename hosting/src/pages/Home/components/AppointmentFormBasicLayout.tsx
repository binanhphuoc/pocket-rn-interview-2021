import { AppointmentForm } from "@devexpress/dx-react-scheduler-material-ui";
import ChipInput from "material-ui-chip-input";
import { useAuth } from "../../../providers/AuthProvider";
import { Participant } from "./AppointmentDataType";
import ParticipantList from "./ParticipantList";

const BasicLayout = ({ onFieldChange, appointmentData, toggleEdit, ...restProps }: 
    AppointmentForm.BasicLayoutProps & {
      toggleEdit?: (shouldAllowEdit: boolean) => void;
    }) => {
  const { user: currentUser } = useAuth();
  const { participants } = appointmentData;
  let isCreateNewIntent = appointmentData.isCreateNewIntent;
  
  const onInvitationChange = (nextValue: string[]) => {
    onFieldChange({ 
      participants: nextValue.map(email => ({ 
        email,
        isOrganizer: currentUser?.email === email,
        decision: currentUser?.email === email ? "accepted" : "maybe"
      })),
      isCreateNewIntent
    });
  };
  
  if (!participants && isCreateNewIntent === undefined) {
    isCreateNewIntent = true;
    toggleEdit && toggleEdit(true);
  } else if (participants && isCreateNewIntent === undefined) {
    isCreateNewIntent = false;
    const organizerInfo = (participants as Participant[]).find(({ isOrganizer }) => isOrganizer);
    if (organizerInfo && organizerInfo.email !== currentUser?.email) {
      toggleEdit && toggleEdit(false);
    } else {
      toggleEdit && toggleEdit(true);
    }
  }

  return (
    <AppointmentForm.BasicLayout
      appointmentData={appointmentData}
      onFieldChange={onFieldChange}
      {...restProps}
    >
      <h2>Invitations</h2>
      {
        isCreateNewIntent && 
        <ChipInput
          onChange={onInvitationChange}
          placeholder={"Type emails to invite..."}
          fullWidth
          newChipKeyCodes={[13, 188]}
        />
      }
      {
        !isCreateNewIntent && 
        <ParticipantList data={participants ?? []} />
      }
    </AppointmentForm.BasicLayout>
  );
};

export default BasicLayout;