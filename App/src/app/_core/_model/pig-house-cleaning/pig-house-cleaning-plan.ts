export interface PigHouseCleaningPlan {
  id: number;
  type: string;
  upperGuid: string;
  recordDate: string | null;
  recordTime: string;
  cleaningPlan: string;
  comment: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
  typeName: string;

}
