import type { users } from '@prisma/client';
import { prismaClient } from '../application/database';
import { logger } from '../application/logging';
import { ResponseError } from '../error/response-error';
import {
  toUserResponse,
  type CreateUserRequest,
  type LoginUserRequest,
  type UpdateUserRequest,
  type UserResponse,
} from '../model/user-model';
import { Utils } from '../util/util';
import { UserValidation } from '../validation/user-validation';
import { Validation } from '../validation/validation';
import { v4 as uuid } from 'uuid';
import type { UserRequest } from '../type/user-request';

export class UserService {
  static async register(request: CreateUserRequest): Promise<UserResponse> {
    const validRequest = Validation.validate(UserValidation.REGISTER, request);
    await Utils.isUsernameAlreadyExist(validRequest);
    validRequest.password = await Bun.password.hash(validRequest.password, 'bcrypt');

    const result = await prismaClient.users.create({
      data: validRequest,
    });
    return toUserResponse(result);
  }

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    const validRequest = Validation.validate(UserValidation.LOGIN, request);
    let user = await prismaClient.users.findUnique({
      where: {
        username: validRequest.username,
      },
    });
    if (!user) throw new ResponseError(401, 'Username or Password wrong');

    const isMatch = await Bun.password.verify(validRequest.password, user.password, 'bcrypt');
    if (!isMatch) throw new ResponseError(401, 'Username or Password wrong');

    user = await prismaClient.users.update({
      where: {
        username: user.username,
      },
      data: {
        token: uuid().toString(),
      },
    });

    const result = toUserResponse(user);
    result.token = user.token!;
    return result;
  }

  static async get(user: users): Promise<UserResponse> {
    return toUserResponse(user);
  }

  static async update(user: users, request: UpdateUserRequest): Promise<UserResponse> {
    const validRequest = Validation.validate(UserValidation.UPDATE, request);
    if (validRequest.name) {
      user.name = validRequest.name;
    }
    if (validRequest.password) {
      user.password = await Bun.password.hash(validRequest.password, 'bcrypt');
    }

    const result = await prismaClient.users.update({
      where: {
        username: user.username,
      },
      data: user,
    });

    return toUserResponse(result);
  }

  static async logout(user: users): Promise<UserResponse> {
    const result = await prismaClient.users.update({
      where: {
        username: user.username,
      },
      data: {
        token: null,
      },
    });

    return toUserResponse(result);
  }
}
