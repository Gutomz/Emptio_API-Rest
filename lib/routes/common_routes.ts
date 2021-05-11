import { Request, Response, Router } from 'express';

export class CommonRoutes {
  public static applyRoutes(router: Router) {
    router.all('*', function (req: Request, res: Response) {
      res.status(404).send({ error: true, message: 'Check your URL please' });
    });
  }
}
