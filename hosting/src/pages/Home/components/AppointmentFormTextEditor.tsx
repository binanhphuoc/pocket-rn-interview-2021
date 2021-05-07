import { AppointmentForm } from "@devexpress/dx-react-scheduler-material-ui";

const TextEditor = (props: any) => { // eslint-disable-line
  // eslint-disable-next-line react/destructuring-assignment
  if (props.type === 'multilineTextEditor') {
    return null;
  } return <AppointmentForm.TextEditor {...props} />;
};

export default TextEditor;