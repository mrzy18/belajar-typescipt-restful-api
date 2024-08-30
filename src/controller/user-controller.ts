import type { Request, Response, NextFunction } from "express";
import type { CreateUserRequest, LoginUserRequest, UpdateUserRequest } from "../model/user-model";
import { UserService } from "../service/user-service";
import type { UserRequest } from "../type/user-request";

export class UserController {
  static async register(req: Request, res: Response, next: NextFunction){
    try {
      const request: CreateUserRequest = req.body as CreateUserRequest;
      const result = await UserService.register(request);
      res.status(201).json({
        status: 'success',
        data: result
      }); 
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request: LoginUserRequest = req.body as LoginUserRequest;
      const result = await UserService.login(request);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error)
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const result = await UserService.get(req.user!);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error)
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateUserRequest = req.body as UpdateUserRequest;
      const result = await UserService.update(req.user!, request);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error)
    }
  }

  static async logout(req: UserRequest, res: Response, next: NextFunction) {
    try {
      await UserService.logout(req.user!);
      res.status(200).json({
        status: 'success',
        data: {
          message: 'delete success'
        }
      });
    } catch (error) {
      next(error)
    }
  }
}