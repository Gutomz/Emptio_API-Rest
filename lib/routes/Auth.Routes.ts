import { Router } from 'express';
import { AuthController } from '../controllers/Auth.Controller';
import { authMiddleware, refreshAuthMiddleware } from '../middlewares/Auth.Middleware';

export class AuthRoutes {
  private static controller: AuthController = new AuthController();
  private static path: string = "/auth";

  private static getFullPath(extension: string = "") {
    return this.path + extension;
  }

  public static applyRoutes(router: Router) {

    // * Login
    router.post(this.getFullPath(), this.controller.login);

    // * Logout
    router.post(this.getFullPath('/logout'), authMiddleware, this.controller.logout);

    // * Refresh
    router.post(this.getFullPath('/refresh'), refreshAuthMiddleware, this.controller.refresh);
  }
}
