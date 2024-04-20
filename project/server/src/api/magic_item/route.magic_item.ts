import * as express from "express";
import { getByMagicItem , addMagicIteme} from "./functions.magic_item";

export const magic_itemRoutes =  express.Router();

magic_itemRoutes.route('/magic-item/:key?/:value?').get(getByMagicItem)
magic_itemRoutes.route('/magic-item/add').post(addMagicIteme);
