import { objectify } from "../utils/objectify";

export interface MagicItem {
  id?: string;
  weight: number;
  name: string;
}

export const defaultMagicItem: Required<MagicItem> = {
  id: "",
  weight: 0,
  name: "",
};

export const getDefaultMagicItem = () => {
  return objectify(defaultMagicItem);
};
