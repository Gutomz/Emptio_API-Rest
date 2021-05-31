import * as express from "express";
import { AuthRoutes } from "./routes/Auth.Routes";
import { BasePurchaseRoutes } from "./routes/BasePurchase.Routes";
import { CommonRoutes } from "./routes/Commom.Routes";
import { FavoritesRoutes } from "./routes/Favorites.Routes";
import { FriendshipRoutes } from "./routes/Friendship.Routes";
import { MarketRoutes } from "./routes/Market.Routes";
import { ProductRoutes } from "./routes/Product.Routes";
import { PurchaseRoutes } from "./routes/Purchase.Routes";
import { StaticRoutes } from "./routes/Static.Routes";
import { UserRoutes } from "./routes/User.Routes";

const router = express.Router();

AuthRoutes.applyRoutes(router);
UserRoutes.applyRoutes(router);
FriendshipRoutes.applyRoutes(router);
StaticRoutes.applyRoutes(router);
MarketRoutes.applyRoutes(router);
ProductRoutes.applyRoutes(router);
PurchaseRoutes.applyRoutes(router);
BasePurchaseRoutes.applyRoutes(router);
FavoritesRoutes.applyRoutes(router);

CommonRoutes.applyRoutes(router);

export default router;
