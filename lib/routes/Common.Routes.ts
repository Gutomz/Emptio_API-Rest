import { Request, Response, Router } from 'express';
import { RESPONSE_STATUS_CODE } from '../utils/enums';

export class CommonRoutes {
  public static applyRoutes(router: Router) {
    router.get('/', function (req: Request, res: Response) {
      res.status(RESPONSE_STATUS_CODE.SUCCESS).send({
        name: "Emptio-API",
        description: "Rest API for Emptio application.",
      });
    });

    router.all('*', function (req: Request, res: Response) {
      res.status(RESPONSE_STATUS_CODE.NOT_FOUND)
        .send({ error: true, message: 'Check your URL please' });
    });
  }
}
