export interface Disease {
  id: number;
  diseaseType: string;
  diseaseNo: string;
  diseaseName: string;
  diseaseElement: string;
  diseaseEffect: string;
  diseaseCare: string;
  comment: string;
  cancelFlag: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
  farmGuid: string;
}

