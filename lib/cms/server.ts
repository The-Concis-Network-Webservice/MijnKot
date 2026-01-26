import type { UserRole } from "../../types";
import { getSession } from "../auth";

export async function getUserFromRequest() {
  const session = await getSession();
  if (!session) {
    return { user: null, role: null };
  }
  return {
    user: { id: session.id, email: session.email },
    role: session.role as UserRole
  };
}

