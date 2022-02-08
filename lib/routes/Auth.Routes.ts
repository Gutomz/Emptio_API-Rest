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
    router.delete(this.getFullPath(), authMiddleware, this.controller.logout);

    // * Refresh
    router.put(this.getFullPath(), refreshAuthMiddleware, this.controller.refresh);
  }
}
