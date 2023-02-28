export interface PigFarmVectorRecord {
  id: number;
  type: string;
  upperGuid: string;
  recordDate: any | null;
  recordTime: string;
  vectorRecord: string;
  comment: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
}
