import { Router } from 'express';
import { MarketController } from '../controllers/Market.Controller';
import { authMiddleware } from '../middlewares/Auth.Middleware';

export class MarketRoutes {
  private static controller: MarketController = new MarketController();
  private static path: string = "/markets";

  private static getFullPath(extension: string = "") {
    return this.path + extension;
  }

  public static applyRoutes(router: Router) {

    // * Get By Google Id
    router.get(this.getFullPath('/:google_id'), authMiddleware, this.controller.getByGoogleId);
  }
}