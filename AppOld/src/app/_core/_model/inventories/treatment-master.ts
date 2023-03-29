export interface TreatmentMaster {
  id: number;
  diseaseGuid: string;
  treatmentNo: string;
  treatmentName: string;
  comment: string;
  cancelFlag: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
  diseaseName: string;
  
}