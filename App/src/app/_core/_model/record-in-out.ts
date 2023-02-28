export interface RecordInOut {
  id: number;
  farmGuid: string;
  type: string;
  comment: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  deleteDate: string | null;
  deleteBy: number | null;
  status: number | null;
  estDate: string | null;
  estTime: string;
  recordDate: any | null;
  recordTime: string;
  inOutNo: string;
  inOutName: string;
  fromFarm: string;
  toFarm: string;
  customerGuid: string;
  accountGuid: string;
  agreeDate: string | null;
  agreeReason: string;
  agreeGuid: string;
  rejectDate: string | null;
  rejectReason: string;
  rejectGuid: string;
  guid: string;
  pigs: string[]
}
