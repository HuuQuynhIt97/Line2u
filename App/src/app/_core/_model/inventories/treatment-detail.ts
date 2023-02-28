export interface TreatmentDetail {
  id: number;
  treatmentGuid: string;
  medicineGuid: string;
  treatmentDose: number | null;
  treatmentTimes: number | null;
  comment: string;
  cancelFlag: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
  treatmentPercentage: string;
}