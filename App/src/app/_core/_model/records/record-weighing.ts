export interface RecordWeighing {
  id: number;
  farmGuid: string;
  type: string;
  makeOrderGuid: string;
  pigGuid: string;
  penGuid: string;
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
  netWeight: number | null;
  weight: number | null;
  estDate: any | null;
  estTime: string;
  useType: string;
  recordResult: string;
  applyDays: number | null;
}
