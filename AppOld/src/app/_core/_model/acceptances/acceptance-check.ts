export interface AcceptanceCheck {
  id: number;
  farmGuid: string;
  acceptanceGuid: string;
  checkDate: string | null;
  checkTime: string;
  checkDept: string;
  checkReason: string;
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
