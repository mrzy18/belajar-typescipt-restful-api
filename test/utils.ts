import { addresses, contacts, users } from '@prisma/client';
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

  static async removeAllAddress() {
    await prismaClient.addresses.deleteMany({
      where: {
        contacts: {
          username: 'test',
        },
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

    if (!contact) throw new Error('contact not found');

    return contact;
  }

  static async getAddress(): Promise<addresses> {
    const address = await prismaClient.addresses.findFirst({
      where: {
        contacts: {
          username: 'test',
        },
      },
    });

    if (!address) throw new Error('address not found');

    return address;
  }

  static async createUser() {
    await prismaClient.users.create({
      data: {
        username: 'test',
        name: 'test',
        password: await Bun.password.hash('test', 'bcrypt'),
        token: 'test',
      },
    });
  }

  static async createContact() {
    await prismaClient.contacts.create({
      data: {
        firstName: 'test',
        lastName: 'test',
        email: 'test@email.com',
        phone: '081234567891',
        username: 'test',
      },
    });
  }

  static async createAddress() {
    const contact = await this.getContact();
    await prismaClient.addresses.create({
      data: {
        street: 'Jalan Merdeka',
        city: 'Jakarta',
        province: 'Jakarta',
        country: 'Indonesia',
        postalCode: '12345',
        contactId: contact.id,
      },
    });
  }
}
