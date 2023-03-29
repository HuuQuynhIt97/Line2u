export interface SalesOrderCheckOut {
  id: number;
  farmGuid: string;
  checkOutDate: string | null;
  checkOutTime: string;
  checkOutComment: string;
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
  salesOrderGuid: string;
}
