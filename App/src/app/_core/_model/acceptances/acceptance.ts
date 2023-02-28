export interface Acceptance {
  id: number;
  farmGuid: string;
  requisitionGuid: string;
  acceptanceDate: string | null;
  acceptanceTime: string;
  acceptanceDept: string;
  acceptanceReason: string;
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
