import { deleteMany as deleteManyConnection } from "./AppointmentParticipant.model";
import { ID, InputData, WhereInput } from "./FirestoreUtils/BasicTypes";
import { RECORD_NOT_FOUND } from "./FirestoreUtils/ErrorInterface";
import firestore from "./FirestoreUtils/Instance";

const COLLECTION_NAME = "appointment";

// link to @User through @AppointParticipantConnection
type Appointment = {
  id: ID;
  title: string;
  startDate: Date;
  endDate: Date;
  organizerId: ID;
};

const create = async (input: {
  data: InputData<Appointment>;
}): Promise<Appointment> => {
  const res = await firestore.collection(COLLECTION_NAME).add(input.data);
  const doc = await res.get();
  const data = doc.exists ? doc.data() : undefined;
  if (!data) {
    return Promise.reject(RECORD_NOT_FOUND);
  }
  return {
    id: res.id,
    title: data.title,
    startDate: data?.startDate.toDate(),
    endDate: data?.endDate.toDate(),
    organizerId: data.organizerId,
  };
};

const deleteObject = async (input: { where: WhereInput }): Promise<void> => {
  const {
    where: {id},
  } = input;
  const res = firestore.collection(COLLECTION_NAME).doc(id);
  const doc = await res.get();
  if (!doc.exists) {
    return Promise.reject(RECORD_NOT_FOUND);
  }
  await Promise.all([
    deleteManyConnection({ where: { appointmentId: id }}),
    res.delete()
  ]);
  return Promise.resolve();
};

const findUnique = async (input: { where: WhereInput }): Promise<Appointment> => {
  const {where} = input;

  const res = firestore.collection(COLLECTION_NAME).doc(where.id);
  const doc = await res.get();

  if (!doc.exists) {
    return Promise.reject(RECORD_NOT_FOUND);
  }

  const data = doc.data();
  if (data) {
    data.id = doc.id;
  }

  return Promise.resolve({
    id: data?.id,
    title: data?.title,
    startDate: data?.startDate.toDate(),
    endDate: data?.endDate.toDate(),
    organizerId: data?.organizerId
  });
};

export default {
  create,
  delete: deleteObject,
  findUnique
};
