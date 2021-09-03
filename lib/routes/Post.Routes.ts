import { Router } from 'express';
import { PostController } from '../controllers/Post.Controller';
import { authMiddleware } from '../middlewares/Auth.Middleware';

export class PostRoutes {
  private static controller: PostController = new PostController();
  private static path: string = "/posts";

  private static getFullPath(extension: string = "") {
    return this.path + extension;
  }

  public static applyRoutes(router: Router) {

    // * Create
    router.post(this.getFullPath(), authMiddleware, this.controller.create);

    // * Get
    router.get(this.getFullPath(), authMiddleware, this.controller.get);

    // * Delete
    router.delete(this.getFullPath('/:id'), authMiddleware, this.controller.delete);
  }
}