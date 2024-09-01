import type { users } from '@prisma/client';
import {
  toAddressResponse,
  type AddressResponse,
  type CreateAddressRequest,
  type GetAddressRequest,
  type RemoveAddressRequest,
  type UpdateAddressRequest,
} from '../model/address-model';
import { Validation } from '../validation/validation';
import { AddressValidation } from '../validation/address-validation';
import { Utils } from '../util/util';
import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';

export class AddressService {
  static async create(user: users, request: CreateAddressRequest): Promise<AddressResponse> {
    const validRequest = Validation.validate(AddressValidation.CREATE, request);
    await Utils.isContactAvailable(user, validRequest.contactId);

    const address = await prismaClient.addresses.create({
      data: validRequest,
    });

    return toAddressResponse(address);
  }

  static async get(user: users, request: GetAddressRequest): Promise<AddressResponse> {
    const validRequest = Validation.validate(AddressValidation.GET, request);
    await Utils.isContactAvailable(user, validRequest.contactId);
    const address = await Utils.isAddressAvailable(validRequest.id, validRequest.contactId);

    return toAddressResponse(address);
  }

  static async update(user: users, request: UpdateAddressRequest): Promise<AddressResponse> {
    const validRequest = Validation.validate(AddressValidation.UPDATE, request);
    await Utils.isContactAvailable(user, validRequest.contactId);
    await Utils.isAddressAvailable(validRequest.id, validRequest.contactId);

    const updateAddress = await prismaClient.addresses.update({
      where: {
        id: validRequest.id,
        contactId: validRequest.contactId,
      },
      data: validRequest,
    });
    return toAddressResponse(updateAddress);
  }

  static async remove(user: users, request: RemoveAddressRequest): Promise<AddressResponse> {
    const validRequest = Validation.validate(AddressValidation.REMOVE, request);
    await Utils.isContactAvailable(user, validRequest.contactId);
    await Utils.isAddressAvailable(validRequest.id, validRequest.contactId);

    const address = await prismaClient.addresses.delete({
      where: {
        id: validRequest.id,
      },
    });

    return toAddressResponse(address);
  }

  static async list(user: users, contactId: number): Promise<Array<AddressResponse>> {
    await Utils.isContactAvailable(user, contactId);

    const addresses = await prismaClient.addresses.findMany({
      where: {
        contactId,
      },
    });
    return addresses.map((address) => toAddressResponse(address));
  }
}
