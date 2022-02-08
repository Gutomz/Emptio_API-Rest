import { Router } from 'express';
import { FriendshipController } from '../controllers/Friendship.Controller';
import { authMiddleware } from '../middlewares/Auth.Middleware';

export class FriendshipRoutes {
  private static controller: FriendshipController = new FriendshipController();
  private static path: string = "/friendships";

  private static getFullPath(extension: string = "") {
    return this.path + extension;
  }

  public static applyRoutes(router: Router) {

    // * Request
    router.post(this.getFullPath('/requests'), authMiddleware, this.controller.request);

    // * Update Request
    router.put(this.getFullPath('/requests/:id'), authMiddleware, this.controller.updateRequest);

    // * Get Requests
    router.get(this.getFullPath('/requests'), authMiddleware, this.controller.getRequests);

    // * Get Friendships
    router.get(this.getFullPath(), authMiddleware, this.controller.get);

    // * Delete Friendship
    router.delete(this.getFullPath('/:id'), authMiddleware, this.controller.delete);
  }
}
