import models from "../models";
import {COOKIE_KEY} from "./constants";

export default async (response: Record<string, any>): // eslint-disable-line
    Promise<string | undefined> => {
  return models.session.findUnique({
    where: {
      id: response[COOKIE_KEY],
    },
  })
      .then(({email}) => email)
      .catch(() => {
        return undefined;
      });
};
