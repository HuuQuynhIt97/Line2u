export interface RecordImmunization {
  id: number;
  bioSMasterGuid: string;
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
  estDate: string | null;
  estTime: string;
  diseaseGuid: string;
  medicineGuid: string;
  useUnit: string;
  needle: string;
  applyDays: string;
}
