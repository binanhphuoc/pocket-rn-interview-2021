import firebaseFunctions from "./index";

export async function helloWorld(): Promise<void> {
  document.cookie = `lol=hello;max-age=604800;domain=localhost`
  const res = await firebaseFunctions.httpsCallable('signUpUser')({ email: "binanhphuoc@gmail.com", password: "hello"});
  console.log(res);
}