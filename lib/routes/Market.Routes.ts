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

    // * Get
    router.get(this.getFullPath(), authMiddleware, this.controller.find);

    // * Get By Id
    router.get(this.getFullPath('/:id'), authMiddleware, this.controller.getById);

    // * Get By Google Id
    router.get(this.getFullPath('/place/:place_id'), authMiddleware, this.controller.getByPlaceId);
  }
}