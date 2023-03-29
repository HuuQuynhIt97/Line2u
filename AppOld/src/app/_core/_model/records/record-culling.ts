
export interface RecordCulling {
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
  cullingMethod: number | null;
  cullingReason: number | null;
  cullingWeight: number | null;
  penGuid: any;
  cullingPenGuid : any | null;
}
