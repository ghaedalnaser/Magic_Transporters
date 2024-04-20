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
import { MagicItem , getDefaultMagicItem} from '../../../../models/magic_item.mode' 

//------------------  GET <All MagicMover  | |  Specific MagicMover {key:value}>--------------//

export const getByMagicItem: RequestHandler[] = [
    param("key").optional().isString(),
    param("value").optional(),
    apiValidator,
    apiResponder(async (req: Request, res: Response, next: NextFunction) => {
      console.log(req.query);
      let result: MagicItem[] = [];
      result = await getBymagicItem(req.params.key, req.params.value);
      return result || [];
    }),
  ];

  //----------------------POST MagicMover-----------------//
   export const  addMagicIteme:RequestHandler []=[
     body('weight').isNumeric().notEmpty(),
     body('name').isString().notEmpty(),
     apiValidator,
     apiResponder(async(req: Request, res: Response, next: NextFunction)=>{
        const payload:MagicItem =  req.body;
        const result = await createMagicItem(payload);
        return result || [];
     })

   ]
  
  //------------Function CreateMagicMover using  func(genearteInsertQuery)----------//

export const createMagicItem= async (magicItem: MagicItem) => {
    const query = generateInsertQuery(
      `public."magic_item"`,
      getDefaultMagicItem(),
      magicItem,
      true,
      false
    );
    const result = (await pg.db.query<MagicItem>(query.text, query.values)).rows[0];
    return result;
  };
 
//---------------Function GET data from DB  <SELECT * ||  SELECT * WHERE KEY=VALUE>------------//

export const getBymagicItem = async (key?: string, value?: any): Promise<MagicItem[]> => {
    let magic_item: MagicItem[];
    if ((!key && value) || (key && !value)) throw Error("Invalid Arguments");
  
    let query = `SELECT * FROM public."magic_item"`;
    const queryValues: any[] = [];
    if (key && value && Object.keys(getDefaultMagicItem()).includes(key.trim())) {
      query += `WHERE "${key.trim()}" =  $1 `;
      queryValues.push(value);
    }
    query += ";";
    magic_item = (await pg.db.query<MagicItem>(query, queryValues)).rows;
    return magic_item;
  };