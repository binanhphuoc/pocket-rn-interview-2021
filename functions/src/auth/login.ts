import models from "../models"
import {COOKIE_KEY} from "./constants";

export default async (email: string, response: Record<string, any>) => {
  const session = await models.session.create({
    data: {
      email,
    },
  });
  response[COOKIE_KEY] = session.id;
}