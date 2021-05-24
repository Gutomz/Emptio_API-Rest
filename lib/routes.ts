import * as express from "express";
import { AuthRoutes } from "./routes/Auth.Routes";
import { CommonRoutes } from "./routes/Commom.Routes";
import { FriendshipRoutes } from "./routes/Friendship.Routes";
import { MarketRoutes } from "./routes/Market.Routes";
import { ProductRoutes } from "./routes/Product.Routes";
import { StaticRoutes } from "./routes/Static.Routes";
import { UserRoutes } from "./routes/User.Routes";

const router = express.Router();

AuthRoutes.applyRoutes(router);
UserRoutes.applyRoutes(router);
FriendshipRoutes.applyRoutes(router);
StaticRoutes.applyRoutes(router);
MarketRoutes.applyRoutes(router);
ProductRoutes.applyRoutes(router);

CommonRoutes.applyRoutes(router);

export default router;
