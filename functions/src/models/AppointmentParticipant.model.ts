import { ID, InputData, Optional, WhereInput } from "./FirestoreUtils/BasicTypes";
import { INVALID_WHERE_ARGS, RECORD_NOT_FOUND, RECORD_WITH_UNIQUE_FIELD_ALREADY_EXIST } from "./FirestoreUtils/ErrorInterface";
import firestore from "./FirestoreUtils/Instance";

const COLLECTION_NAME = "appointment_participant_connection";

/**
 * host and participant as a pair is unique
 */
type AppointmentParticipantConnection = {
  id: ID;
  appointmentId: ID;
  participantId: ID;
  decision: string; // accepted, declined, maybe
};

const defaultValues = {
  decision: "maybe",
};

const create = async (input: {
  data:
    InputData<Optional<AppointmentParticipantConnection, keyof typeof defaultValues>>;
}): Promise<AppointmentParticipantConnection> => {
  Object.keys(defaultValues).forEach((fieldName) => 
    // eslint-disable-next-line
    // @ts-ignore
    (input.data[fieldName] = input.data[fieldName] ?? defaultValues[fieldName]));
  
  const existingRecordsQueryRef = firestore.collection(COLLECTION_NAME)
    .where("appointmentId", "==", input.data.appointmentId)
    .where("participantId", "==", input.data.participantId);
  const existingRecords = await existingRecordsQueryRef.get();
  if (existingRecords.size > 0) {
    return Promise.reject(RECORD_WITH_UNIQUE_FIELD_ALREADY_EXIST);
  }

  const res = await firestore.collection(COLLECTION_NAME).add(input.data);
  const doc = await res.get();
  const data = doc.exists ? doc.data() : undefined;
  if (!data) {
    return Promise.reject(RECORD_NOT_FOUND);
  }
  return {
    id: res.id,
    appointmentId: data.appointmentId,
    participantId: data.participantId,
    decision: data.decision
  };
};

const update = async (input: {
  where: WhereInput | { appointmentId: ID; participantId: ID; },
  data:
    InputData<Partial<AppointmentParticipantConnection>>;
}): Promise<AppointmentParticipantConnection> => {
  const {where} = input;

  let res;
  if ("id" in where) {
    res = firestore.collection(COLLECTION_NAME).doc(where.id);
  } else {
    res = firestore.collection(COLLECTION_NAME)
        .where("appointmentId", "==", where.appointmentId)
        .where("participantId", "==", where.participantId);
  }

  const doc = await res.get();
  if (("exists" in doc && !doc.exists) || ("size" in doc && doc.empty)) {
    return Promise.reject(RECORD_NOT_FOUND);
  }

  if ("exists" in doc) {
    await doc.ref.update(input.data);
  } else if ("size" in doc) {
    await doc.docs[0].ref.update(input.data);
  }

  const snapshot = await res.get();
  let data;
  if ("exists" in snapshot) {
    data = snapshot.data();
  } else if ("size" in doc) {
    data = snapshot.docs[0].data();
  }

  return {
    id: data?.id,
    appointmentId: data?.appointmentId,
    participantId: data?.participantId,
    decision: data?.decision
  };
}

export const deleteMany = async (input: { 
    where: { appointmentId?: ID; participantId?: ID; }
}): Promise<void> => {
  const {where} = input;

  if (Object.keys(where).length === 0) {
    return Promise.reject(INVALID_WHERE_ARGS);
  }

  const res = firestore.collection(COLLECTION_NAME);
  Object.keys(where).forEach((whereKey) => {
    // eslint-disable-next-line
    // @ts-ignore
    res = res.where(whereKey, "==", where[whereKey]);
  })

  const maybeDocs = await res.get();
  if (maybeDocs.empty) {
    return Promise.reject(RECORD_NOT_FOUND);
  }
  
  const deleteList: Promise<any>[] = []; // eslint-disable-line
  maybeDocs.forEach((doc) => deleteList.push(doc.ref.delete()));
  await Promise.all(deleteList);
  
  return Promise.resolve();
};

const findMany = async (input: { 
  where: { appointmentId?: ID; participantId?: ID; }
}): Promise<AppointmentParticipantConnection[]> => {
  const {where} = input;

  if (Object.keys(where).length === 0) {
    return Promise.reject(INVALID_WHERE_ARGS);
  }

  let res = firestore.collection(COLLECTION_NAME);
  Object.keys(where).forEach((whereKey) => {
    // eslint-disable-next-line
    // @ts-ignore
    res = res.where(whereKey, "==", where[whereKey]);
  })

  const maybeDocs = await res.get();
  if (maybeDocs.empty) {
    return Promise.reject(RECORD_NOT_FOUND);
  }

  const retrieveList: Promise<any>[] = []; // eslint-disable-line
  maybeDocs.forEach((doc) => retrieveList.push(
    doc.ref.get()
      .then(res => 
        !res.exists ? Promise.reject(RECORD_NOT_FOUND) : res.data()
      )));
  return Promise.all(retrieveList);
}

export default {
  create,
  update,
  deleteMany,
  findMany
};
