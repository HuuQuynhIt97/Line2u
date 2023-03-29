export interface BOMTreatment {
  id: number;
  bomGuid: string;
  treatmentType: string;
  treatmentName: string;
  treatmentMethod: string;
  treatmentMedicine: string;
  treatmentCare: string;
  methodType: string;
  methodFreq: number | null;
  methodUseTime: number | null;
  methodAmount: number | null;
  comment: string;
  cancelFlag: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
  treatmentTypeName: string;
  treatmentMedicineName: string;
}
