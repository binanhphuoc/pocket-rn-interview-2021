import models from "../models";

// eslint-disable-next-line
export default async (sessionId: string): Promise<void> => {
  return models.session.delete({
    where: {
      id: sessionId,
    },
  });
};
