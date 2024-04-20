import { objectify } from "../utils/objectify";

export interface LoadingLogs {
  id?: string;
  mover_id: string;
  item_id: [];
  createDate?: Date;
}

export const defaultLoadingLogs: Required<LoadingLogs> = {
    id: "",
    mover_id:"",
    item_id:[],
    createDate: new Date(),
};

export const getDefaultLoadingLogs=()=>{
    return objectify(defaultLoadingLogs);
}