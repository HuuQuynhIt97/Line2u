export interface PigIsolation {
  id: number;
  type: string;
  upperGuid: string;
  recordDate: string | null;
  recordTime: string;
  isolation: string;
  comment: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
}
