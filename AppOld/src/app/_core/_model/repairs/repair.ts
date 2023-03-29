export interface Repair {
  id: number;
  farmGuid: string;
  repairDate: string | null;
  repairTime: string;
  repairNo: string;
  repairName: string;
  repairComment: string;
  accountGuid: string;
  rejectDate: string | null;
  rejectReason: string;
  rejectGuid: string;
  comment: string;
  cancelFlag: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
}
