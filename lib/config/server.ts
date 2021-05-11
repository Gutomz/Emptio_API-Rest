import * as express from "express";
import * as mongoose from 'mongoose';

import environment from "../environment";

export class Server {
  public app: express.Application;
  public mongoUrl: string = environment.getDataBasePath().toString();
  public router: express.Router;

  constructor(router: express.Router) {
    this.app = express();
    this.router = router;
    this.config();
    this.mongoSetup();

    this.app.use('/api', router);
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private async mongoSetup(): Promise<void> {
    try {
      const db = await mongoose.connect(this.mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });
      
      console.log('Connected to database: ' + db.connection.name);
    } catch (e) {
      console.log('Database connection failed');
      process.exit(1);
    }
  }
}
