import * as express from "express";
import { AuthRoutes } from "./Auth.Routes";
import { CommonRoutes } from "./Commom.Routes";
import { UserRoutes } from "./User.Routes";

const router = express.Router();

AuthRoutes.applyRoutes(router);
UserRoutes.applyRoutes(router);

CommonRoutes.applyRoutes(router);

export default router;
