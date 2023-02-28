export interface PigFarmVectorPlan {
  id: number;
  type: string;
  upperGuid: string;
  recordDate: string | null;
  recordTime: string;
  vectorPlan: string;
  comment: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
}
