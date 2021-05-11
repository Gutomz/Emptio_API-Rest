import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/userController';

export class UserRoutes {

  private static user_controller: UserController = new UserController();
  private static path: string = "/users";

  private static getFullPath(extension: string) {
    return this.path + extension;
  }

  public static applyRoutes(router: Router) {
    router.post(this.path, (req: Request, res: Response) => {
      this.user_controller.create_user(req, res);
    });

    router.get(this.getFullPath('/:id'), (req: Request, res: Response) => {
      this.user_controller.get_user(req, res);
    });

    router.put(this.getFullPath('/:id'), (req: Request, res: Response) => {
      this.user_controller.update_user(req, res);
    });

    router.delete(this.getFullPath('/:id'), (req: Request, res: Response) => {
      this.user_controller.delete_user(req, res);
    });
  }
}
