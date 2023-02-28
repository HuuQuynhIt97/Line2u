export interface Material {
  id: number;
  farmGuid: string;
  vendorGuid: string;
  spec: string;
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
  deleteDate: string | null;
  deleteBy: number | null;
  status: number | null;
  guid: string;
  materialNo: string;
  materialName: string;
  materialType: string;
  expireDate: any | null;
  qty: number | null;
}
