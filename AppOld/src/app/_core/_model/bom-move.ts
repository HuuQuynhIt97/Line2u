export interface BOMMove {
  id: number;
  bomGuid: string;
  moveNo: string;
  moveName: string;
  comment: string;
  cancelFlag: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
  beforePenGuid: string;
  afterPenGuid: string;
  pigStatus: string;
  moveType: string;
  moveInOut: string;
  applyDays: any;
  beforePenName: string;
  afterPenName: string;
  moveInOutName: string;
  applyDaysName: string;
  pigStatusName: string;
  moveTypeName: string;
  applyEveryMonth: number;
  applyEveryDay: number;
}
