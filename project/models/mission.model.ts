import { objectify } from "../utils/objectify";

export interface Mission {
  id?: string;
  mover_id: string;
  start_time: Date;
  end_time?: Date;
}

export const defaultMission: Required<Mission> = {
    id: "",
    mover_id:"",
    start_time:new Date(),
    end_time: new Date(),
};

export const getDefaultMission=()=>{
    return objectify(defaultMission);
}