export interface BioSRecord {
  id: number;
  bioSMasterGuid: string;
  vaccine: string;
  useType: string;
  capacity: string;
  frequency: string;
  recordDate: string | null;
  recordTime: string;
  comment: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  deleteDate: string | null;
  deleteBy: number | null;
  status: number | null;
  guid: string;
}
