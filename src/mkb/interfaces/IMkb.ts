import {TMkb} from "../types/TMkb";

export interface IMkb {
  id: number;
  mkb_code: string;
  recommendation: string;
  del_freq: number;
  use_freq: number;
  type: TMkb;
}