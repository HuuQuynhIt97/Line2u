export interface PigTreatment {
  id: number;
  type: string;
  upperGuid: string;
  recordDate: any | null;
  recordTime: string;
  treatment: string;
  comment: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
  farmGuid: string;
  pigGuid: string;
  penGuid: string;
  estDate: any | null;
  estTime: string;
  cullingPenGuid : any | null;
}
