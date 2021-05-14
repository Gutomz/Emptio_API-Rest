import { Server } from "./config/server";
import env from './environment';
import router from './routes';

const server = new Server(router);

const PORT = env.getPort();

server.app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
