export interface PigHouseCleaningRecord {
  id: number;
  type: string;
  upperGuid: string;
  recordDate: any | null;
  recordTime: string;
  cleaningRecord: string;
  comment: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
  typeName: string;

}
