import { contacts, users } from '@prisma/client';
import { prismaClient } from '../src/application/database';

export class TestUtils {
  static async removeAllUser() {
    await prismaClient.users.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  static async removeAllContact() {
    await prismaClient.contacts.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  static async getUser(): Promise<users> {
    const user = await prismaClient.users.findFirst({
      where: { username: 'test' },
    });

    if (!user) throw new Error('user not found');

    return user;
  }

  static async getContact(): Promise<contacts> {
    const contact = await prismaClient.contacts.findFirst({
      where: { username: 'test' },
    });

    if (!contact) throw new Error('user not found');

    return contact;
  }

  static async createUser() {
    return await prismaClient.users.create({
      data: {
        username: 'test',
        name: 'test',
        password: await Bun.password.hash('test', 'bcrypt'),
        token: 'test',
      },
    });
  }

  static async createContact() {
    return await prismaClient.contacts.create({
      data: {
        firstName: 'test',
        lastName: 'test',
        email: 'test@email.com',
        phone: '081234567891',
        username: 'test',
      },
    });
  }
}
