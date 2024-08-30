import { users } from "@prisma/client";
import { prismaClient } from "../src/application/database";

export class TestUtils {
  static async removeAllUser(){
    await prismaClient.users.deleteMany({
      where: {
        username: 'test'
      }
    });
  }

  static async getUser(): Promise<users>{
    const user =  await prismaClient.users.findFirst({
      where: {username: 'test'}
    });

    if(!user) throw new Error('user not found')

    return user;
  }

  static async createUser(){
    return await prismaClient.users.create({
      data: {
        username: 'test',
        name: 'test',
        password: await Bun.password.hash('test', 'bcrypt'),
        token: 'test'
      }
    });
  }
}