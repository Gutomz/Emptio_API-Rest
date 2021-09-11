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

    // * Get Feed
    router.get(this.getFullPath("/feed"), authMiddleware, this.controller.getFeed);

    // * Get By Id
    router.get(this.getFullPath("/:id"), authMiddleware, this.controller.getById);

    // * Get User Specific Posts
    router.get(this.getFullPath("/profiles/:profile_id"), authMiddleware, this.controller.getProfile);

    // * Delete
    router.delete(this.getFullPath('/:id'), authMiddleware, this.controller.delete);

    // * Like Post
    router.put(this.getFullPath("/:id/like"), authMiddleware, this.controller.like);

    // * Dislike Post
    router.put(this.getFullPath("/:id/dislike"), authMiddleware, this.controller.dislike);
  }
}