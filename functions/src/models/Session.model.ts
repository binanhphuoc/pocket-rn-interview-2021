import {ID, InputData, WhereInput} from "./FirestoreUtils/BasicTypes";
import {RECORD_NOT_FOUND} from "./FirestoreUtils/ErrorInterface";
import firestore from "./FirestoreUtils/Instance";

const COLLECTION_NAME = "session";

type Session = {
  id: ID;
  email: string;
};

const create = async (input: {
  data: InputData<Session>;
}): Promise<Session> => {
  const res = await firestore.collection(COLLECTION_NAME).add(input.data);
  const doc = await res.get();
  const data = doc.exists ? doc.data() : undefined;
  if (!data) {
    return Promise.reject(RECORD_NOT_FOUND);
  }
  return {
    id: res.id,
    email: data.email,
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
  await res.delete();
  return Promise.resolve();
};

const findUnique = async (input: { where: WhereInput }): Promise<Session> => {
  const {
    where: {id},
  } = input;
  const res = firestore.collection(COLLECTION_NAME).doc(id);
  const doc = await res.get();
  if (!doc.exists) {
    return Promise.reject(RECORD_NOT_FOUND);
  }
  return Promise.resolve({
    id: res.id,
    email: doc.data()?.email,
  });
};

export default {
  create,
  delete: deleteObject,
  findUnique,
};
