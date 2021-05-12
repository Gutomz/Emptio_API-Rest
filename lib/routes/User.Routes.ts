import { Router } from 'express';
import { UserController } from '../controllers/User.Controller';

export class UserRoutes {
  private static controller: UserController = new UserController();
  private static path: string = "/users";

  private static getFullPath(extension: string) {
    return this.path + extension;
  }

  public static applyRoutes(router: Router) {

    // * Register
    router.post(this.path, this.controller.register);

    // * Forgot Password
    router.post(this.path, this.controller.forgotPassword);

    // * Redefine Password
    router.post(this.path, this.controller.redefinePassword);

    // * Update By Id
    router.put(this.path, this.controller.updateById);

    // * Get Me
    router.get(this.path, this.controller.getMe);

    // * Get By Id
    router.get(this.path, this.controller.getById);

    // * Get All
    router.get(this.path, this.controller.getAll);
  }
}