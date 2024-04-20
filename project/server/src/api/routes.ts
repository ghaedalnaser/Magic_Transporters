import {Router} from "express";
import { magic_moverRoutes } from "./magic_mover/route.magic_mover";
import { magic_itemRoutes } from "./magic_item/route.magic_item";
import { missionRoutes } from "./mission/route.mission";

export const apiRoutes:Router =  Router();

apiRoutes.use(magic_moverRoutes);
apiRoutes.use(magic_itemRoutes);
apiRoutes.use(missionRoutes);

