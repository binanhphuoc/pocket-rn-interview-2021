import models from "../models";
import {COOKIE_KEY} from "./constants";

export default async (response: Record<string, any>): Promise<void> => {
  models.session.delete({
    where: {
      id: response[COOKIE_KEY],
    },
  });
  delete response[COOKIE_KEY];
};
