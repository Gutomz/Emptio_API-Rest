import { Request, Response, Router } from 'express';
import { RESPONSE_STATUS_CODE } from '../common/enums';

export class CommonRoutes {
  public static applyRoutes(router: Router) {
    router.all('*', function (req: Request, res: Response) {
      res.status(RESPONSE_STATUS_CODE.NOT_FOUND)
        .send({ error: true, message: 'Check your URL please' });
    });
  }
}
