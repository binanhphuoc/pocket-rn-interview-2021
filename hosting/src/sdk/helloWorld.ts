import firebaseFunctions from "./index";

export async function helloWorld(): Promise<void> {
  const res = await firebaseFunctions.httpsCallable('helloWorld')({});
  console.log(res);
}