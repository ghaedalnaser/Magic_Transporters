import { objectify } from "../utils/objectify";

export interface MagicMover {
  id?: string;
  weight_limit: number;
  energy: number;
  quest_state: string;
}

export const defaultMagicMover: Required<MagicMover> = {
  id: "",
  weight_limit: 0,
  energy: 0,
  quest_state: "",
};

export const getDefaultMagicMover=()=>{
    return objectify(defaultMagicMover);
}