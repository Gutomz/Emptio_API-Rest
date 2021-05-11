import * as express from "express";
import { CommonRoutes } from "./common_routes";
import { UserRoutes } from "./user_routes";

const router = express.Router();

UserRoutes.applyRoutes(router);

CommonRoutes.applyRoutes(router);

export default router;
