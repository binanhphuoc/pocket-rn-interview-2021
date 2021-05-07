
// const COLLECTION_NAME = "user_appointment_connection";

/**
 * host and participant as a pair is unique
 */
// type UserAppointmentConnection = {
//   id: ID;
//   host: ID;
//   participant: ID;
//   status: string; // accepted, declined, maybe
// };

// const defaultValues = {
//   status: "maybe",
// };

// const create = async (input: {
//   data:
//     InputData<Optional<UserAppointmentConnection, keyof typeof defaultValues>>;
// }): Promise<UserAppointmentConnection> => {
//   const res = await firestore.collection(COLLECTION_NAME).add(input.data);
//   const doc = await res.get();
//   const data = doc.exists ? doc.data() : undefined;
//   if (!data) {
//     return Promise.reject(RECORD_NOT_FOUND);
//   }
//   return {
//     id: res.id,
//     email: data.email,
//   };
// };

// const deleteObject = async (input: { where: WhereInput }): Promise<void> => {
//   const {
//     where: {id},
//   } = input;
//   const res = firestore.collection(COLLECTION_NAME).doc(id);
//   const doc = await res.get();
//   if (!doc.exists) {
//     return Promise.reject(RECORD_NOT_FOUND);
//   }
//   await res.delete();
//   return Promise.resolve();
// };

// const findUnique = async (input: { where: WhereInput }): Promise<Session> => {
//   const {
//     where: {id},
//   } = input;
//   const res = firestore.collection(COLLECTION_NAME).doc(id);
//   const doc = await res.get();
//   if (!doc.exists) {
//     return Promise.reject(RECORD_NOT_FOUND);
//   }
//   return Promise.resolve({
//     id: res.id,
//     email: doc.data()?.email,
//   });
// };

export default {
};
