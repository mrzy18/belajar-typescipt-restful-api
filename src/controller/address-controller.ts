import type { NextFunction, Response } from 'express';
import type { UserRequest } from '../type/user-request';
import type {
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  UpdateAddressRequest,
} from '../model/address-model';
import { AddressService } from '../service/address-service';

export class AddressController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateAddressRequest = req.body as CreateAddressRequest;
      request.contactId = Number(req.params.contactId);
      const result = await AddressService.create(req.user!, request);
      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: GetAddressRequest = {
        id: Number(req.params.addressId),
        contactId: Number(req.params.contactId),
      };
      const result = await AddressService.get(req.user!, request);
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateAddressRequest = req.body as UpdateAddressRequest;
      request.id = Number(req.params.addressId);
      request.contactId = Number(req.params.contactId);
      const result = await AddressService.update(req.user!, request);
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async remove(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: RemoveAddressRequest = {
        id: Number(req.params.addressId),
        contactId: Number(req.params.contactId),
      };
      await AddressService.remove(req.user!, request);
      res.status(200).json({
        status: 'success',
        data: {
          message: 'delete success',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const contactId: number = Number(req.params.contactId);
      const result = await AddressService.list(req.user!, contactId);
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
