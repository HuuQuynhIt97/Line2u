export interface  RecordImmunization {
  id: number;
  farmGuid: string;
  makeOrderGuid: string;
  pigType: string;
  bioSMasterGuid: string;
  useType: string;
  capacity: string;
  frequency: string;
  recordDate: any | null;
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
  estDate: any | null;
  estTime: string;
  diseaseGuid: string;
  medicineGuid: string;
  useUnit: string;
  needle: string;
  applyDays: string;
  pigGuid: string;
  penGuid: string;
  disease: string;
  medicine: string;
  useTypeName: string;
  useUnitName: string;
  capacityName: string;
  frequencyName: string;
  needleName: string;
  applyDaysName: string;
  penGuidName: string;
  pigGuidName: string;
}