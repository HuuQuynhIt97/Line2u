export interface RecordMove {
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
  estDate: any | null;
  estTime: string;
  recordDate: any | null;
  recordTime: string;
  beforePenGuid: string;
  afterPenGuid: string;
  pigStatus: string;
  moveType: string;
  moveInOut: string;
  applyDays: string;
  beforePenName: string;
  afterPenName: string;
  moveInOutName: string;
  applyDaysName: string;
  pigStatusName: string;
  moveTypeName: string;
  typeName: string;
  delayReason: string;
  delayDays: number | null;


}
