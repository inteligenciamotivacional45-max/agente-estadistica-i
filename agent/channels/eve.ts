import { eveChannel } from "eve/channels/eve";
import {
  ForbiddenError,
  localDev,
  vercelOidc,
  type AuthFn,
} from "eve/channels/auth";
import { closedAulaMessage, getAulaState } from "../lib/aula";
import { getClassroomUser } from "../lib/session";

const classroomAuth: AuthFn<Request> = async (request) => {
  const user = await getClassroomUser(request);
  if (user === null) {
    return null;
  }

  if (user.role !== "teacher") {
    const aula = getAulaState();
    if (!aula.isOpen) {
      throw new ForbiddenError({
        message: closedAulaMessage(aula),
      });
    }
  }

  return {
    attributes: {
      email: user.email,
      name: user.name ?? "",
      role: user.role,
    },
    authenticator: "google",
    issuer: "umss-aula",
    principalId: user.email,
    principalType: "user",
  };
};

export default eveChannel({
  auth: [classroomAuth, vercelOidc(), localDev()],
});
