import * as express from 'express';
import { UploadConfig } from '../config/upload';
import environment from '../environment';

export class StaticRoutes {
  private static path: string = environment.static;

  public static applyRoutes(router: express.Router) {
    router.use(this.path, express.static(UploadConfig.getPath()));
  }
}
