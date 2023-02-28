export interface Inventory {
  id: number;
  farmGuid: string;
  inventoryNo: string;
  inventoryName: string;
  inventoryLocation: string;
  accountGuid: string;
  comment: string;
  cancelFlag: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
  inventoryLocationName: string;
}
