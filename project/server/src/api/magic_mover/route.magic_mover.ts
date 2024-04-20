import * as express from "express";
import { getByMagicMover  , addMagicMover , loadMagicMover  } from "./functions.magic_mover";

export const magic_moverRoutes =  express.Router();

magic_moverRoutes.route('/magic-mover/:key?/:value?').get(getByMagicMover)
magic_moverRoutes.route('/magic-mover/add').post(addMagicMover);
magic_moverRoutes.route('/magic-mover/load/').post(loadMagicMover);



