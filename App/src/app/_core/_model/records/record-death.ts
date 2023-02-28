
export interface RecordDeath {
  id: number;
  farmGuid: string;
  type: string;
  makeOrderGuid: string;
  pigGuid: string;
  comment: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  deleteDate: string | null;
  deleteBy: number | null;
  status: number | null;
  guid: string;
  recordDate: any | null;
  recordTime: string;
  estDate: any | null;
  estTime: string;
  deathMethod: number | null;
  deathReason: string;
  deathWeight: number | null;
  penGuid: any | null;
  cullingPenGuid : any | null;
}
