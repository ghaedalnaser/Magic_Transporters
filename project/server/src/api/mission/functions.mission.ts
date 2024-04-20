import { Request, Response, NextFunction, RequestHandler } from "express";
import { param } from "express-validator";
import * as pg from "../../lib.pool";
import { apiResponder } from "../../utils/apiResponder";
import { apiValidator } from "../../utils/apiValidator";
import { MagicMover } from "../../../../models/magic_mover.model";
import { getDefaultMission, Mission } from "../../../../models/mission.model";
import { generateInsertQuery } from "../../lib.sqlUtils";

//------------------Start a mission-----------------//
export const startMission: RequestHandler[] = [
  param("id").isString().notEmpty(),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    const moverId = req.params.id;
    const query = `SELECT * FROM public."magic_mover" WHERE id = $1 ;`;
    let magicMover: MagicMover[] = (
      await pg.db.query<MagicMover>(query, [moverId])
    ).rows;
    if (magicMover.length == 0) {
      return res.status(404).json({ message: "Magic Mover not found" });
    }
    if (magicMover[0]["quest_state"] !== "loading") {
      return res.status(400).json({ message: "Magic Mover is not loading" });
    }
    const q = `UPDATE public."magic_mover" SET quest_state = 'on a mission' Where id = $1 `;
    let magicMover1: MagicMover[] = (await pg.db.query<MagicMover>(q, [moverId]))
      .rows;
      let magic_mover: MagicMover[] = (await pg.db.query<MagicMover>(query, [moverId]))
      .rows;
    //mission
    let mission: Mission = {
      mover_id: moverId,
      start_time: new Date(),
    };
    let result: Mission[] = await createMission(mission);

    return res
      .status(200)
      .json({
        message: "Mission started successfully",
        magic_mover: magic_mover,
        mission: result,
      });
  }),
];
//------------END Mission-------------------//
let completedMissions: Record<string, number> = {};
export const endMission: RequestHandler[] = [
  param("id").isString().notEmpty(),
  apiValidator,
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    const moverId = req.params.id;
    const query = `SELECT * FROM public."magic_mover" WHERE id = $1 ;`;
    let magicMover: MagicMover[] = (
      await pg.db.query<MagicMover>(query, [moverId])
    ).rows;
    if (magicMover.length == 0) {
      return res.status(404).json({ message: "Magic Mover not found" });
    }
    // if (magicMover[0]["quest_state"] !== "on a mission") {
    //   return res
    //     .status(400)
    //     .json({ message: "Magic Mover is not on a mission" });
    // }
    const q = `UPDATE public."magic_mover" SET quest_state = 'done' Where id = $1 `;
    let magicmover: MagicMover[] = (await pg.db.query<MagicMover>(q, [moverId])) .rows;

   // update mission
    let time = new Date();
    const q1 = `UPDATE public."mission" SET end_time = $2 Where mover_id = $1 `;
    let missionAfter: Mission[] = (await pg.db.query<Mission>(q1, [moverId,time]))
      .rows;
   console.log(missionAfter);
    //select mission
    const queryMission = `SELECT * FROM public."mission" WHERE mover_id = $1 ;`;
    let result: Mission[] = (
      await pg.db.query<Mission>(queryMission, [moverId])
    ).rows;

    let magicmover1: MagicMover[] = (
        await pg.db.query<MagicMover>(query, [moverId])
      ).rows;

    completedMissions[moverId] = (completedMissions[moverId] || 0) + 1;

    return res
      .status(200)
      .json({
        message: "Mission ended successfully",
        magic_mover: magicmover1,
        mission: result,
      });
  }),
];
//-----------------completed mission---------//
export const completeMission: RequestHandler[] = [
  apiResponder(async (req: Request, res: Response, next: NextFunction) => {
    const sortedMovers = Object.entries(completedMissions)
    res
      .status(200)
      .json({ message: "Completed missions list", movers: sortedMovers });
  }),
];

//--------------create Mission ------------//
export const createMission = async (mission: Mission) => {
  const query = generateInsertQuery(
    `public."mission"`,
    getDefaultMission(),
    mission,
    true,
    false
  );
  const result = (await pg.db.query<Mission>(query.text, query.values)).rows[0];
  return result;
};
