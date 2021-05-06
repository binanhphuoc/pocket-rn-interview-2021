import { attach, parse } from "../cookie";
import firebaseFunctions from "./index";

export async function helloWorld(): Promise<void> {
  const { data } = await firebaseFunctions.httpsCallable('signUpUser')(attach({ email: "binanhphuoc@gmail.com", password: "hello" }));
  parse(data);
  console.log(data);
}