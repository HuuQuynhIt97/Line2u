export interface Rfid {
  id: number;
  rfidNo: string;
  rfidName: string;
  rfidType: string;
  farmGuid: string;
  vendorGuid: string;
  spec: string;
  amount: number | null;
  price: number | null;
  cost: number | null;
  location: string;
  expireDate: any| null;
  comment: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  deleteDate: string | null;
  deleteBy: number | null;
  status: number | null;
  guid: string;
  locationName: string;
  qty: number | null;
}
