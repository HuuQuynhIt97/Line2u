export interface RepairDetail {
  id: number;
  farmGuid: string;
  repairDate: string | null;
  repairTime: string;
  repairDept: string;
  repairReason: string;
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
  repairGuid: string;
}
