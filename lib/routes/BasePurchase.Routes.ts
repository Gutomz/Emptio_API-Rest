import { Router } from 'express';
import { BasePurchaseController } from '../controllers/BasePurchase.Controller';
import { authMiddleware } from '../middlewares/Auth.Middleware';

export class BasePurchaseRoutes {
  private static controller: BasePurchaseController = new BasePurchaseController();
  private static path: string = "/base-purchases";

  private static getFullPath(extension: string = "") {
    return this.path + extension;
  }

  public static applyRoutes(router: Router) {

    // * Create
    router.post(this.getFullPath(), authMiddleware, this.controller.create);

    // * Get My
    router.get(this.getFullPath(), authMiddleware, this.controller.find);

    // * Update
    router.put(this.getFullPath('/:id'), authMiddleware, this.controller.update);

    // * Get By Id
    router.get(this.getFullPath('/:id'), authMiddleware, this.controller.findById);

    // * Delete
    router.delete(this.getFullPath('/:id'), authMiddleware, this.controller.delete);

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
