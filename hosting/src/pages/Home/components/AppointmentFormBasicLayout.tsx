import { AppointmentForm } from "@devexpress/dx-react-scheduler-material-ui";

const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }: AppointmentForm.BasicLayoutProps) => {
  const onCustomFieldChange = (nextValue: string) => {
    onFieldChange({ customField: nextValue });
  };

  return (
    <AppointmentForm.BasicLayout
      appointmentData={appointmentData}
      onFieldChange={onFieldChange}
      {...restProps}
    >
      This is just a test
    </AppointmentForm.BasicLayout>
  );
};

export default BasicLayout;