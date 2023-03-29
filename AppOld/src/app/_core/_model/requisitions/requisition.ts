export interface Requisition {
  id: number;
  farmGuid: string;
  requisitionDate: string | null;
  requisitionTime: string;
  requisitionDept: string;
  requisitionReason: string;
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
