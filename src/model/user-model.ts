import type { users } from "@prisma/client";

export type UserResponse = {
  username: string;
  name: string;
  token?: string;
};

export type CreateUserRequest = {
  username: string;
  name: string;
  password: string;
};

export type LoginUserRequest = {
  username: string;
  password: string
}

export type UpdateUserRequest = {
  name?: string;
  password?: string
}

export function toUserResponse(user: users): UserResponse {
  return {
    username: user.username,
    name: user.name
  }
}
