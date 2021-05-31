import { Router } from 'express';
import { FavoritesController } from '../controllers/Favorites.Controller';
import { authMiddleware } from '../middlewares/Auth.Middleware';

export class FavoritesRoutes {
  private static controller: FavoritesController = new FavoritesController();
  private static path: string = "/favorites";

  private static getFullPath(extension: string = "") {
    return this.path + extension;
  }

  public static applyRoutes(router: Router) {

    // * Create
    router.post(this.getFullPath(), authMiddleware, this.controller.create);

    // * Add market
    router.put(this.getFullPath('/:id'), authMiddleware, this.controller.addMarket);

    // * Remove Market
    router.delete(this.getFullPath('/:id/:market_id'), authMiddleware, this.controller.removeMarket);

    // * Delete
    router.delete(this.getFullPath('/:id'), authMiddleware, this.controller.delete);

    // * Get My
    router.get(this.getFullPath(), authMiddleware, this.controller.find);
  }
}