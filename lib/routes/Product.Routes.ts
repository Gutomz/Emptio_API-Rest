import { Router } from 'express';
import { ProductController } from '../controllers/Product.Controller';
import { authMiddleware } from '../middlewares/Auth.Middleware';

export class ProductRoutes {
  private static controller: ProductController = new ProductController();
  private static path: string = "/products";

  private static getFullPath(extension: string = "") {
    return this.path + extension;
  }

  public static applyRoutes(router: Router) {

    // * Create product
    router.post(this.getFullPath(), authMiddleware, this.controller.create);

    // * Update product
    router.patch(this.getFullPath('/:id'), authMiddleware, this.controller.update);

    // * Get products
    router.get(this.getFullPath(), authMiddleware, this.controller.find);
  }
}
