import type { users } from "@prisma/client";
import type { Request } from "express";

export interface UserRequest extends Request {
  user? : users
}