export interface PigHouseCleaningSchedule {
  id: number;
  type: string;
  upperGuid: string;
  recordDate: string | null;
  recordTime: string;
  cleaningSchedule: string;
  comment: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
  typeName: string;

}
