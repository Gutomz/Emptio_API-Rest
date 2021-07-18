import { Router } from 'express';
import { NotificationsController } from '../controllers/NotificationsController';
import { authMiddleware } from '../middlewares/Auth.Middleware';

export class NotificationsRoutes {
  private static controller: NotificationsController = new NotificationsController();
  private static path: string = "/notifications";

  private static getFullPath(extension: string = "") {
    return this.path + extension;
  }

  public static applyRoutes(router: Router) {
    // * Get My
    router.get(this.getFullPath(), authMiddleware, this.controller.get);
  }
}