import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';
import type { users } from '@prisma/client';

export class Utils {
  static async isUsernameAlreadyExist(user: any) {
    const count = await prismaClient.users.count({
      where: {
        username: user.username,
      },
    });

    if (count !== 0) {
      throw new ResponseError(400, 'User is already exist')
    };
  }

  static async isUserAvailable(user: users){
    const userFromDb = await prismaClient.users.findUnique({
      where: {
        username: user.username,
      }
    });

    if (!userFromDb) {
      throw new ResponseError(404, 'User not found')
    };

    return userFromDb;
  }
}
