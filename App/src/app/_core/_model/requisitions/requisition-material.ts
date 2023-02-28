export interface RequisitionMaterial {
  id: number;
  requisitionGuid: string;
  amount: number | null;
  price: number | null;
  cost: number | null;
  location: string;
  description: string;
  comment: string;
  cancelFlag: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
}
