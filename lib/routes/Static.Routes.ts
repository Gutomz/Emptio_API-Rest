import * as express from 'express';
import environment from '../environment';

export class StaticRoutes {
  private static path: string = environment.static;

  public static applyRoutes(router: express.Router) {
    router.use(this.path, express.static(environment.getUploadsPath()))
  }
}
