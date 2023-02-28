export interface BioSMaster {
  id: number;
  farmGuid: string;
  pigType: string;
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
  makeOrderGuid: string;
  makeOrderName: string;
  pigTypeName: string;
}
