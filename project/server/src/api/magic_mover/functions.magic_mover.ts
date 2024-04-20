import { Request, Response, NextFunction, RequestHandler } from "express";
import { body, param } from "express-validator";
import * as pg from "../../lib.pool";
import { apiResponder } from "../../utils/apiResponder";
import {
  generateInsertQuery,
  generateUpdateQuery,
  generateDeleteQuery,
} from "../../lib.sqlUtils";
import { apiValidator } from "../../utils/apiValidator";
import {
  MagicMover,
  getDefaultMagicMover,
} from "../../../../models/magic_mover.model";
import { MagicItem } from "../../../../models/magic_item.mode";
import { getBymagicItem } from "../magic_item/functions.magic_item";
import {
  LoadingLogs,
  getDefaultLoadingLogs,
} from "../../../../models/loading_logs.model";

//------------------  GET <All MagicMover  | |  Specific MagicMover {key:value}>--------------//

export const getByMagicMover: RequestHandler[] = [
  param("key").optional().isString(),
  param("value").optional(),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.query);
    let result: MagicMover[] = [];
    result = await getBy(req.params.key, req.params.value);
    return result || [];
  }),
];

//----------------------POST MagicMover-----------------//
export const addMagicMover: RequestHandler[] = [
  body("weight_limit").isNumeric().notEmpty(),
  body("energy").isNumeric().notEmpty(),
  body("quest_state").isString().notEmpty(),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    const payload: MagicMover = req.body;
    const result = await createMagicMover(payload);
    return result || [];
  }),
];
//-------------- Load MagicMover----------------------//
export const loadMagicMover: RequestHandler[] = [
  body("mover_id").isString().notEmpty(),
  body("item_id").isArray().notEmpty(),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    let payload = req.body;
    let moverId: string = req.body.mover_id;
    let items = req.body.item_id;
    //Find the Magic Mover by id
    const values = new Array();
    values.push(moverId);
    const query = `SELECT * FROM public."magic_mover" WHERE id = $1 ;`;
    let magicMover: MagicMover[] = (
      await pg.db.query<MagicMover>(query, values)
    ).rows;
    if (magicMover.length == 0) {
      return res.status(404).json({ message: "Magic Mover not found" });
    }
    // Calculate the total weight of items being loaded
    let weights: number[] = [];
    try {
      await Promise.all(
        items.map(async (element) => {
          const query = `SELECT * FROM public."magic_item" WHERE id = $1`;
          let magicItem: MagicItem[] = (
            await pg.db.query<MagicItem>(query, [element])
          ).rows;
          if (magicItem.length == 0) {
            res.status(404).json({ message: "Magic Item not found" });
            // Handle the error here, e.g., by throwing an exception or setting a flag
          } else {
            weights.push(magicItem[0]["weight"]);
          }
        })
      );
    } catch (error) {
      res.status(500);
    }
    // Do something with the weights array here, as it's now populated
    let totalWeight = weights.reduce((acc, curr) => acc + curr, 0);
    // Check if the total weight exceeds the Magic Mover's weight limit
    let remainWeight = magicMover[0]["weight_limit"]-totalWeight;
    if (remainWeight <= 0) {
      return res
        .status(400)
        .json({ message: "Total weight exceeds Magic Mover's weight limit" });
    }
    // Update the Magic Mover's state to "loading"
    const q = `UPDATE public."magic_mover" SET  quest_state = 'loading'  , weight_limit= ${remainWeight}   Where id = $1 `;
    let magicItem: MagicItem[] = (await pg.db.query<MagicMover>(q, [moverId]))
      .rows;
    //insert Logs
    let LoadingLogs: LoadingLogs[] = await createLoadingLogs(payload);
    // Respond with the updated Magic Mover data
    const qMagic= 'SELECT * FROM public."magic_mover" WHERE id =$1 ;';
    let magic: MagicMover[] = (await pg.db.query<MagicMover>(qMagic, [moverId]))
    .rows;
    return res.status(200).json({"loading_logs" : LoadingLogs , "magic_mover":magic})
  }),
];

//------------Function CreateMagicMover using  func(genearteInsertQuery)----------//

export const createMagicMover = async (magicMover: MagicMover) => {
  const query = generateInsertQuery(
    `public."magic_mover"`,
    getDefaultMagicMover(),
    magicMover,
    true,
    false
  );
  const result = (await pg.db.query<MagicMover>(query.text, query.values))
    .rows[0];
  return result;
};
//---------------Function GET data from DB  <SELECT * ||  SELECT * WHERE KEY=VALUE>------------//

export const getBy = async (
  key?: string,
  value?: any
): Promise<MagicMover[]> => {
  let magic_mover: MagicMover[];
  if ((!key && value) || (key && !value)) throw Error("Invalid Arguments");

  let query = `SELECT * FROM public."magic_mover"`;
  const queryValues: any[] = [];
  if (
    key &&
    value &&
    Object.keys(getDefaultMagicMover()).includes(key.trim())
  ) {
    query += `WHERE "${key.trim()}" =  $1 `;
    queryValues.push(value);
  }
  query += ";";
  magic_mover = (await pg.db.query<MagicMover>(query, queryValues)).rows;
  return magic_mover;
};

//--------------- CreateLoadingLogs-----------
export const createLoadingLogs = async (loadingLog: LoadingLogs) => {
  const query = generateInsertQuery(
    `public."loading_logs"`,
    getDefaultLoadingLogs(),
    loadingLog,
    true,
    false
  );
  const result = (await pg.db.query<LoadingLogs>(query.text, query.values))
    .rows[0];
  return result;
};
