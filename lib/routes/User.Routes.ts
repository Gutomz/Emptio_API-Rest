import { Router } from 'express';
import { UserController } from '../controllers/User.Controller';
import { authMiddleware } from '../middlewares/Auth.Middleware';

export class UserRoutes {
  private static controller: UserController = new UserController();
  private static path: string = "/users";

  private static getFullPath(extension: string = "") {
    return this.path + extension;
  }

  public static applyRoutes(router: Router) {

    // * Register
    router.post(this.getFullPath(), this.controller.register);

    // * Forgot Password
    router.post(this.getFullPath('/forgot-password'), this.controller.forgotPassword);

    // * Redefine Password
    router.post(this.getFullPath('/redefine-password'), this.controller.redefinePassword);

    // * Update By Id
    router.put(this.getFullPath('/me'), authMiddleware, this.controller.updateMe);

    // * Get Me
    router.get(this.getFullPath('/me'), authMiddleware, this.controller.getMe);

    // * Get By Id
    router.get(this.getFullPath('/:id'), authMiddleware, this.controller.getById);

    // * Get
    router.get(this.getFullPath(), authMiddleware, this.controller.get);
  }
}