import { Router } from 'express';
import { PurchaseController } from '../controllers/Purchase.Controller';
import { authMiddleware } from '../middlewares/Auth.Middleware';

export class PurchaseRoutes {
  private static controller: PurchaseController = new PurchaseController();
  private static path: string = "/purchases";

  private static getFullPath(extension: string = "") {
    return this.path + extension;
  }

  public static applyRoutes(router: Router) {

    // * Create
    router.post(this.getFullPath(), authMiddleware, this.controller.create);

    // * Get My
    router.get(this.getFullPath(), authMiddleware, this.controller.find);

    // * Get By Id
    router.get(this.getFullPath('/:id'), authMiddleware, this.controller.findById);

    // * Complete
    router.put(this.getFullPath('/:id'), authMiddleware, this.controller.complete);

    // * Delete
    router.delete(this.getFullPath('/:id'), authMiddleware, this.controller.delete);

    // * Add Limit
    router.patch(this.getFullPath('/:id/limit'), authMiddleware, this.controller.updateLimit);

    // * Connect Market
    router.patch(this.getFullPath('/:id/connect'), authMiddleware, this.controller.connectMarket);

    // * Add Item
    router.post(this.getFullPath('/:id'), authMiddleware, this.controller.addItem);

    // * Get Item
    router.get(this.getFullPath('/:id/:item_id'), authMiddleware, this.controller.findItemById);

    // * Update Item
    router.put(this.getFullPath('/:id/:item_id'), authMiddleware, this.controller.updateItem);

    // * Remove Item
    router.delete(this.getFullPath('/:id/:item_id'), authMiddleware, this.controller.deleteItem);
  }
}
