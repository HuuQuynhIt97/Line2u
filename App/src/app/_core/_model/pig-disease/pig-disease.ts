export interface PigDisease {
  id: number;
  type: string;
  pigType: string;
  recordDate: string | null;
  recordReason: string;
  recordGuid: string;
  approveDate: string | null;
  approveReason: string;
  approveGuid: string;
  rejectDate: string | null;
  rejectReason: string;
  rejectGuid: string;
  comment: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
   typeName: string;
  pigTypeName: string;
}
