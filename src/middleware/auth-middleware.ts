import type { Response, NextFunction } from "express";
import { prismaClient } from "../application/database";
import type { UserRequest } from "../type/user-request";

export const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {
  const token = req.get('X-API-TOKEN');

  if(token) {
    const user = await prismaClient.users.findFirst({
      where: {
        token
      }
    })

    if(user) {
      req.user = user;
      next();
      return;
    }
  }

  res.status(401).json({
    status: 'error',
    data: {
      errors: 'Unauthorized'
    }
  }).end();
} 