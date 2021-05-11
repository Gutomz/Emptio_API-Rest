import * as express from "express";
import { CommonRoutes } from "./Commom.Routes";
import { UserRoutes } from "./User.Routes";

const router = express.Router();

UserRoutes.applyRoutes(router);

CommonRoutes.applyRoutes(router);

export default router;
