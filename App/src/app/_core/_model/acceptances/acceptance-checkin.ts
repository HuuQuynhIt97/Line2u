export interface AcceptanceCheckIn {
  id: number;
  farmGuid: string;
  acceptanceGuid: string;
  checkInDate: string | null;
  checkInTime: string;
  checkInDept: string;
  checkInReason: string;
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
