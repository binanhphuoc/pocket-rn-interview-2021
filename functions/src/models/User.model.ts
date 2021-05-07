import { ID, InputData, WhereInput } from "./FirestoreUtils/BasicTypes";
import {
  RECORD_NOT_FOUND,
  RECORD_WITH_UNIQUE_FIELD_ALREADY_EXIST
} from "./FirestoreUtils/ErrorInterface";
import firestore from "./FirestoreUtils/Instance";

const COLLECTION_NAME = "user";

type User = {
  id: ID;
  email: string; // Unique
  password: string;
};

const create = async (input: { data: InputData<User> }): Promise<User> => {
  const existingRecordsQueryRef = firestore.collection(COLLECTION_NAME)
      .where("email", "==", input.data.email);
  const existingRecords = await existingRecordsQueryRef.get();
  if (existingRecords.size > 0) {
    return Promise.reject(RECORD_WITH_UNIQUE_FIELD_ALREADY_EXIST);
  }

  const {data: {email, password}} = input;
  const addNewRecordRef = await firestore.collection(COLLECTION_NAME).add({
    email,
    password
  });
  const createdRecord = await addNewRecordRef.get();
  const data = createdRecord.exists ? createdRecord.data() : undefined;
  if (!data) {
    return Promise.reject(RECORD_NOT_FOUND);
  }
  return {
    id: addNewRecordRef.id,
    email: data.email,
    password: data.password
  };
};

const findUnique = async (input: { where: WhereInput | { email: string } }):
  Promise<User> => {
  const {where} = input;

  let res;
  if ("id" in where) {
    res = firestore.collection(COLLECTION_NAME).doc(where.id);
  } else {
    res = firestore.collection(COLLECTION_NAME)
        .where("email", "==", where.email);
  }

  const doc = await res.get();
  if (("exists" in doc && !doc.exists) || ("size" in doc && doc.empty)) {
    return Promise.reject(RECORD_NOT_FOUND);
  }
  let data;
  if ("exists" in doc) {
    data = doc.data();
    if (data) {
      data.id = doc.id;
    }
  } else if ("size" in doc) {
    data = doc.docs[0].data();
    data.id = doc.docs[0].id;
  }
  return Promise.resolve({
    id: data?.id,
    email: data?.email,
    password: data?.password
  });
};

export default {
  create,
  findUnique,
};
