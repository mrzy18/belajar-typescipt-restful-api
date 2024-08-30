import type { users } from '@prisma/client';
import {
  toContactResponse,
  type ContactResponse,
  type CreateContactRequest,
  type SearchContactRequest,
  type UpdateContactRequest,
} from '../model/contact-model';
import { Validation } from '../validation/validation';
import { ContactValidation } from '../validation/contact-validation';
import { prismaClient } from '../application/database';
import { Utils } from '../util/util';
import type { Pageable } from '../model/page';

export class ContactService {
  static async create(user: users, request: CreateContactRequest): Promise<ContactResponse> {
    const validRequest = Validation.validate(ContactValidation.CREATE, request);
    const newContact = {
      ...validRequest,
      ...{ username: user.username },
    };

    const result = await prismaClient.contacts.create({
      data: newContact,
    });

    return toContactResponse(result);
  }
  static async get(user: users, id: number): Promise<ContactResponse> {
    const contact = await Utils.isContactAvailable(user, id);
    return toContactResponse(contact);
  }
  static async update(user: users, request: UpdateContactRequest): Promise<ContactResponse> {
    const validRequest = Validation.validate(ContactValidation.UPDATE, request);
    await Utils.isContactAvailable(user, validRequest.id);

    const contact = await prismaClient.contacts.update({
      where: {
        id: validRequest.id,
        username: user.username,
      },
      data: validRequest,
    });

    return toContactResponse(contact);
  }
  static async remove(user: users, id: number) {
    const contact = await Utils.isContactAvailable(user, id);
    await prismaClient.contacts.delete({
      where: {
        id: contact.id,
        username: user.username,
      },
    });
  }
  static async search(user: users, request: SearchContactRequest): Promise<Pageable<ContactResponse>> {
    const validRequest = Validation.validate(ContactValidation.SEARCH, request);
    const skip = (validRequest.page - 1) * validRequest.size;

    const filters = [];

    if (validRequest.name) {
      filters.push({
        OR: [
          {
            firstName: {
              contains: validRequest.name,
            },
          },
          {
            lastName: {
              contains: validRequest.name,
            },
          },
        ],
      });
    }

    if (validRequest.email) {
      filters.push({
        email: {
          contains: validRequest.email,
        },
      });
    }

    if (validRequest.phone) {
      filters.push({
        phone: {
          contains: validRequest.phone,
        },
      });
    }

    const contacts = await prismaClient.contacts.findMany({
      where: {
        username: user.username,
        AND: filters,
      },
      take: validRequest.size,
      skip,
    });

    const total = await prismaClient.contacts.count({
      where: {
        username: user.username,
        AND: filters,
      },
    });

    return {
      data: contacts.map((contact) => toContactResponse(contact)),
      paging: {
        size: validRequest.size,
        totalPage: Math.ceil(total / validRequest.size),
        currentPage: validRequest.page,
      },
    };
  }
}
