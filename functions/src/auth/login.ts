import models from "../models";
import {COOKIE_KEY} from "./constants";

export default async (
    email: string,
    response: Record<string, any>): Promise<void> => { // eslint-disable-line
  return models.session.create({
    data: {
      email,
    },
  }).then((session) => {
    response[COOKIE_KEY] = session.id;
  });
};
