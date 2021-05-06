import models from "../models"
import { COOKIE_KEY } from "./constants";

export default async (response: Record<string, any>): Promise<string> => {
  const session = await models.session.findUnique({
    where: {
      id: response[COOKIE_KEY]
    }
  });
  return session.email;
}