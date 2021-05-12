import { Router } from 'express';
import { AuthController } from '../controllers/Auth.Controller';

export class AuthRoutes {
  private static controller: AuthController = new AuthController();
  private static path: string = "/auth";

  private static getFullPath(extension: string) {
    return this.path + extension;
  }

  public static applyRoutes(router: Router) {

    // * Login
    router.post(this.path, this.controller.login);

    // * Logout
    router.post(this.getFullPath('/logout'), this.controller.logout);

    // * Refresh
    router.post(this.getFullPath('/refresh'), this.controller.refresh);
  }
}