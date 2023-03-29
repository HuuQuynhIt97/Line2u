export interface SalesOrder {
  id: number;
  farmGuid: string;
  salesOrderDate: string | null;
  salesOrderTime: string;
  salesOrderNo: string;
  salesOrderName: string;
  salesOrderComment: string;
  customerGuid: string;
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
