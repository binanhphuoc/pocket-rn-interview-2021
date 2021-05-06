import {ID, InputData} from "./FirestoreUtils/BasicTypes";
import {
  RECORD_NOT_FOUND,
  RECORD_WITH_UNIQUE_FIELD_ALREADY_EXIST,
} from "./FirestoreUtils/ErrorInterface";
import firestore from "./FirestoreUtils/Instance";

const COLLECTION_NAME = "user";

type User = {
  id: ID;
  email: string; // Unique
  password: string;
  appointments?: ID[];
};

const create = async (input: { data: InputData<User> }): Promise<User> => {
  const existingRecordsQueryRef = firestore.collection(COLLECTION_NAME)
      .where("email", "==", input.data.email);
  const existingRecords = await existingRecordsQueryRef.get();
  if (existingRecords.size > 0) {
    return Promise.reject(RECORD_WITH_UNIQUE_FIELD_ALREADY_EXIST);
  }

  const {data: {email, password, appointments}} = input;
  const addNewRecordRef = await firestore.collection(COLLECTION_NAME).add({
    email,
    password,
    appointments: appointments ?? [],
  });
  const createdRecord = await addNewRecordRef.get();
  const data = createdRecord.exists ? createdRecord.data() : undefined;
  if (!data) {
    return Promise.reject(RECORD_NOT_FOUND);
  }
  return {
    id: addNewRecordRef.id,
    email: data.email,
    password: data.password,
    appointments: data.appointments,
  };
};

export default {
  create,
};
