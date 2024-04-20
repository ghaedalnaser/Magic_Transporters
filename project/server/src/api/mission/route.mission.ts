import * as express from "express";
import {  startMission,endMission , completeMission} from "./functions.mission";

export const missionRoutes =  express.Router();

missionRoutes.route('/magic-mover/:id/mission/start').put(startMission);
missionRoutes.route('/magic-mover/:id/mission/end').put(endMission);
missionRoutes.route('/completed-missions').get(completeMission)



