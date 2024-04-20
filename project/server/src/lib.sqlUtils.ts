// import { PoolClient } from 'pg';
// import * as pg from './lib.pool'
import { objectify } from "../../utils/objectify";

export const generateUpdateQuery = <T>(
  tableName: string,
  defaultObject: T,
  updateObj: Partial<T>,
  deleteId = true
) => {
  const cleaned = cleanObject<T>(defaultObject, updateObj);
  if (deleteId && "id" in cleaned) delete cleaned["id"];
  let paramCounter = 0;
  let text = `UPDATE ${tableName} SET`;
  const values: any[] = [];
  for (const key in cleaned) {
    text += ` "${key}" = $${++paramCounter},`;
    values.push(cleaned[key]);
  }
  if (paramCounter) text = text.substr(0, text.length - 1);
  text += ' ';
  return { text, values, paramCounter };
};

export const generateInsertQuery = <T>(
  tableName: string,
  defaultObject: T,
  insertObj: Partial<T>,
  returnRow = true,
  deleteId = true
) => {
  const cleaned = cleanObject<T>(defaultObject, insertObj);
  console.log(cleaned);
  if (deleteId && "id" in cleaned) delete cleaned["id"];
  let paramCounter = 0;
  let text = `INSERT INTO ${tableName} (${Object.keys(cleaned)
    .map((field) => `"${field}"`)
    .join(",")}) VALUES (`;
  const values: any[] = [];
  for (const key in cleaned) {
    text +=`$${++paramCounter},`;
    values.push(cleaned[key]);
  }
  if (paramCounter) text = text.substr(0, text.length - 1);
  text += ") ";
  if (returnRow) text += "RETURNING * ";
   console.log(text);
  return { text, values, paramCounter };
};

export const generateDeleteQuery = <T>(tableName: string, criterias: any) => {
  let paramCounter = 0;
  let text = `DELETE FROM ${tableName} WHERE`;
  const values: any[] = [];
  for (const key in criterias) {
    text += ` "${key}" = $${++paramCounter} AND`;
    values.push(criterias[key]);
  }
  if (paramCounter) text = text.substr(0, text.length - 3);
  text += "; ";

  return { text, values };
};


export const cleanObject = <T>(defaultObject, targetObject: Partial<T>) => {
  const cleaned = objectify(targetObject);
  for (const key in targetObject)
    if (!(key in defaultObject)) delete cleaned[key];
  return cleaned;
};
