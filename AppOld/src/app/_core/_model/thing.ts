export interface Thing {
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
  status: number | null;
  guid: string;
  thingNo: string;
  thingName: string;
  thingType: string;
  qty: number | null;
}
