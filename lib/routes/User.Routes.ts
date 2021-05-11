import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/User.Controller';

export class UserRoutes {
  private static controller: UserController = new UserController();
  private static path: string = "/users";

  private static getFullPath(extension: string) {
    return this.path + extension;
  }

  public static applyRoutes(router: Router) {
    router.post(this.path, this.controller.create);
  }
}